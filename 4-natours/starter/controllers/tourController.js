const Tour = require("../models/tourModel");

const APIFeatures = require("../utils/APIFeatures");

const ERROR_MESSAGE = "something went wrong";

async function getAllTour(req, res)
{

  try
  {
    console.log(req.query);
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
          message: ERROR_MESSAGE
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



module.exports = {

  getAllTour,
  getTour,
  addTour,
  updateTour,
  deleteTour,
  aliasTopTour

};
