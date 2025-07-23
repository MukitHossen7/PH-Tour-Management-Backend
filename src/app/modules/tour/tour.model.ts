import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";
import slugify from "slugify";
const tourTypeSchema = new Schema<ITourType>(
  {
    name: {
      type: String,
      required: [true, "tour type name is required"],
      unique: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      default: [],
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    departureLocation: {
      type: String,
      required: false,
    },
    arrivalLocation: {
      type: String,
      required: false,
    },
    costFrom: {
      type: Number,
      required: false,
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
    included: {
      type: [String],
      default: [],
      required: false,
    },
    excluded: {
      type: [String],
      default: [],
      required: false,
    },
    amenities: {
      type: [String],
      default: [],
      required: false,
    },
    tourPlan: {
      type: [String],
      default: [],
      required: false,
    },
    maxGuest: {
      type: Number,
      required: false,
    },
    minAge: {
      type: Number,
      required: false,
    },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: [true, "divisionId is required"],
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: [true, "tourTypeId is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

tourSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    // let slug = this.title.toLowerCase().split(" ").join("-");
    let slug = slugify(this.title, "_");

    let counter = 1;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    this.slug = slug;
  }
  next();
});

tourSchema.pre("findOneAndUpdate", async function (next) {
  const tour = this.getUpdate() as ITour;
  if (tour.title) {
    let slug = slugify(tour.title, "_");

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    tour.slug = slug;
  }
  this.setUpdate(tour);
  next();
});

export const Tour = model<ITour>("Tour", tourSchema);
