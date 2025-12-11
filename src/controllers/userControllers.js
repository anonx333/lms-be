import { getUsers } from "../models/users/UserModel.js";

export const fetchUserDetail = async (req, res, next) => {
  try {
    // get user info

    return res.json({
      status: "success",
      message: "User found!",
      user: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchUsers = async (req, res, next) => {
  try {
    // get user info

    let users = await getUsers({});

    return res.json({
      status: "success",
      message: "Users found!",
      users,
    });
  } catch (error) {
    next(error);
  }
};
