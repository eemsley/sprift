/**
 * @jest-environment node
 */

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */

import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks, type RequestMethod } from "node-mocks-http";

import { prisma } from "@spree/db";

import handler from "~/pages/api/listings/[id]";

jest.mock("@spree/db", () => {
  const mockPrisma = {
    listing: {
      findUnique: jest.fn(),
    },
  };
  return { prisma: mockPrisma };
});

describe("/api/listings/[id] API Endpoint", () => {
  function mockRequestResponse(method: RequestMethod = "GET", query: any = {}) {
    const { req, res } = createMocks({ method, query });
    req.headers = {
      "Content-Type": "application/json",
    };
    return { req, res };
  }

  // Test for invalid listing id
  it("should return HTTP 400 for invalid listing id", async () => {
    const { req, res } = mockRequestResponse("GET", { id: "" });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().status).toEqual("error");
  });

  // Test for listing not found
  it("should return HTTP 404 if listing does not exist", async () => {
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(null);
    const { req, res } = mockRequestResponse("GET", { id: "non-existent-id" });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData().status).toEqual("error");
  });
});
