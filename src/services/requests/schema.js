import mongoose from "mongoose";

const { Schema, model } = mongoose;

const RequestSchema = new Schema(
  {
    timeH: { type: String, required: true, default: '-'},
    timeM: { type: String, required: true, default: '-'},
    date: { type: Date, required: true },
    message: { type: String, required: false },
    active: {type: Boolean, required: true, default: true},
    accepted: {type: Boolean, required: true, default: false},
    itemId: {type: Schema.Types.ObjectId, ref: "Item", required: true},
    sender: {type: Schema.Types.ObjectId, ref: "User", required: true},
    reciever: {type: Schema.Types.ObjectId, ref: "User", required: true}
  },
  { timestamps: true }
);

export default model("Request", RequestSchema)
