import * as React from "react";

import {
  type Listing,
  type Order,
  type OrderLine,
  type SubOrder,
} from "@spree/db";

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

interface EmailTemplateProps {
  order: OrderType;
}

export const BuyerOrderConfirmation: React.FC<Readonly<EmailTemplateProps>> = ({
  order,
}) => (
  <div>
    <h1>{`Thank you for placing an order! Order ID: ${order.id}`}</h1>

    <h2>Order Summary</h2>
    {order.suborders.map((suborder) => (
      <div key={suborder.id}>
        <h3>{`Suborder ID: ${suborder.id}`}</h3>
        {suborder.lines.map((line) => (
          <div key={line.id}>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={line.listing.imagePaths[0]?.path}
                alt={line.listing.description}
              />
            </div>
            <div>{`Listing: ${line.listing.description}`}</div>
            <div>{`Price: ${line.price}`}</div>
          </div>
        ))}
      </div>
    ))}
  </div>
);
