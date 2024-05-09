// /api/listings/[id]/update

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import { prisma } from "@spree/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Validate HTTP method
  if (req.method !== "PUT") {
    return res.status(405).json({
      status: "error",
      code: 405,
      message: "Method not allowed",
      details: "The request method is not supported for this endpoint.",
    });
  }

  // Validate request query for ID
  const { id } = req.query;

  const idSchema = z.string().nonempty("The listing id cannot be empty.");
  const idValidationResponse = idSchema.safeParse(id);

  if (!idValidationResponse.success) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid listing id",
      details:
        idValidationResponse.error instanceof ZodError
          ? idValidationResponse.error.errors
          : "Unknown error",
    });
  }

  // Validate request body

  // weight, weightunit, gender
  const schema = z.object({
    sellerId: z.string(),
    listingType: z.optional(z.string()),
    size: z.optional(z.string()),
    price: z.number(),
    description: z.string(),
    imagePaths: z.array(z.string()),
    tags: z.array(z.string()),
  });

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
  const { sellerId, listingType, size, price, description, imagePaths, tags } =
    validationResponse.data;

  // Throw error if user is not authenticated
  // if (!userId) {
  //   return res.status(401).json({
  //     status: "error",
  //     code: 401,
  //     message: "Unauthorized",
  //     details: "The user is not authenticated.",
  //   });
  // }

  try {
    // Update the listing
    const currentListing = await prisma.listing.findUnique({
      where: { id: id as string },
      include: { imagePaths: true, tags: true },
    });

    if (!currentListing) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The listing does not exist.",
      });
    }

    const newImagePaths = imagePaths.filter(
      (path) => !currentListing.imagePaths.some((img) => img.path === path),
    );
    const newTags = tags.filter(
      (tag) => !currentListing.tags.some((t) => t.tag === tag),
    );

    // Retrieve the IDs of the old tags and image paths that are not present in the updated listing
    const oldTagIds = currentListing.tags
      .filter((oldTag) => !tags.includes(oldTag.tag))
      .map((oldTag) => oldTag.id);

    const oldImagePathIds = currentListing.imagePaths
      .filter((oldImagePath) => !imagePaths.includes(oldImagePath.path))
      .map((oldImagePath) => oldImagePath.id);

    // Delete the old tags and image paths
    await prisma.styleTag.deleteMany({
      where: {
        id: {
          in: oldTagIds,
        },
      },
    });

    await prisma.listingImagePath.deleteMany({
      where: {
        id: {
          in: oldImagePathIds,
        },
      },
    });

    const updatedListing = await prisma.listing.update({
      where: { id: id as string },
      data: {
        seller: {
          connect: { id: sellerId },
        },
        listingType,
        size,
        price,
        description,
        imagePaths: newImagePaths.length
          ? {
              createMany: {
                data: newImagePaths.map((path) => ({ path })),
              },
            }
          : undefined,
        tags: newTags.length
          ? {
              createMany: {
                data: newTags.map((tag) => ({ tag })),
              },
            }
          : undefined,
      },
      include: { tags: true, imagePaths: true },
    });

    // Return the updated entry
    return res.status(200).json(updatedListing);
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
