const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const noteController = require("../controller/noteController");

const router = express.Router();

// routes
router.get("/", authMiddleware.isAuthenticated, noteController.getNotes);
router.post("/", authMiddleware.isAuthenticated, noteController.addNote);
router.get(
  "/search",
  authMiddleware.isAuthenticated,
  noteController.searchNote
);
router.get(
  "/:noteId",
  authMiddleware.isAuthenticated,
  noteController.getNoteById
);
router.put(
  "/:noteId",
  authMiddleware.isAuthenticated,
  noteController.updateNoteById
);
router.delete(
  "/:noteId",
  authMiddleware.isAuthenticated,
  noteController.deleteNoteById
);
router.post(
  "/:noteId/share",
  authMiddleware.isAuthenticated,
  noteController.shareNoteToUser
);

// export
module.exports = router;
