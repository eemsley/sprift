/**
 * @jest-environment node
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks, type RequestMethod } from "node-mocks-http";

import { prisma } from "@spree/db";

import handler from "~/pages/api/recommend/main";

jest.mock("@spree/db", () => {
  const mockPrisma = {
    listing: {
      findMany: jest.fn(),
    },
  };
  return { prisma: mockPrisma };
});

describe("/api/recommend/ API Endpoint", () => {
  function mockRequestResponse(method: RequestMethod = "GET") {
    const { req, res } = createMocks({ method });
    req.headers = {
      "Content-Type": "application/json",
    };
    return { req, res };
  }

  // Test to check if the endpoint returns a 500 error in case of an internal server error
  it("should return a 500 if there is an internal server error", async () => {
    (prisma.listing.findMany as jest.Mock).mockRejectedValue(
      new Error("Internal server error"),
    );
    const { req, res } = mockRequestResponse();

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      status: "error",
      code: 500,
      message: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  });

  // Test to check if the endpoint returns a 405 error when an unsupported HTTP method is used
  it("should return a 405 if HTTP method is not GET", async () => {
    const { req, res } = mockRequestResponse("POST");

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(405);
    expect(res._getJSONData()).toEqual({
      status: "error",
      code: 405,
      message: "Method not allowed",
      details: "The request method is not supported for this endpoint.",
    });
  });

  // Test to check if the endpoint returns an empty array when there are no listings
  it("should return an empty array if there are no listings", async () => {
    (prisma.listing.findMany as jest.Mock).mockResolvedValue([]);
    const { req, res } = mockRequestResponse();

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
    expect(res._getJSONData()).toEqual([]);
  });

  // Test to check if the endpoint returns listings with expected properties and structure
  it("should return listings with expected properties and structure", async () => {
    const mockData = [
      {
        id: "listing-1",
        description: "Vintage Table",
        price: 100,
        size: "medium",
        imagePaths: [{ path: "path-to-image" }],
        likes: [],
        dislikes: [],
        cart: [],
        createdAt: "2023-06-15",
      },
    ];

    (prisma.listing.findMany as jest.Mock).mockResolvedValue(mockData);

    const { req, res } = mockRequestResponse();

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    const expectedResponse = [
      {
        id: "listing-1",
        description: "Vintage Table",
        price: 100,
        size: "medium",
        sellerName: "user123",
        sellerProfilePicUrl:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        address: "123 Test Street",
        imagePaths: ["path-to-image"],
        likes: 0,
        dislikes: 0,
        carts: 0,
      },
    ];

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(expectedResponse);
  });
});
