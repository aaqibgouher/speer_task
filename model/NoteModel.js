const mongoose = require("mongoose");

// notes schema
const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "UserModel",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// model
const NoteModel = mongoose.model("NoteModel", noteSchema, "notes");

// export
module.exports = NoteModel;
