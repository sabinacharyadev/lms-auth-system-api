import express from "express";
import { comparePassword, hashPassword } from "../utility/bcryptHelper.js";
import { createUser, findUserByEmail, updateUser } from "../model/userModel.js";
import { v4 as uuidv4 } from "uuid";
import { createSession, deleteSession } from "../model/sessionModel.js";
import {
  sendVerificationEmail,
  sendVerifiedEmail,
} from "../utility/nodeMailerHelper.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import { refreshAuth, userAuth } from "../middlewares/authMiddleware.js";
import { generateJWT } from "../utility/jwtHelper.js";

const userRouter = express.Router();

// Create User | POST
userRouter.post("/", async (req, res) => {
  try {
    // HASH THE PASSWORD
    const { password } = req.body;
    const hashedPassword = hashPassword(password);

    // Create user in DB | using QUERY
    const user = await createUser({ ...req.body, password: hashedPassword });

    // If user is created, send verification Email
    if (user?._id) {
      // generate the unique token
      const uniqueToken = uuidv4();
      // save this token and user email in session
      const session = await createSession({
        userEmail: user.email,
        token: uniqueToken,
      });

      if (session?._id) {
        // Build verification link
        const verificationLink = `${process.env.CLIENT_ROOT_URL}/verify-user?email=${user.email}&token=${uniqueToken}`;

        // Send verficaition email
        sendVerificationEmail(user.email, user.name, verificationLink);
      }
    }

    user?._id
      ? buildSuccessResponse(
          res,
          {},
          "Check your inbox/spam to verify your email"
        )
      : buildErrorResponse(res, "Could not register the user");
  } catch (error) {
    if (error.code === 11000) {
      error.message = "User with this email already exists!!";
    }

    buildErrorResponse(res, error.message);
  }
});

userRouter.patch("/", async (req, res) => {
  try {
    // get userEmail and token from req body
    const { userEmail, token } = req.body;

    // check if the userEMail and token record exist in our session
    const result = await deleteSession({ userEmail, token });

    // if token and email exist in our session, proceed, else don't proceed
    if (!result) {
      return buildErrorResponse(res, "Invalid Link");
    }

    // Valid Link

    // Go and find the user in the db and update it
    const user = await updateUser({ email: userEmail }, { isVerified: true });

    if (user?._id) {
      // send verified email
      sendVerifiedEmail(user.email, user.name);
    }

    user?._id
      ? buildSuccessResponse(res, {}, "Successfully verified, please login")
      : buildErrorResponse(res, "Could not verify");
  } catch (error) {
    buildErrorResponse(res, "Could not verify");
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user in database
    const user = await findUserByEmail(email);

    // if no user found
    if (!user?._id) {
      buildErrorResponse(res, "Invalid Credentials");
      return;
    }

    // check if user is verified
    if (!user?.isVerified) {
      buildErrorResponse(res, "Please verify your account before login");
      return;
    }

    // compare password
    const isPasswordMatched = comparePassword(password, user.password);

    if (!isPasswordMatched) {
      buildErrorResponse(res, "Invalid Credentials");
      return;
    }

    // Build JWT
    const jwt = generateJWT(user.email);

    // add to session storage
    const sessionStorage = await createSession({
      userEmail: user.email,
      token: jwt.accessJWT,
    });

    sessionStorage?._id
      ? buildSuccessResponse(res, jwt, "logged In successfully")
      : buildErrorResponse(res, "Could not start session");
  } catch (error) {
    console.log(error);

    buildErrorResponse(res, "Something went wrong");
  }
});

// Private Endpoint
// GET user
userRouter.get("/", userAuth, async (req, res) => {
  try {
    buildSuccessResponse(res, req.userInfo);
  } catch (error) {
    buildErrorResponse(res, "User not found");
  }
});

// GET Access token - private route
userRouter.get("/accessjwt", refreshAuth, async (req, res) => {
  try {
    if (req.userInfo) {
      const { email } = req.userInfo;
      // Build JWT
      const accessJWT = generateAccessJWT(email);

      // add to session storage
      const sessionStorage = await createSession({
        userEmail: email,
        token: accessJWT,
      });

      sessionStorage?._id
        ? buildSuccessResponse(res, accessJWT, "")
        : buildErrorResponse(res, "Invalid token!!");
    }
  } catch (error) {
    buildErrorResponse(res, "Invalid token!!");
  }
});

export default userRouter;
