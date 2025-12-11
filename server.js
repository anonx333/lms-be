import express from "express";
import config from "./src/config/config.js";
import { connectMongoDB } from "./src/config/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// routers
import authRouter from "./src/routes/authRouter.js";
import bookRouter from "./src/routes/bookRouter.js";
import userRouter from "./src/routes/userRouter.js";
import borrowRouter from "./src/routes/borrowRouter.js";
import reviewRouter from "./src/routes/reviewRouter.js";

const app = express();
const PORT = config.port;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// body populate
app.use(express.json());

// cors
app.use(cors());

app.get("/", (req, res) => {
  res.send("Library Management System BackEnd");
});

// static serve
app.use("/public", express.static(path.join(__dirname, "assets")));

// auth routes
app.use("/api/v1/auth", authRouter);

// user
// admin api
app.use("/api/v1/users", userRouter);

// book
app.use("/api/v1/books", bookRouter);

// borrows
app.use("/api/v1/borrows", borrowRouter);

// reviews
app.use("/api/v1/reviews", reviewRouter);

// error validator
app.use((error, req, res, next) => {
  console.log(error);

  res.status(error.status || 500);
  return res.json({
    status: "error",
    message: error.message,
  });
});

connectMongoDB()
  .then((data) => {
    console.log("MONGO CONNECTED");
    app.listen(PORT, () => {
      console.log(`Server running in port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO CONNECTION FAILED");
  });
