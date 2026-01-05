import express from "express";
import { ENV } from "./utils/ENV.js";
import { connectDB } from "./mongo DB/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalError } from "./middlewares/errorMiddlewares.js";
import userRouter from "./routes/user.router.js";
import categoryRouter from "./routes/category.router.js";
import subcategoryRouter from "./routes/subcategory.router.js";
import productRouter from "./routes/product.router.js";
import reviewRouter from "./routes/review.router.js";
import couponRouter from "./routes/coupon.router.js";
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/auth/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subcategoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/product/:productId/review", reviewRouter);
app.use("/api/v1/coupon", couponRouter);

app.use(globalError);

app.listen(ENV.PORT, () => {
  console.log(`Listening on PORT ${ENV.PORT}`);
  connectDB();
});
