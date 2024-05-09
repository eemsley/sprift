/**
 * @jest-environment node
 */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks, type Body, type RequestMethod } from "node-mocks-http";

import { prisma } from "@spree/db";

import handler from "~/pages/api/listings/create";

jest.mock("@spree/db", () => {
  const mockPrisma = {
    user: {
      findFirst: jest.fn(),
    },
    listing: {
      create: jest.fn(),
    },
  };
  return { prisma: mockPrisma, ListingSize: {} };
});

describe("/api/listings/create API Endpoint", () => {
  function mockRequestResponse(
    method: RequestMethod = "POST",
    body: Body = {},
  ) {
    const { req, res } = createMocks({ method, body });
    req.headers = {
      "Content-Type": "application/json",
    };
    return { req, res };
  }

  // Test for successful listing creation
  it("should create a new listing and return HTTP 201", async () => {
    const mockListing = {
      id: 1,
      sellerId: "seller-123",
      listingType: "type1",
      size: "S",
      price: 100,
      description: "Test description",
      imagePaths: ["image1.jpg"],
      tags: ["tag1", "tag2"],
    };
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(true);
    (prisma.listing.create as jest.Mock).mockResolvedValue(mockListing);

    const { req, res } = mockRequestResponse("POST", {
      sellerId: "seller-123",
      listingType: "type1",
      size: "S",
      price: 100,
      description: "Test description",
      imagePaths: ["image1.jpg"],
      tags: ["tag1", "tag2"],
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(mockListing);
  });

  // Test for validation error with invalid request body
  it("should return HTTP 400 for invalid request body", async () => {
    const { req, res } = mockRequestResponse("POST", {
      sellerId: "seller-123",
      price: "invalid-price",
      description: "Test description",
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().status).toEqual("error");
  });

  // Test for seller not found
  it("should return HTTP 404 for seller not found", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(false);
    const { req, res } = mockRequestResponse("POST", {
      sellerId: "nonexistent-seller",
      listingType: "type1",
      size: "S",
      price: 100,
      description: "Test description",
      imagePaths: ["image1.jpg"],
      tags: ["tag1", "tag2"],
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData().status).toEqual("error");
  });

  // Test for method not allowed
  it("should return HTTP 405 for non-POST request methods", async () => {
    const { req, res } = mockRequestResponse("GET");

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(405);
    expect(res._getJSONData().status).toEqual("error");
  });
});
