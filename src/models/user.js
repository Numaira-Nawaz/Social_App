const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      //select: false, //use of this will exclude this column from every select statment
    },
    friends: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
    },
    followers: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
    },
    friendRequests: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
    },
  },
  {
    toJSON: {
      transform(ret, doc) {
        delete doc.password;
      },
    },
    timestamps: true,
  }
);
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
UserSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  console.log("Password: ", password, " userPass:");
  return bcrypt.compare(password, user.password);
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
