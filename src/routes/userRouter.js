import express from "express";
import { auth, isAdmin } from "../middlewares/authMiddleware.js";
import { fetchUsers } from "../controllers/userControllers.js";

const router = express.Router();
//get user data
// api/v1/users
router.get("/", auth, isAdmin, fetchUsers);

export default router;
