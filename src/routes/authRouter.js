import express from "express";
import {
  createUser,
  loginUser,
  renewToken,
} from "../controllers/authControllers.js";
import {
  loginValidation,
  newUserValidation,
} from "../middlewares/joiValidation.js";
import { auth, rewnewauth } from "../middlewares/authMiddleware.js";
import { fetchUserDetail } from "../controllers/userControllers.js";

const router = express.Router();

// api/v1/auth/register
router.post("/register", newUserValidation, createUser);

// api/v1/auth/login
router.post("/login", loginValidation, loginUser);

// api/v1/auth/renew-jwt
// renew token authenticator
router.get("/renew-jwt", rewnewauth, renewToken);

// api/v1/auth/users
router.get("/users", auth, fetchUserDetail);

export default router;
