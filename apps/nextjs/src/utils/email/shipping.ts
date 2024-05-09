import {
  prisma,
  type Listing,
  type Order,
  type OrderLine,
  type SubOrder,
  type User,
} from "@spree/db";

import { NO_REPLY_EMAIL_ADDRESS } from "~/utils/contants";
import { BuyerOrderConfirmation } from "~/components/emails/BuyerOrderConfirmation";
import { SellerOrderConfirmation } from "~/components/emails/SellerOrderConfirmation";
import { resend } from "~/services/resend";

export const sendConfirmationEmailsOnOrderSuccess = async (
  buyerId: string,
  orderId: string,
) => {
  // Check if buyer and order exist concurrently
  const buyer = await prisma.user.findUnique({
    where: { id: buyerId },
  });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      suborders: {
        include: {
          lines: {
            include: {
              listing: {
                include: {
                  imagePaths: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (buyer && order) {
    // Send email to buyer
    await sendConfirmationEmailToBuyer({ buyer, order });

    for (const suborder of order.suborders) {
      const seller = await prisma.user.findUnique({
        where: {
          id: suborder.sellerId,
        },
      });

      if (!seller) {
        console.log("Error. Seller not found.");
        continue;
      }

      // Send email to seller
      await sendConfirmationEmailToSeller({
        seller,
        order,
        suborder,
      });
    }
  } else {
    console.log("Error. Buyer or order not found.");
  }
};

type OrderType = Order & {
  suborders: (SubOrder & {
    lines: (OrderLine & {
      listing: Listing & {
        imagePaths: {
          path: string;
        }[];
      };
    })[];
  })[];
};

interface BuyerConfirmationEmailInput {
  buyer: User;
  order: OrderType;
}

export const sendConfirmationEmailToBuyer = async ({
  buyer,
  order,
}: BuyerConfirmationEmailInput) => {
  try {
    await resend.emails.send({
      from: NO_REPLY_EMAIL_ADDRESS,
      to: buyer.email,
      subject: `(Buyer) You made an order with an ID ${order.id}`,
      react: BuyerOrderConfirmation({ order }),
    });
    console.log("Sent email to buyer successfully.");
  } catch (err) {
    console.log(
      `An error occurred when sending a order confimration email to the buyer ${buyer.id}.`,
    );
  }
};

type SuborderType = SubOrder & {
  lines: (OrderLine & {
    listing: Listing & {
      imagePaths: {
        path: string;
      }[];
    };
  })[];
};

interface SellerConfirmationEmailInput {
  seller: User;
  order: OrderType;
  suborder: SuborderType;
}

export const sendConfirmationEmailToSeller = async ({
  seller,
  order,
  suborder,
}: SellerConfirmationEmailInput) => {
  try {
    await resend.emails.send({
      from: NO_REPLY_EMAIL_ADDRESS,
      to: seller.email,
      subject: `(Seller) You made an order with an ID ${order.id}`,
      react: SellerOrderConfirmation({ seller, order, suborder }),
      attachments: [
        {
          filename: `shipping-label-${order.id}.pdf`,
          path: suborder.shippoLabelUrl,
        },
      ],
    });
    console.log("Sent email to seller successfully.");
  } catch (err) {
    console.log(
      `An error occurred when sending a order confimration email to the seller ${seller.id}.`,
    );
  }
};
