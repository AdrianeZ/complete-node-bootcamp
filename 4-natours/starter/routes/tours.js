const express = require("express");
const {
    getAllTour, getTour, addTour,
    deleteTour, updateTour, aliasTopTour, getTourStats, getMonthlyPlan
} = require("../controllers/tourController");

const {protect, authorize} = require("../controllers/authController")

const router = express.Router();

router.route("/stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/top-5-cheap").get(aliasTopTour, getAllTour);
router.route("/").post(addTour).get(protect, getAllTour);
router.route("/:id").get(getTour).patch(updateTour).delete(protect, authorize("admin", "lead-guide"), deleteTour);

module.exports = router;