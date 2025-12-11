import mongoose from "mongoose";
import User from "../../models/users/UserSchema.js"; // Adjust path to your User model
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Seed Admin User
const seedAdmin = async () => {
  await connectDB();

  const adminEmail = "admin@gmail.com";

  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      process.exit(0);
    }

    // Create new admin
    const hashedPassword = await hashPassword("admin123"); // Change this in production!

    const adminUser = new User({
      role: "admin",
      fName: "Admin",
      lName: "User",
      phone: "1234567890",
      email: adminEmail,
      password: hashedPassword,
      refreshJWT: "",
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@gmail.com");
    console.log("Password: admin123 (Change immediately in production!)");
  } catch (err) {
    console.error("Error seeding admin:", err.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedAdmin();
