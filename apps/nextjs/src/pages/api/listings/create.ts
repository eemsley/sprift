// /api/listings/create

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import { Gender, WeightUnit, prisma } from "@spree/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Validate HTTP method
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      code: 405,
      message: "Method not allowed",
      details: "The request method is not supported for this endpoint.",
    });
  }

  const schema = z.object({
    clerkId: z.string(),
    listingType: z.optional(z.string()),
    size: z.string(),
    price: z.number(),
    description: z.string(),
    gender: z.string(),
    weight: z.number(),
    weightUnit: z.string(),
    imagePaths: z.array(z.string()),
    tags: z.array(z.string()),
  });

  // Validate request body
  const validationResponse = schema.safeParse(req.body);
  if (!validationResponse.success) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid request body",
      details:
        validationResponse.error instanceof ZodError
          ? validationResponse.error.errors
          : "Unknown error",
    });
  }

  // Extract data from response body
  const {
    clerkId,
    listingType,
    size,
    price,
    description,
    gender,
    weight,
    weightUnit,
    imagePaths,
    tags,
  } = validationResponse.data;

  try {
    // Check if seller already exists
    const sellerExists = !!(await prisma.user.findUnique({
      where: { externalId: clerkId },
    }));

    if (!sellerExists) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The provided seller does not exist.",
      });
    }

    const parseGender = (gender: string) => {
      if (gender == "M") {
        return Gender.M;
      } else if (gender == "F") {
        return Gender.F;
      }
      return Gender.U;
    };

    const parseWeightUnit = (weightUnit: string) => {
      if (weightUnit == "OZ") {
        return WeightUnit.OZ;
      } else if (weightUnit == "LB") {
        return WeightUnit.LB;
      }
      return WeightUnit.OZ;
    };

    const newListing = await prisma.listing.create({
      data: {
        seller: {
          connect: { externalId: clerkId },
        },
        listingType,
        size,
        price,
        description,
        gender: parseGender(gender),
        weight,
        weightUnit: parseWeightUnit(weightUnit),
        imagePaths: {
          createMany: {
            data: imagePaths.map((path) => ({ path })),
          },
        },
        tags: {
          createMany: {
            data: tags.map((tag) => ({ tag })),
          },
        },
      },
    });

    const newListingOldImages = await prisma.listing.findUnique({
      where: { id: newListing.id },
      include: {
        seller: true,
        imagePaths: true,
      },
    });

    const newImagePaths = [] as string[];
    if (newListingOldImages?.imagePaths) {
      for (let i = 0; i < newListingOldImages?.imagePaths.length; i++) {
        newImagePaths.push(
          `https://spree-images-db.s3.amazonaws.com/listings/${
            newListingOldImages.seller.externalId
          }_${newListingOldImages.id}_${i + 1}`,
        );
      }
      await prisma.listingImagePath.deleteMany({
        where: { listingId: newListing.id },
      });
    }
    await prisma.listingImagePath.createMany({
      data: newImagePaths.map((path) => ({
        path,
        listingId: newListing.id,
      })),
    });

    const finalListing = await prisma.listing.findUnique({
      where: { id: newListing.id },
      include: {
        seller: true,
        imagePaths: true,
      },
    });
    // Return created entry
    return res.status(201).json(finalListing);
  } catch (err) {
    // Handle unexpected errors
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
}
