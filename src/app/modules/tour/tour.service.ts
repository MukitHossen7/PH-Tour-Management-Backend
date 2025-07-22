import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

//Tour CRUD Operations
const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error("A tour with this title already exists.");
  }

  const tour = await Tour.create(payload);
  return tour;
};

const getAllTours = async (query: Record<string, string>) => {
  const filter = query;
  const search = query.search || "";
  delete filter["search"];
  const tourSearchableFields = ["title", "description", "location"];
  const searchQuery = {
    $or: tourSearchableFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    })),
  };
  const data = await Tour.find(searchQuery).find(filter);
  const totalTour = await Tour.countDocuments();
  // const queryBuilder = new QueryBuilder(Tour.find(), query);

  // const tours = await queryBuilder
  //   .search(tourSearchableFields)
  //   .filter()
  //   .sort()
  //   .fields()
  //   .paginate();

  // const meta = await queryBuilder.getMeta()

  // const [data, meta] = await Promise.all([
  //   tours.build(),
  //   queryBuilder.getMeta(),
  // ]);

  return {
    data,
    meta: {
      total: totalTour,
    },
  };
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new Error("Tour not found.");
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedTour;
};

const deleteTour = async (id: string) => {
  await Tour.findByIdAndDelete(id);
  return null;
};

//TourType CRUD Operations
const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }

  const tourType = await TourType.create(payload);
  return tourType;
};

const getAllTourTypes = async () => {
  const allTourTypes = await TourType.find();
  return allTourTypes;
};

const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updatedTourType;
};

const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  await TourType.findByIdAndDelete(id);
  return null;
};

export const TourService = {
  getAllTours,
  createTour,
  updateTour,
  deleteTour,
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
};
