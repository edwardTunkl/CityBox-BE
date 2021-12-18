import express from "express";
import createHttpError from "http-errors";

import UserSchema from "./schema.js";
import { JWTAuthenticate } from "../../auth/jwtTools.js";
import { JWTAuthMiddleware } from "../../auth/token.js";

const userRouter = express.Router();

//---GET all Users---

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserSchema.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

//---POST register User---

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserSchema(req.body);
    const { _id } = await newUser.save();
    const accessToken = await JWTAuthenticate(newUser);
    res.send({ ...newUser.toObject(), accessToken });

  } catch (error) {
    next(error);
  }
});

//---POST login User---

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserSchema.checkCredentials(email, password);

    if (user) {
      const accessToken = await JWTAuthenticate(user);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error)
  }
});

//---GET me---

userRouter.get("/me", JWTAuthMiddleware, async (req, res, next) =>{
  try {
    console.log(req.user)
    res.send(req.user)
  } catch (error) {
    next(error)
  }
})

//---PUT me---

userRouter.put("/me", JWTAuthMiddleware, async (req, res, next) =>{
  try {
    const filter = {_id: req.user._id}
    const update = {...req.body}
    const updatedUser = await UserSchema.findOneAndUpdate(filter, update, {returnNewDocument: true})
    await updatedUser.save()
    res.send(updatedUser)
  } catch (error) {
    next(error)
  }
})


//---GET user by Id---

userRouter.get("/:id", async(req, res, next) =>{
  try {
    const user = await UserSchema.findById(req.params.id).populate("connectedUsers")
    res.send(user)
  } catch (error) {
    next(error)
  }
})

//---PUT user by Id, add connectedUser ---

userRouter.put("/me/add/:neighbourId", JWTAuthMiddleware, async (req, res, next) =>{
  try {
    const filter = {_id: req.user._id}
    console.log("THIS IS FILTER", filter)
    const update = {$push: {connectedUsers: req.params.neighbourId}}
    console.log("THIS IS UPDATED NEIGHBOUR",update)
    const updatedUser = await UserSchema.findOneAndUpdate(filter, update, {returnNewDocument: true})
    await updatedUser.save()
    res.send(updatedUser)
    console.log("UPDATED USER", updatedUser)
  } catch (error) {
    next(error)
  }
})


export default userRouter;
