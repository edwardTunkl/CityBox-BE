import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ItemSchema = new Schema(
  {
    category: { type: String, required: true },
    type: { type: String, required: true },
    model: { type: String, required: false },
    brand: { type: String, required: false },
    condition: { type: String, required: true },
    deposit: { type: Boolean, required: true, default: false },
    amount: { type: Number, required: false },
    accessories: { type: Boolean, required: true, default: false },
    user: {type: Schema.Types.ObjectId, ref: "User", required: true} 
  },
  {
    timestamps: true,
  }
);
export default model("Item", ItemSchema)
