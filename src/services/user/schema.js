import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    street: { type: String, required: true },
    number: { type: Number, required: true },
    postcode: { type: Number, required: true },
    city: { type: String, required: true },
    rating: { type: Number, required: true , default: '5'},
    schedule: {
      MoStH: {type: String, required: false, default: '-'},
      MoStM: {type: String, required: false, default: '-'},
      MoEH: {type: String, required: false, default: '-'},
      MoEM: {type: String, required: false, default: '-'},
      TuStH: {type: String, required: false, default: '-'},
      TuStM: {type: String, required: false, default: '-'},
      TuEH: {type: String, required: false, default: '-'},
      TuEM: {type: String, required: false, default: '-'},
      WeStH: {type: String, required: false, default: '-'},
      WeStM: {type: String, required: false, default: '-'},
      WeEH: {type: String, required: false, default: '-'},
      WeEM: {type: String, required: false, default: '-'},
      ThStH: {type: String, required: false, default: '-'},
      ThStM: {type: String, required: false, default: '-'},
      ThEH: {type: String, required: false, default: '-'},
      ThEM: {type: String, required: false, default: '-'},
      FrStH: {type: String, required: false, default: '-'},
      FrStM: {type: String, required: false, default: '-'},
      FrEH: {type: String, required: false, default: '-'},
      FrEM: {type: String, required: false, default: '-'},
      SaStH: {type: String, required: false, default: '-'},
      SaStM: {type: String, required: false, default: '-'},
      SaEH: {type: String, required: false, default: '-'},
      SaEM: {type: String, required: false, default: '-'},
      SuStH: {type: String, required: false, default: '-'},
      SuStM: {type: String, required: false, default: '-'},
      SuEH: {type: String, required: false, default: '-'},
      SuEM: {type: String, required: false, default: '-'},
    },
    connectedUsers: [
      { type: Schema.Types.ObjectId, ref: "User", required: false },
    ],
    requests: [
      { type: Schema.Types.ObjectId, ref: "Requests", required: false },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const User = this;
  if (User.isModified("password")) {
    User.password = await bcrypt.hash(User.password, 10);
  }
  next();
});

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

UserSchema.statics.checkCredentials = async function (email, plainPw) {
  const user = await this.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(plainPw, user.password);

    if (isMatch) return user;
    else return null;
  } else return null;
};

export default model("User", UserSchema);
