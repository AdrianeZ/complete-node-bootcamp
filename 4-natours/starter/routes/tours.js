const express = require("express");
const {
    getAllTour, getTour, addTour,
    deleteTour, updateTour, aliasTopTour
} = require("../controllers/tourController");

const router = express.Router();

router.route("/top-5-cheap").get(aliasTopTour, getAllTour);
router.route("/").post(addTour).get(getAllTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;