import jwt from "jsonwebtoken";

// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

// Generate Access JWT
export const generateAccessJWT = (email) => {
  const accessJWT = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  return accessJWT;
};

// Generate Access JWT
const generaterefreshJWT = (email) => {
  const refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  return refreshJWT;
};

// Generate JWT
export const generateJWT = (email) => {
  return {
    accessJWT: generateAccessJWT(email),
    refreshJWT: generaterefreshJWT(email),
  };
};

// Verify Access JWT
export const verifyAccessJWT = (accessJWT) => {
  return jwt.verify(accessJWT, process.env.JWT_ACCESS_SECRET);
};

// Verify Refresg JWT
export const verifyRefreshJWT = (refreshJWT) => {
  return jwt.verify(refreshJWT, process.env.JWT_REFRESH_SECRET);
};
