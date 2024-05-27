import express from "express";
import { IUser } from "../user.interace";
import { QueryOptions } from "../../middlewares";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      queryOptions?: QueryOptions;
    }
  }
}
