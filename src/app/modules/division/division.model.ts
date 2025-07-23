/* eslint-disable prefer-const */
import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";
import slugify from "slugify";

const divisionSchema = new Schema<IDivision>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

divisionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = slugify(this.name, "_");
    let slug = `${baseSlug}_division`;
    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    this.slug = slug;
  }
  next();
});

divisionSchema.pre("findOneAndUpdate", async function (next) {
  const division = this.getUpdate() as IDivision;
  if (division.name) {
    const baseSlug = slugify(division.name, "_");
    let slug = `${baseSlug}_division`;
    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    division.slug = slug;
  }
  this.setUpdate(division);
  next();
});
export const Division = model<IDivision>("Division", divisionSchema);
