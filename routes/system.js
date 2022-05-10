// express
const express = require("express");
const router = express.Router();

// import controllers
const systemController = require("../controllers/system");

// routes

router.post("/new-attendance", systemController.createNewAttendance);

router.post("/mark-attendance/:attendanceId", systemController.markAttendance);

router.get("/images", systemController.getImageUrls);

// exports
module.exports = router;
