const mongoose = require("mongoose");

const VALIDATION_STRING = "must be specified"



const tourSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, `name ${VALIDATION_STRING}`],
        unique: true,
        trim: true,
        minlength: [5, "Tour name must be at least 5 characters"]
      },
      ratingsAverage:
          {
            type: Number,
            default: 4.5
          },
      ratingsQuantity:
          {
            type: Number,
            default: 0
          },
      duration:
          {
            type: Number,
            required: [true, `duration ${VALIDATION_STRING}`]
          },
      maxGroupSize:
          {
            type: Number,
            required: [true, ` Group size ${VALIDATION_STRING}`]
          },
      difficulty:
          {
            type: String,
            required: [true, `difficulty ${VALIDATION_STRING}`]
          },
      price:
          {
            type: Number,
            required: [true, `price ${VALIDATION_STRING}`]
          },
      priceDiscount:
          {
            type: Number,
            validate: {
              validator: function (val) { return val < this.price},
              message: "Price Discount can't be higher than price"
            }

          },

      summary:
          {
            type: String,
            trim: true,
            required: [true, `summary ${VALIDATION_STRING}`],

          },
      description:
          {
            type: String,
            trim: true
          },
      imageCover:
          {
            type: String,
            required: [true, `imageCover ${VALIDATION_STRING}`]
          },
      images: [String],
      createdAt:
          {
            type: Date,
            default: Date.now()
          },
      startDates: [Date]
    }
    , {toJSON: {virtuals: true}, toObject: {virtuals: true}});
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
