const { NoteModel, SharedNoteModel } = require("../model");
const {
  toMongoId,
  isValidMongoId,
  isMongoEqual,
} = require("../utils/commonUtil");
const authService = require("./authService");

const getNotes = async (id) => {
  return await NoteModel.find({ user: id })
    .populate({
      path: "user",
      select: "_id email",
    })
    .exec();
};

const addNote = async (payload) => {
  // validate
  if (!payload || !payload.userId) throw "User id is required";
  if (!payload || !payload.title || !payload.title.trim())
    throw "Title is required";
  if (!payload || !payload.description || !payload.description.trim())
    throw "Description is required";

  const { userId, title, description } = payload;

  //   add user note
  const note = new NoteModel({
    user: userId,
    title,
    description,
  });

  //   save
  return await note.save();
};

const getNoteById = async (payload) => {
  // validation
  if (!payload || !payload.userId) throw "User id is required";
  if (!payload || !payload.noteId) throw "Note id is required";

  const { userId, noteId } = payload;

  // get note by note id & user id
  const note = await NoteModel.findOne({ _id: noteId, user: userId })
    .populate({
      path: "user",
      select: "_id email",
    })
    .exec();

  if (!note) throw "Note not found for the user";

  return note;
};

const updateNoteById = async (payload) => {
  console.log(payload, "payload from update");
  // validation
  if (!payload || !payload.userId) throw "User id is required";
  if (!payload || !payload.noteId) throw "Note id is required";

  let { userId, noteId } = payload;
  noteId = await toMongoId(noteId);

  // get note by note id
  const note = await getNoteById({ noteId, userId });

  // if note not found, show error
  if (!note) throw "Note not found";

  // if found
  if (!payload || payload.title === undefined) payload.title = note.title;
  if (!payload || payload.description === undefined)
    payload.description = note.description;

  const { title, description } = payload;

  // update
  note.title = title;
  note.description = description;

  return await note.save();
};

const deleteNoteById = async (payload) => {
  console.log(payload, "payload from update");
  // validation
  if (!payload || !payload.userId) throw "User id is required";
  if (!payload || !payload.noteId) throw "Note id is required";

  let { userId, noteId } = payload;
  noteId = await toMongoId(noteId);

  // get note by note id
  const note = await getNoteById({ noteId, userId });

  // if note not found, show error
  if (!note) throw "Note not found";

  // delete
  return await NoteModel.deleteOne({ _id: noteId });
};

const shareNoteToUser = async (payload) => {
  //   validation
  if (!payload || !payload.fromUserId) throw "From user id is required";
  if (!payload || !payload.toUserId) throw "To user id is required";
  if (!payload || !payload.noteId) throw "Note id is required";

  let { fromUserId, toUserId, noteId } = payload;

  // valid mongo id
  if (!(await isValidMongoId(toUserId))) throw "Invalid to user id";
  if (!(await isValidMongoId(noteId))) throw "Invalid note id ";

  toUserId = await toMongoId(toUserId);
  noteId = await toMongoId(noteId);

  console.log(fromUserId, toUserId, noteId, "ids");

  //   same note cant be shared for the same user
  if (await isMongoEqual(fromUserId, toUserId))
    throw "You are not allowed to share note to yourself";

  // check if note exists for note id & from user id
  const note = await getNoteById({ userId: fromUserId, noteId });

  //   check if to user exists or not
  const toUser = await authService.getUserById(toUserId);

  // if not found, show error
  if (!toUser) throw "To user not found";

  //   check if note already shared with that user
  const sharedNote = await getSharedNote({ fromUserId, toUserId, noteId });

  //   if already shared from to, show error
  if (sharedNote) throw "Note already shared";

  //   if not shared, share it
  const share = new SharedNoteModel({
    fromUser: fromUserId,
    toUser: toUserId,
    note: noteId,
  });

  return await share.save();
};

const getSharedNote = async (payload) => {
  // validations
  if (!payload || !payload.fromUserId) throw "From user id is required";
  if (!payload || !payload.toUserId) throw "To user id is required";
  if (!payload || !payload.noteId) throw "Note id is required";

  const { fromUserId, toUserId, noteId } = payload;

  return await SharedNoteModel.findOne({
    fromUser: fromUserId,
    toUser: toUserId,
    note: noteId,
  });
};

const searchNote = async (payload) => {
  console.log(payload, "from search");
  if (!payload || !payload.userId) throw "User id is required";

  const { userId, q } = payload;

  //   if search present filter it else send all note for user
  if (q) {
    const query = {
      $and: [
        { user: userId },
        {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
          ],
        },
      ],
    };

    return await NoteModel.find(query).exec();
  } else {
    return await getNotes(userId);
  }
};

module.exports = {
  getNotes,
  addNote,
  getNoteById,
  updateNoteById,
  deleteNoteById,
  shareNoteToUser,
  getSharedNote,
  searchNote,
};
