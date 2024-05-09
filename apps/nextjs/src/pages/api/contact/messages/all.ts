// /api/contact/messages/all

import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@spree/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Validate HTTP method
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "error",
      code: 405,
      message: "Method not allowed",
      details: "The request method is not supported for this endpoint.",
    });
  }

  try {
    const contactMessages = await prisma.contactMessage.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    // Return created entry
    return res.status(200).json(contactMessages);
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
