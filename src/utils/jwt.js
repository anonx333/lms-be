import JWT from "jsonwebtoken";
// import { insertToken } from "../models/session/SessionSchema.js";
// import { updateUser } from "../models/user/UserModel.js";
import config from "../config/config.js";

// create acess jwt
export const singAccessJWT = (payload) => {
  const token = JWT.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expires,
  });
  //   insertToken({ token });
  return token;
};

// verify acess jwt
export const verifyAccessJWT = (token) => {
  try {
    return JWT.verify(token, config.jwt.secret);
  } catch (error) {
    return error.message === "jwt expired" ? "jwt expired" : "Invalid Token";
  }
};

// create refresh jwt
export const singRefresJWT = ({ email }) => {
  const refreshJWT = JWT.sign({ email }, config.renewJwt.secret, {
    expiresIn: config.renewJwt.expires,
  });
  //   updateUser({ email }, { refreshJWT });
  return refreshJWT;
};

// verify refresh jwt
export const verifyRefreshJWT = (token) => {
  try {
    return JWT.verify(token, config.renewJwt.secret);
  } catch (error) {
    return "Invalid Token";
  }
};
