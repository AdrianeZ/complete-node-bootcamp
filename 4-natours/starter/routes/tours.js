const {readFileSync} = require("fs");
const {writeFile} = require("fs").promises;
const express = require("express");

const toursRouter = express.Router();

const TOURS_PATH = `${__dirname}/../dev-data/data/tours-simple.json`;

const tours = JSON.parse(readFileSync(TOURS_PATH));

toursRouter.get("/tours", (req, res) => {
    res.json(
        {
            message: "success",
            results: tours.length,
            data: {
                tours
            }
        }
    )
})

    .get("/tours/:id", (req, res) => {
        const {id} = req.params;
        const tour = tours[Number(id)];
        res.json({
            message: "success",
            data: {
                tour
            }
        })
    })

    .post("/tours", async (req, res) => {
        const newId = tours[tours.length - 1].id + 1;
        const newTour = Object.assign({id: newId}, req.body);
        tours.push(newTour);
        await writeFile(TOURS_PATH, JSON.stringify(tours));
        res.status(201).json(
            {
                message: "success",
                data: {
                    tour: newTour
                }
            }
        )
    })

module.exports = toursRouter;