import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ItemSchema = new Schema(
  {
    category: { type: String, required: true },
    type: { type: String, required: true },
    model: { type: String, required: false },
    brand: { type: String, required: false },
    condition: { type: String, required: false},
    deposit: { type: String, required: false},
    amount: { type: Number, required: false },
    accessories: { type: String, required: false},
    file: { type: String, default: 'https://complianz.io/wp-content/uploads/2019/03/placeholder-300x202.jpg' },
    user: {type: Schema.Types.ObjectId, ref: "User", required: true} 
  },
  {
    timestamps: true,
  }
);
export default model("Item", ItemSchema)
