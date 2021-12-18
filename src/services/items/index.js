import express from "express";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import ItemSchema from "./schema.js";
import RequestSchema from "../requests/schema.js";
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"


const itemRouter = express.Router();

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: "itemPicture",
  },
})


//---POST item---

itemRouter.post("/:userId", async (req, res, next) => {
  try {
    const newItem = new ItemSchema({
      ...req.body,
      user: mongoose.Types.ObjectId(req.params.userId),
    });
    const { _id } = await newItem.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

//POST picture with item---

itemRouter.post("/:itemId/picture", multer({ storage: cloudStorage }).single("itemPic"), async (req, res, next) => {
  try {
      const itemId = mongoose.Types.ObjectId(req.params.itemId)
      const modifiedItem = await ItemSchema.findByIdAndUpdate(itemId, { $set: { file: req.file.path } }, {
          new: true,
      })

      if (modifiedItem) {
          res.send(modifiedItem)
      } else {
          next(createHttpError(404, `item with id ${itemId} not found!`))
      }
  } catch (error) {
      next(error)
  }
})

//---GET items---

itemRouter.get("/", async (req, res, next) => {
  try {
    const category = req.query.category;
    const type = req.query.type;
    const model = req.query.model;
    const brand = req.query.brand;
    let item;

    if (!category && !type && !model && !brand) {
      item = await ItemSchema.find({}).populate('user')
    } else {
      item = await ItemSchema.find({
        $or: [
          { category: new RegExp(category, 'i') },
          { type: new RegExp(type, 'i') },
          { model: new RegExp(model, 'i') },
          { brand:new RegExp(brand, 'i') },
        ],
      }).populate('user');
    }
    res.status(200).send(item);
  } catch (error) {
    next(error);
  }
});

//---GET item by ID---

itemRouter.get("/:id", async (req, res, next) => {
  try {
    const item = await ItemSchema.findById(req.params.id);

    if (item) {
      res.send(item);
    } else {
      next(createHttpError(404, `Item not found`));
    }
  } catch (error) {
    next(error);
  }
});

//---GET item by UserID---

itemRouter.get("/user/:id", async (req, res, next) => {
  try {
    const item = await ItemSchema.find({user: req.params.id});

    if (item) {
      res.send(item);
    } else {
      next(createHttpError(404, `Item not found`));
    }
  } catch (error) {
    next(error);
  }
});

//---PUT item by ID---

itemRouter.put("/:id", async (req, res, next) => {
  try {
    const modifiedItem = await ItemSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (modifiedItem) {
      res.send(modifiedItem);
    } else {
      next(createHttpError(404, `Item not found`));
    }
  } catch (error) {
    next(error);
  }
});

//---DEL item by ID---

itemRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedItem = await ItemSchema.findByIdAndDelete(req.params.id);

    if (deletedItem) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Item not found`));
    }
  } catch (error) {
    next(error);
  }
});

//---POST request by ID---

itemRouter.post("/:id/request", async (req, res, next) => {
  try {
    const newRequest = new RequestSchema({
      ...req.body,
      sender: mongoose.Types.ObjectId(req.params.id),
      reciever: mongoose.Types.ObjectId(req.body.user),
    });
  } catch (error) {
    next(error);
  }
});

export default itemRouter;
