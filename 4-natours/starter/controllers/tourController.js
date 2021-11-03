const {readFileSync} = require("fs");
const {writeFile} = require("fs").promises;

const TOURS_PATH = `${__dirname}/../dev-data/data/tours-simple.json`;

const tours = JSON.parse(readFileSync(TOURS_PATH));

function getAllTour(req, res)
{
  res.json(
      {
        message: "success",
        results: tours.length,
        data: {
          tours
        }
      }
  )
}

function getTour(req, res)
{
  res.json({
    message: "success",
    data: {
      tour
    }
  })
}

async function addTour(req, res)
{
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
}

function updateTour(req, res)
{
  res.json({
    status: "success",
    data:
        {
          tour: "updated tour here"
        }

  })
}

function deleteRouter(req, res)
{
  res.status(204).json({
    status: "success",
    data: null
  })
}

// function checkId(req, res, next, val)
// {
//   console.log(val);
//   const tour = tours[Number(val)];
//   if (!tour) return res.status(404).json({
//     status: "fail",
//     message: "Invalid ID"
//   })
//   next();
// }

function checkId(req, res, next, val)
{

  const tour = tours[Number(val)];
  if (!tour) return res.status(404).json({
    status: "fail",
    message: "Invalid ID"
  })
  next();
}

function checkBody(req, res, next)
{
  const {name, price} = req.body;
  if(name === undefined || price === undefined)
  {
    res.status(400).json({status: "fail", message:"invalid data request"})
    return;
  }
  next();
}

module.exports = {
  getAllTour,
  getTour,
  addTour,
  updateTour,
  deleteRouter,
  checkId,
  checkBody
};
