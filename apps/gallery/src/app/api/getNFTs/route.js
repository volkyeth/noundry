import { database } from "@/utils/database/db";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page") || 0;

  const type1 = searchParams.get("type1");

  const type2 = searchParams.get("type2");

  const search = searchParams.get("search");

  const sortOrder = searchParams.get("orderBy");

  const sorted = sortOrder === "desc" ? -1 : 1;

  let query = {};

  let data;

  if (type1 && type2) {
    const pageInt = parseInt(page);
    if (isNaN(pageInt) || pageInt < 0) {
      console.error("Invalid page parameter");
    } else {
      const pipeline = [
        {
          $match: {}, // You can add your query conditions here if needed
        },
        {
          $lookup: {
            from: "users",
            localField: "address",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $sort: { name: sorted }, // Use square brackets for dynamic sorting
        },
        {
          $skip: parseInt(page) * 16,
        },
        {
          $limit: 16,
        },
      ];
      data = await database.collection("nfts").aggregate(pipeline).toArray();
      //   data = await database
      //     .collection("nfts")
      //     .aggregate([
      //       {
      //         $sort: { name: sortDirection },
      //       },
      //       {
      //         $skip: pageInt * 16,
      //       },
      //       {
      //         $limit: 16,
      //       },
      //     ])
      //     .toArray();
    }
  } else if (type1) {
    query.type = type1;
  } else if (type2) {
    query.type = type2;
  } else if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },

      { accessory: { $regex: search, $options: "i" } },

      { body: { $regex: search, $options: "i" } },

      { type: { $regex: search, $options: "i" } },

      { twitter: { $regex: search, $options: "i" } },

      { background: { $regex: search, $options: "i" } },

      { head: { $regex: search, $options: "i" } },

      { glasses: { $regex: search, $options: "i" } },
    ];
  }

  try {
    if (Object.keys(query).length === 0) {
      const sortDirection = { name: sortOrder === "asc" ? 1 : -1 };

      // data = await database

      //   .collection("nfts")

      //   .find()

      //   .sort(sortDirection)

      //   .skip(parseInt(page) * 16)

      //   .limit(16)

      //   .toArray();

      const pipeline = [
        {
          $match: {}, // You can add your query conditions here if needed
        },
        {
          $lookup: {
            from: "users",
            localField: "address",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $sort: { name: sorted }, // Use square brackets for dynamic sorting
        },
        {
          $skip: parseInt(page) * 16,
        },
        {
          $limit: 16,
        },
      ];

      data = await database.collection("nfts").aggregate(pipeline).toArray();
    } else {
      const pipeline = [
        {
          $match: query, // Replace 'query' with your query object
        },
        {
          $lookup: {
            from: "users",
            localField: "address",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $sort: { name: sorted },
        },
        {
          $skip: parseInt(page) * 16,
        },
        {
          $limit: 16,
        },
      ];

      data = await database.collection("nfts").aggregate(pipeline).toArray();
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data from the database:", error);

    return NextResponse.error("Internal Server Error");
  }
}
