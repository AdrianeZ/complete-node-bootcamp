const express = require("express");
const {
  getAllTour, getTour, addTour, checkBody,
  deleteRouter, updateTour, checkId
} = require("../controllers/tourController");

const router = express.Router();

router.param("id", checkId);
router.route("/").post(checkBody, addTour).get(getAllTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteRouter);

module.exports = router;