/* /api */
import express from "express";
import userRouter from "./userRouter";

const apiRouter = express.Router();

/**
 * Managing the users resource
 */
apiRouter.use("/users", userRouter);

export default apiRouter;
