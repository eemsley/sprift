// /api/user/billing-details/[id]/update

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

  const idSchema = z.string().nonempty("The user id cannot be empty.");
  const idValidationResponse = idSchema.safeParse(id);

  if (!idValidationResponse.success) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid user id",
      details:
        idValidationResponse.error instanceof ZodError
          ? idValidationResponse.error.errors
          : "Unknown error",
    });
  }

  // Validate request body (all billing detail inputs)
  const schema = z.object({
    name: z.string(),
    city: z.string(),
    country: z.string(),
    phone: z.string(),
    state: z.string(),
    street1: z.string(),
    street2: z.string().nullable(),
    zip: z.string(),
  });

  console.log(req.body);

  const validationResponse = schema.safeParse(req.body);

  if (!validationResponse.success) {
    console.log(validationResponse.error.errors);
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
  const { name, city, country, phone, state, street1, street2, zip } =
    validationResponse.data;

  try {
    // Update the profile
    const user = await prisma.user.findUnique({
      where: { externalId: id as string },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The user does not exist.",
      });
    }

    const updatedBillingDetails = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        city,
        country,
        phone,
        state,
        street1,
        street2: street2 || undefined,
        zip,
      },
    });

    // Return the updated entry
    return res.status(200).json(updatedBillingDetails);
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
