// /api/address/validate

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { ZodError, z } from "zod";

import { prisma } from "@spree/db";

import { env } from "~/env.mjs";

const SHIPPO_TOKEN = env.SHIPPO_API_KEY;

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
  const { clerkId } = validationResponse.data;

  try {
    // Check if user and listing exists
    const user = await prisma.user.findUnique({
      where: { externalId: clerkId },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The provided user does not exist.",
      });
    }

    const { name, city, country, email, phone, state, street1, zip } = user;

    const buyerAddress: ShippoAddressInput = {
      name,
      city,
      country,
      email,
      phone,
      state,
      street1,
      zip,
    };

    try {
      // Create address in Shippo API
      const { data: shippoAddress }: { data: ShippoAddressOutput } =
        await axios.post("https://api.goshippo.com/addresses/", buyerAddress, {
          headers: {
            Authorization: `ShippoToken ${SHIPPO_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

      if (!shippoAddress) {
        return res.status(400).json({
          status: "error",
          code: 400,
          message: "Invalid address",
          details: "The provided address is not valid.",
        });
      }

      // Validate user address fields with Shippo API
      const { data: shippoAddressValidation }: { data: ShippoAddressOutput } =
        await axios.get(
          `https://api.goshippo.com/addresses/${shippoAddress.object_id}/validate/`,
          {
            headers: {
              Authorization: `ShippoToken ${SHIPPO_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
        );

      const isAddressValid =
        shippoAddressValidation.validation_results.is_valid;

      if (!isAddressValid) {
        return res.status(400).json({
          status: "error",
          code: 400,
          message: "Invalid address",
          details: "The provided address is not valid.",
        });
      }

      return res.status(200).json({ valid: true });
    } catch (err) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Invalid address",
        details: "The provided address is not valid.",
      });
    }
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

interface ShippoAddressInput {
  city: string;
  company?: string | null;
  country: string;
  email: string;
  is_complete?: boolean | null;
  is_residential?: boolean | null;
  latitude?: number | null;
  longitude?: number | null;
  metadata?: string | null;
  name: string;
  object_created?: string | null;
  object_id?: string | null;
  object_owner?: string | null;
  object_updated?: string | null;
  phone?: string | null;
  state: string;
  street1: string;
  street2?: string | null;
  street3?: string | null;
  street_no?: string | null;
  test?: boolean | null;
  validation_results?: { is_valid: boolean; messages: [] };
  zip: string;
}

interface ShippoAddressValidationResult {
  is_valid: boolean;
  messages: string[];
}

interface ShippoAddressOutput {
  is_complete: boolean;
  object_created: Date;
  object_updated: Date;
  object_id: string;
  object_owner: string;
  name: string;
  company: string;
  street1: string;
  street_no: string;
  street2: string;
  street3: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  is_residential: boolean | null;
  validate: boolean | null;
  metadata: string;
  test: boolean;
  validation_results: ShippoAddressValidationResult;
}
