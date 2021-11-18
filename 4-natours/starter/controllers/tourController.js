const Tour = require("../models/tourModel");

const APIFeatures = require("../utils/APIFeatures");

const ERROR_MESSAGE = "something went wrong";

async function getAllTour(req, res)
{

  try
  {
    const query = new APIFeatures(Tour.find(), req.query).filter().limitFields().paginate().sort().getQuery();
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
  }
  catch (error)
  {
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
  try
  {
    const tour = await Tour.findById(req.params.id);
    res.json({
      status: "success",
      data: {
        tour
      }
    })
  }
  catch (error)
  {
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
  try
  {
    const newTour = await Tour.create(req.body);

    res.status(201).json(
        {
          status: "success",
          data: {
            tour: newTour
          }
        }
    )
  }
  catch (error)
  {
    res.status(400).json(
        {
          status: "fail",
          message: error
        }
    )
  }

}

async function updateTour(req, res)
{
  try
  {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    res.json({
      status: "success",
      data:
          {
            tour: "updated tour here"
          }

    })
  }
  catch (error)
  {
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
  try
  {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: "success",
      data: null
    })
  }
  catch (error)
  {
    res.status(404).json(
        {
          status: "fail",
          message: ERROR_MESSAGE
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

async function getTourStats(req, res)
{
  try
  {
    const stats = await Tour.aggregate(
        [
          {
            $match: {ratingsAverage: {$gte: 4.5}}
          },
          {
            $group: {
              _id: "$price",
              num: {$sum: 1},
              ratingsQuantity: {$sum: "$ratingsQuantity"},
              avgRating: {$avg: "$ratingsAverage"},
              avgPrice: {$avg: "$price"},
              lowestPrice: {$min: "$price"}
            }
          },
          {
            $sort: {avgRating: 1}
          }
        ]
    );
    res.json(stats);
  }
  catch (error)
  {
    res.status(404).json(
        {
          status: "fail",
          message: ERROR_MESSAGE
        }
    )
  }
}

async function getMonthlyPlan(req, res)
{
  try
  {
    const year = Number(req.params.year);
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates"
      },
      {
        $match:
            {
              startDates: {
                $lt: new Date(year + 1, 0, 1),
                $gt: new Date(year - 1, 11, 31)
              }
            }
      },
      {
        $group:
            {
              _id: {$month: "$startDates"},
              numTourStarts: {$sum: 1},
              tours: {$push: "$name"}
            }
      },
      {
        $addFields: {month: "$_id"}
      }
      ,
      {
        $project: {_id: 0}
      },
      {
        $sort: {numTourStarts: -1}
      }

    ]);

    res.json(plan);

  }

  catch (error)
  {
    res.status(404).json(
        {
          status: "fail",
          message: ERROR_MESSAGE
        }
    )
  }

}

module.exports = {

  getAllTour,
  getTour,
  addTour,
  updateTour,
  deleteTour,
  aliasTopTour,
  getTourStats,
  getMonthlyPlan

};
