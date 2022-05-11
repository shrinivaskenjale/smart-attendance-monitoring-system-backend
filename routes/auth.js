// express
const express = require("express");
const router = express.Router();

// import controllers
const authController = require("../controllers/auth");

// routes
router.post("/login", authController.loginHandler);

router.post("/reset-password", authController.resetRequestHandler);

router.post("/reset-password/:userId/:token", authController.resetPassword);

// exports
module.exports = router;
