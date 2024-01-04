const mongoose = require("mongoose");

// shared note schema
const sharedNoteSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    toUser: {
      type: mongoose.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    note: {
      type: mongoose.Types.ObjectId,
      ref: "NoteModel",
      required: true,
    },
  },
  { timestamps: true }
);

// model
const SharedNoteModel = mongoose.model(
  "SharedNoteModel",
  sharedNoteSchema,
  "shared_notes"
);

// export
module.exports = SharedNoteModel;
