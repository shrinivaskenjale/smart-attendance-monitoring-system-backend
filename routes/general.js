// express
const express = require("express");
const router = express.Router();

// import controllers
const generalController = require("../controllers/general");
const { protectRoute } = require("../middlewares/auth");

// routes
router.get(
  "/get-students/:divisionId",
  protectRoute,
  generalController.getStudents
);
router.get(
  "/get-details/:userId",
  protectRoute,
  generalController.getUserDetails
);
router.get("/get-faculty", protectRoute, generalController.getFaculty);
router.get("/get-classes", generalController.getDivisions);
router.get("/get-classes/:divisionId", generalController.getSingleDivision);

// exports
module.exports = router;
