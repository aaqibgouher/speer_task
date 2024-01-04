const express = require("express");

const router = express.Router();
const authRoutes = require("./authRoutes");
const noteRoutes = require("./noteRoutes");

router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);

// export
module.exports = router;
