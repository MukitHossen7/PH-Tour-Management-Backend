import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

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
      required: [true, "slug is required"],
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

export const Tour = model<ITour>("Tour", tourSchema);
