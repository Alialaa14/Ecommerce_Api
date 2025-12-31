import express from "express";
import { ENV } from "./utils/ENV.js";
import { connectDB } from "./mongo DB/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalError } from "./middlewares/errorMiddlewares.js";
import userRouter from "./routes/user.router.js";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth/user", userRouter);

app.use(globalError);

app.listen(ENV.PORT, () => {
  console.log(`Listening on PORT ${ENV.PORT}`);
  connectDB();
});
