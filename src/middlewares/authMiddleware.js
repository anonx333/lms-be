// import { findToken } from "../models/session/SessionSchema.js";
import { getUserByEmail } from "../models/users/UserModel.js";
import { verifyAccessJWT, verifyRefreshJWT } from "../utils/jwt.js";

export const auth = async (req, res, next) => {
  try {
    //     1. receive jwt via authorization header
    const { authorization } = req.headers;

    // 2. verify if jwt is valid(no expired, secretkey) by decoding jwt
    const decoded = verifyAccessJWT(authorization);

    if (decoded?.email) {
      // 3. Check if the token exist in the DB, session table
      //   TODO: find session
      //   const tokenObj = await findToken(authorization);

      const tokenObj = authorization;

      if (true) {
        // 4. Extract email from the decoded jwt obj
        // 5. Get user by email
        const user = await getUserByEmail(decoded.email);

        if (user?._id && user?.accessJWT === authorization) {
          // 6. If user exist, they are now authorized

          user.password = "";
          req.userInfo = user;

          return next();
        }
      }
    }

    const error = {
      message: "User not Authenticated",
      status: 403,
    };
    next(error);
  } catch (error) {
    next(error);
  }
};

export const rewnewauth = async (req, res, next) => {
  try {
    //     1. receive jwt via authorization header
    const { authorization } = req.headers;

    // 2. verify if jwt is valid(no expired, secretkey) by decoding jwt
    const decoded = verifyRefreshJWT(authorization);

    if (decoded?.email) {
      // 3. Check if the token exist in the DB, session table
      //   TODO: find session
      //   const tokenObj = await findToken(authorization);

      const tokenObj = authorization;

      if (true) {
        // 4. Extract email from the decoded jwt obj
        // 5. Get user by email
        const user = await getUserByEmail(decoded.email);

        if (user?._id) {
          // 6. If user exist, they are now authorized

          user.password = "";
          req.userInfo = user;

          return next();
        }
      }
    }

    const error = {
      message: decoded,
      status: 403,
    };
    next(error);
  } catch (error) {
    next(error);
  }
};

export const isAdmin = async (req, res, next) => {
  req.userInfo.role === "admin"
    ? next()
    : next({
        status: 403,
        message: "Unauthorized",
      });
};
