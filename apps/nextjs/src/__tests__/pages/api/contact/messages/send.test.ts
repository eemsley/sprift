/**
 * @jest-environment node
 */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks, type Body, type RequestMethod } from "node-mocks-http";

import { prisma } from "@spree/db";

import handler from "~/pages/api/contact/messages/send";

jest.mock("@spree/db", () => {
  const mockPrisma = {
    contactMessage: {
      create: jest.fn(),
    },
  };
  return { prisma: mockPrisma };
});

describe("/api/contact/messages/send API Endpoint", () => {
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

  // Test for successful message creation
  it("should create a new message and return HTTP 201", async () => {
    const mockMessage = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      message: "Hello, World!",
    };
    (prisma.contactMessage.create as jest.Mock).mockResolvedValue(mockMessage);
    const { req, res } = mockRequestResponse("POST", {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      message: "Hello, World!",
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(mockMessage);
  });

  // Test for validation error with invalid request body
  it("should return HTTP 400 for invalid request body", async () => {
    const { req, res } = mockRequestResponse("POST", {
      firstName: "John",
      email: "invalid-email",
      message: "Hello, World!",
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().status).toEqual("error");
  });

  // Test for internal server error
  it("should return HTTP 500 for internal server error", async () => {
    (prisma.contactMessage.create as jest.Mock).mockRejectedValue(
      new Error("Internal server error"),
    );
    const { req, res } = mockRequestResponse("POST", {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      message: "Hello, World!",
    });

    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res.statusCode).toBe(500);
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
