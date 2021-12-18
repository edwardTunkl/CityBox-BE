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

//---POST request---

requestRouter.post("/", async (req, res, next) => {
  try {
    const newRequest = new RequestSchema({
      ...req.body,
      itemId: mongoose.Types.ObjectId(req.body.itemId),
      sender: mongoose.Types.ObjectId(req.body.sender),
      reciever: mongoose.Types.ObjectId(req.body.reciever),
    });
    const { _id } = await newRequest.save();
    res.send(newRequest);
  } catch (error) {
    next(error);
  }
});

//---GET request by Id---

requestRouter.get("/:id", async (req, res, next) => {
  try {
    const requests = await RequestSchema.find({
      reciever: req.params.id,
    })
      .populate("sender")
      .populate("itemId")
      .populate("reciever");
    if (requests) {
      res.status(200).send(requests);
    } else {
      next(createHttpError(404, `Request not found`));
    }
  } catch (error) {
    next(error);
  }
});

//---GET accepted requests by Id---

requestRouter.get("/accepted/:id", async (req, res, next) => {
  try {
    const requests = await RequestSchema.find({
      sender: req.params.id,
    })
      .populate("sender")
      .populate("itemId")
      .populate("reciever");
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
      { sender: req.params.id },
      req.body,
      { new: true }
    );
    if (updatedRequest) {
      res.status(200).send(updatedRequest);
    } else {
      next(createHttpError(404, `Request not found`));
    }
  } catch (error) {
    next(error);
  }
});

//---PUT request by senderId and itemId---

requestRouter.put("/:id/:itemId", async (req, res, next) => {
  try {
    const filter = {
      sender: mongoose.Types.ObjectId(req.params.id),
      itemId: mongoose.Types.ObjectId(req.params.itemId),
    };
    console.log("THIS IS FILTER", filter);
    const update = { ...req.body };
    console.log("THIS IS UPDATE", update);
    const updatedRequest = await RequestSchema.findOneAndUpdate(
      filter,
      update,
      { returnNewDocument: true }
    );
    await updatedRequest.save();
    res.send(updatedRequest);
    console.log("UPDATED USER", updatedRequest);
  } catch (error) {
    next(error);
  }
});

//DEL request by senderId and itemId---

requestRouter.delete("/:id/:itemId", async (req, res, next) => {
  try {
    const filter = {
      sender: mongoose.Types.ObjectId(req.params.id),
      itemId: mongoose.Types.ObjectId(req.params.itemId),
    };
    console.log("THIS IS FILTER", filter);

    const deletedRequest = await RequestSchema.findOneAndDelete(filter);
    if (deletedRequest) {
      res.status(204).send()
  } else {
      next(createHttpError(404, `Request with ids ${sender} and ${itemId} is not found `))
  }
  } catch (error) {
    next(error);
  }
});

//---DEL request by Id---

requestRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedRequest = await RequestSchema.findByIdAndDelete(id);
  } catch (error) {
    next(error);
  }
});
export default requestRouter;
