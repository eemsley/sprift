/**
 * @jest-environment node
 */

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */

import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks, type RequestMethod } from "node-mocks-http";

import { prisma } from "@spree/db";

import handler from "~/pages/api/newsletter/subscribe";

jest.mock("@spree/db", () => {
  const mockPrisma = {
    newsletter: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };
  return { prisma: mockPrisma };
});

describe("/api/newsletter API Endpoint", () => {
  function mockRequestResponse(method: RequestMethod = "POST", body: any = {}) {
    const { req, res } = createMocks({ method, body });
    req.headers = {
      "Content-Type": "application/json",
    };
    return { req, res };
  }

  // Test for successful newsletter subscription creation
  it("should create a new newsletter subscription and return HTTP 201", async () => {
    (prisma.newsletter.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.newsletter.create as jest.Mock).mockResolvedValue({
      email: "jane.doe@example.com",
    });
    const { req, res } = mockRequestResponse("POST", {
      email: "jane.doe@example.com",
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({ email: "jane.doe@example.com" });
  });

  // Test for validation error with invalid request body
  it("should return HTTP 400 for invalid request body", async () => {
    const { req, res } = mockRequestResponse("POST", {
      email: "invalid-email",
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().status).toEqual("error");
  });

  // Test for conflict error when email already exists
  it("should return HTTP 409 when the email is already subscribed", async () => {
    (prisma.newsletter.findFirst as jest.Mock).mockResolvedValue({
      email: "jane.doe@example.com",
    });
    const { req, res } = mockRequestResponse("POST", {
      email: "jane.doe@example.com",
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(409);
    expect(res._getJSONData().status).toEqual("error");
  });

  // Test for internal server error
  it("should return HTTP 500 for internal server error", async () => {
    (prisma.newsletter.findFirst as jest.Mock).mockResolvedValue(null); // Simulate that email does not exist
    (prisma.newsletter.create as jest.Mock).mockRejectedValue(
      new Error("Internal server error"),
    );
    const { req, res } = mockRequestResponse("POST", {
      email: "jane.doe@example.com",
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().status).toEqual("error");
  });

  // Test for method not allowed
  it("should return HTTP 405 if HTTP method is not POST", async () => {
    const { req, res } = mockRequestResponse("GET");

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(405);
    expect(res._getJSONData().status).toEqual("error");
  });
});
