import express from "express";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import RequestSchema from "./schema.js";

const requestRouter = express.Router();

//---GET all requests---

requestRouter.get("/", async (req, res, next) => {
  try {
    const requests = await RequestSchema.find();
    res.send(requests);
  } catch (error) {
    next(error);
  }
});

//---GET request by Id---

requestRouter.get("/:id", async (req, res, next) => {
  try {
    const requests = await RequestSchema.find({
      reciever: req.params.id,
    }).populate("sender");
    if (requests) {
      res.status(200).send(requests);
    } else {
      next(createHttpError(404, `Request not found`));
    }
  } catch (error) {
    next(error);
  }
});

//---PUT request by Id---

requestRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedRequest = await RequestSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if(updatedRequest){
      res.status(200).send(updatedRequest)
    } else {
      next(createHttpError(404, `Request not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default requestRouter;
