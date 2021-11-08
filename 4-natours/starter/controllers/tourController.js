const Tour = require("../models/tourModel");

const ERROR_MESSAGE = "something went wrong";

async function getAllTour(req, res)
{

    try {
        let filters = {...req.query};
        const excludedFields = ["page", "sort", "limit", "fields"];
        for (const fieldToDelete of excludedFields) delete filters[fieldToDelete];
        filters = JSON.stringify(filters);
        filters = JSON.parse(filters.replace(/\b(lt|lte|gt|gte)\b/g, match => `$${match}`));
        //End Filtering

        let query = Tour.find(filters);

        //start limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else query = query.select("-__v");
        // end limiting
        //start pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 100;
        const skip = page * limit - limit
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error("Page does not exists");
        }

        //end pagination

        // Start Sorting
        const {sort} = req.query;
        if (sort) query.sort(sort.split(",").join(" "));
        else query = query.sort("-createdAt, price");
        // End Sorting

        const tour = await query;
        res.json(
            {
                status: "success",
                results: tour.length,
                data: {
                    tours: tour
                }
            }
        )
    } catch (error) {
        res.status(404).json(
            {
                status: "fail",
                message: ERROR_MESSAGE
            }
        )
    }

}

async function getTour(req, res)
{
    try {
        const tour = await Tour.findById(req.params.id);
        res.json({
            status: "success",
            data: {
                tour
            }
        })
    } catch (error) {
        res.status(404).json(
            {
                status: "fail",
                message: ERROR_MESSAGE
            }
        )
    }

}

async function addTour(req, res)
{
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json(
            {
                status: "success",
                data: {
                    tour: newTour
                }
            }
        )
    } catch (error) {
        res.status(400).json(
            {
                status: "fail",
                message: ERROR_MESSAGE
            }
        )
    }

}

async function updateTour(req, res)
{
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.json({
            status: "success",
            data:
                {
                    tour: "updated tour here"
                }

        })
    } catch (error) {
        res.status(404).json(
            {
                status: "fail",
                message: ERROR_MESSAGE
            }
        )
    }

}

async function deleteTour(req, res)
{
    try {
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: "success",
            data: null
        })
    } catch (error) {
        res.status(404).json(
            {
                status: "fail",
                message: error
            }
        )
    }

}

function aliasTopTour(req, res, next)
{
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.sorted = true;
    next();
}

module.exports = {
    getAllTour,
    getTour,
    addTour,
    updateTour,
    deleteTour,
    aliasTopTour
};
