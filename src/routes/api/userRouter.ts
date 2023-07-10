import express from "express";
import {
  getUsers,
  postMessageToUser,
} from "../../controllers/api/userController";

const userRouter = express.Router();

// Route for retrieving all users
userRouter.get("/", getUsers);

// Route for posting a new message to the user's messages array
userRouter.post("/:userId/messages", postMessageToUser);

export default userRouter;
