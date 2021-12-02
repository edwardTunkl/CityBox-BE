import mongoose from "mongoose";

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
    rating: { type: Number, required: false },
    schedule: {
      Monday: {
        startTime: { type: Date, required: false },
        endTime: { type: Date, required: false },
      },
      Tuesday: {
        startTime: { type: Date, required: false },
        endTime: { type: Date, required: false },
      },
      Wednesday: {
        startTime: { type: Date, required: false },
        endTime: { type: Date, required: false },
      },
      Thursday: {
        startTime: { type: Date, required: false },
        endTime: { type: Date, required: false },
      },
      Friday: {
        startTime: { type: Date, required: false },
        endTime: { type: Date, required: false },
      },
      Saturday: {
        startTime: { type: Date, required: false },
        endTime: { type: Date, required: false },
      },
      Sunday: {
        startTime: { type: Date, required: false },
        endTime: { type: Date, required: false },
      },
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
