/* eslint-disable @typescript-eslint/no-unused-vars */
import { type IncomingHttpHeaders } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { DeletedObjectJSON, UserJSON } from "@clerk/clerk-sdk-node";
import { buffer } from "micro";
import { Webhook, type WebhookRequiredHeaders } from "svix";

import { prisma } from "@spree/db";

// Disable the bodyParser  so we can access the raw
// request body for verification.
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret: string = process.env.WEBHOOK_SECRET || "";

export default async function handler(
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse,
) {
  // Verify the webhook signature
  // See https://docs.svix.com/receiving/verifying-payloads/how
  const payload = (await buffer(req)).toString();
  const headers = req.headers;
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payload, headers) as Event;
  } catch (_) {
    return res.status(400).json({});
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const user: UserJSON = evt.data;
    // Destructure other keys we don't need to sync with db
    const {
      id: externalId,
      email_addresses,
      public_metadata,
      private_metadata,
      unsafe_metadata,
      phone_numbers,
      web3_wallets,
      external_accounts,
      ...externalAttributes
    } = user;

    await prisma.user.upsert({
      where: {
        externalId,
      },
      create: {
        email: user.email_addresses[0]?.email_address as string,
        externalId,
        externalAttributes: externalAttributes,
      },
      update: {
        email: user.email_addresses[0]?.email_address,
        externalId,
        externalAttributes: externalAttributes,
      },
    });
  }

  if (evt.type === "user.deleted") {
    const deleteUser: DeletedObjectJSON = evt.data;

    if (deleteUser.deleted) {
      await prisma.user.delete({
        where: {
          externalId: deleteUser.id,
        },
      });
    }
  }

  res.json({});
}

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};

type UserCreatedEvent = {
  data: UserJSON;
  object: "event";
  type: "user.created";
};

type UserUpdatedEvent = {
  data: UserJSON;
  object: "event";
  type: "user.updated";
};

type UserDeletedEvent = {
  data: DeletedObjectJSON;
  object: "event";
  type: "user.deleted";
};

type Event = UserCreatedEvent | UserUpdatedEvent | UserDeletedEvent;
