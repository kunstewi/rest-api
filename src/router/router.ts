import express from "express";

import authenticationRouter from "./authenticationRouter";
import userRouter from "./userRouter";

const router = express.Router();

export default (): express.Router => {
  authenticationRouter(router);
  userRouter(router);
  return router;
};
