import {
  createNewUser,
  getUserByEmail,
  updateUser,
} from "../models/users/UserModel.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { singAccessJWT, singRefresJWT } from "../utils/jwt.js";

export const createUser = async (req, res, next) => {
  try {
    // create user

    const userObject = req.body;
    userObject.password = hashPassword(req.body.password);

    const user = await createNewUser(userObject);

    return res.json({
      status: "success",
      message: "User created",
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    // get email from request

    const { email, password } = req.body;

    const user = await getUserByEmail(email);

    if (user) {
      // compare password
      if (comparePassword(password, user.password)) {
        const payload = { email };
        // access token
        const accessJWT = singAccessJWT(payload);

        // renew token
        const refreshJWT = singRefresJWT(payload);

        // update refreshJWT to user data
        const data = updateUser({ _id: user._id }, { accessJWT, refreshJWT });

        // send them as response
        return res
          .cookie("jwt", accessJWT, {
            domain: ".test.com", // note leading dot
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none", // allow cross-site requests (for cross-origin subdomain calls)
            maxAge: 60 * 60 * 1000,
          })
          .json({
            status: "success",
            message: "User authenticated",
            tokens: {
              accessJWT,
              refreshJWT,
            },
          });
      } else {
        const error = {
          message: "Invalid Credentials",
        };
        next(error);
      }
    } else {
      const error = {
        message: "User not found",
      };
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

// logic to create new access token
export const renewToken = async (req, res, next) => {
  try {
    const payload = { email: req.userInfo.email };
    // access token
    const accessJWT = singAccessJWT(payload);

    // update tokens to user data
    const data = updateUser({ _id: user._id }, { accessJWT });

    return res.json({
      status: "success",
      message: "User authenticated",
      tokens: {
        accessJWT,
      },
    });
  } catch (error) {
    next(error);
  }
};
