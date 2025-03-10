import { getSession } from "../model/sessionModel.js";
import { findUserByEmail } from "../model/userModel.js";
import {
  generateAccessJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
} from "../utility/jwtHelper.js";
import { buildErrorResponse } from "../utility/responseHelper.js";

export const userAuth = async (req, res, next) => {
  try {
    // get accessJWT fron req headers
    const { authorization } = req.headers;

    const decodedAccessJWT = verifyAccessJWT(authorization);

    if (!decodedAccessJWT?.email) {
      buildErrorResponse(res, "Invalid auth token");
      return;
    }

    // if valid token
    // check in session if the email and token combo exists
    const session = await getSession({
      userEmail: decodedAccessJWT.email,
      token: authorization,
    });

    if (!session?._id) {
      buildErrorResponse(res, "Invalid auth token");
      return;
    }

    // get user info
    const user = await findUserByEmail(decodedAccessJWT.email);

    if (user?._id && user?.isVerified) {
      user.password = undefined;
      req.userInfo = user;

      // proceed with the request
      return next();
    }

    throw new Error("Invalid auth token");
  } catch (error) {
    buildErrorResponse(res, "Invalid auth token");
  }
};

export const refreshAuth = async (req, res, next) => {
  try {
    // get refreshJWT fron req headers
    const { authorization } = req.headers;

    const decodedrefreshJWT = verifyRefreshJWT(authorization);

    if (!decodedrefreshJWT?.email) {
      buildErrorResponse(res, "Invalid token!!!");
      return;
    }

    // get user info
    const user = await findUserByEmail(decodedrefreshJWT.email);

    if (user?._id && user?.isVerified) {
      req.userInfo = user;
      next();
      return;
    }

    throw new Error("Invalid token!!");
  } catch (error) {
    buildErrorResponse(res, "Invalid token!!");
  }
};
