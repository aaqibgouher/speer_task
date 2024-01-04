const noteService = require("../service/noteService");

const getNotes = async (req, res) => {
  try {
    const { _id } = req.user;

    const data = await noteService.getNotes(_id);

    return res.json({
      status: 200,
      message: "Successfully get notes",
      data,
    });
  } catch (error) {
    console.log(error, "from get notes controller");
    return res.json({ status: 400, error });
  }
};

const addNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { _id } = req.user;

    const data = await noteService.addNote({ userId: _id, title, description });

    return res.json({
      status: 200,
      message: "Successfully added note",
      data,
    });
  } catch (error) {
    console.log(error, "from add note controller");
    return res.json({ status: 400, error });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { _id } = req.user;
    const { noteId } = req.params;

    const data = await noteService.getNoteById({ userId: _id, noteId });

    return res.json({
      status: 200,
      message: "Successfully get note by id",
      data,
    });
  } catch (error) {
    console.log(error, "from get note by id controller");
    return res.json({ status: 400, error });
  }
};

const updateNoteById = async (req, res) => {
  try {
    const { _id } = req.user;
    const { noteId } = req.params;
    const { title, description } = req.body;

    const data = await noteService.updateNoteById({
      userId: _id,
      noteId,
      title,
      description,
    });

    return res.json({
      status: 200,
      message: "Successfully updated note by id",
      data,
    });
  } catch (error) {
    console.log(error, "from update note by id controller");
    return res.json({ status: 400, error });
  }
};

const deleteNoteById = async (req, res) => {
  try {
    const { _id } = req.user;
    const { noteId } = req.params;

    const data = await noteService.deleteNoteById({
      userId: _id,
      noteId,
    });

    return res.json({
      status: 200,
      message: "Successfully deleted note by id",
      data,
    });
  } catch (error) {
    console.log(error, "from delete note by id controller");
    return res.json({ status: 400, error });
  }
};

const shareNoteToUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const { noteId } = req.params;
    const { toUserId } = req.query;

    const data = await noteService.shareNoteToUser({
      fromUserId: _id,
      toUserId,
      noteId,
    });

    return res.json({
      status: 200,
      message: "Successfully shared note to user",
      data,
    });
  } catch (error) {
    console.log(error, "from shared note to user controller");
    return res.json({ status: 400, error });
  }
};

const searchNote = async (req, res) => {
  try {
    const { _id } = req.user;
    const { q } = req.query;

    const data = await noteService.searchNote({ userId: _id, q });

    return res.json({
      status: 200,
      message: "Successfully searched note",
      data,
    });
  } catch (error) {
    console.log(error, "from searched note controller");
    return res.json({ status: 400, error });
  }
};

module.exports = {
  getNotes,
  addNote,
  getNoteById,
  updateNoteById,
  deleteNoteById,
  shareNoteToUser,
  searchNote,
};
