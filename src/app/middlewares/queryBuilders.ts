/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";

export const queryBuilders =
  (model: Model<any>, searchAbleFields: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = { ...req.query };
      // console.log(query);
      const filter = { ...query };
      const search = query.search || "";
      const sort = query.sort || "-createdAt";
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 8;
      const skip = (page - 1) * limit;

      const excludeField = ["search", "sort", "fields", "page", "limit"];
      for (const field of excludeField) {
        delete filter[field];
      }

      // this is optional use koral filter korar somoy fixsiable hoba na use kora valo

      //   for (const key in filter) {
      //     const value = filter[key];
      //     if (typeof value === "string") {
      //       filter[key] = { $regex: value, $options: "i" };
      //     }
      //   }
      // console.log(searchAbleFields, search);

      const searchQuery = {
        $or: searchAbleFields.map((field) => ({
          [field]: { $regex: search, $options: "i" },
        })),
      };

      const data = await model
        .find(filter)
        .find(searchQuery)
        .sort(sort as string)
        .skip(skip)
        .limit(limit);

      const totalDocuments = await model.countDocuments();
      const totalPage = Math.ceil(totalDocuments / limit);
      const meta = {
        page: page,
        limit: limit,
        totalPage: totalPage,
        total: totalDocuments,
      };

      res.locals.data = {
        data,
        meta,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
