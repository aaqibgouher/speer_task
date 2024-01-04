const express = require("express");
const authController = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authMiddleware.isAuthenticated, authController.logout);
router.get("/me", authMiddleware.isAuthenticated, authController.getMe);

// export
module.exports = router;
