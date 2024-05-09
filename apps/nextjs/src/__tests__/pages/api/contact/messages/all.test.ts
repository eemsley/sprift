/**
 * @jest-environment node
 */

/* eslint-disable @typescript-eslint/unbound-method */

import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks, type RequestMethod } from "node-mocks-http";

import { prisma } from "@spree/db";

import handler from "~/pages/api/contact/messages/all";

jest.mock("@spree/db", () => {
  const mockPrisma = {
    contactMessage: {
      findMany: jest.fn(),
    },
  };
  return { prisma: mockPrisma };
});

describe("/api/contact/messages/all API Endpoint", () => {
  function mockRequestResponse(method: RequestMethod = "GET") {
    const { req, res } = createMocks({ method });
    req.headers = {
      "Content-Type": "application/json",
    };
    return { req, res };
  }

  // Test to check if the endpoint returns a successful response with contact messages
  it("should return a successful response with contact messages", async () => {
    (prisma.contactMessage.findMany as jest.Mock).mockResolvedValue([
      { id: 1, message: "test", createdAt: "2023-06-14" },
    ]);
    const { req, res } = mockRequestResponse();

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
    expect(res._getJSONData()).toEqual([
      { id: 1, message: "test", createdAt: "2023-06-14" },
    ]);
  });

  // Test to check if the endpoint returns a 500 error in case of an internal server error
  it("should return a 500 if there is an internal server error", async () => {
    (prisma.contactMessage.findMany as jest.Mock).mockRejectedValue(
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

  // Test to check if the endpoint returns an empty array when there are no messages
  it("should return an empty array if there are no messages", async () => {
    (prisma.contactMessage.findMany as jest.Mock).mockResolvedValue([]);
    const { req, res } = mockRequestResponse();

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
    expect(res._getJSONData()).toEqual([]);
  });

  // Test to check if the findMany method is called with the correct parameters
  it("should call findMany with correct parameters", async () => {
    (prisma.contactMessage.findMany as jest.Mock).mockResolvedValue([]);
    const { req, res } = mockRequestResponse();

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(prisma.contactMessage.findMany).toHaveBeenCalledWith({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });
  });
});
