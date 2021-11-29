const mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {type:String,default:""},
    dob: {type:String,default:""},
    experience: {type:String,default:""},
    resume: {type:String,default:""},
    location: {type:String,default:""},
    address: {type:String,default:""},
    currentEmployer: {type:String,default:""},
    currentDesignation: {type:String,default:""},
  },
  { timestamps: true }
);

const UserCollection = new mongoose.model("user", userSchema);

module.exports = UserCollection;
