// /api/cart/remove

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import { prisma } from "@spree/db";

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
    notificationId: z.string(),
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
  const { notificationId } = validationResponse.data;
  console.log(notificationId);

  try {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId },
    });

    console.log(notification);

    if (!notification) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The provided notification does not exist.",
      });
    }

    // Remove listing from cart
    const deleteNotification = await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });

    // Return created entry
    return res.status(201).json(deleteNotification);
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
