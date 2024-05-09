import * as React from "react";

import {
  type Listing,
  type Order,
  type OrderLine,
  type SubOrder,
  type User,
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

type SuborderType = SubOrder & {
  lines: (OrderLine & {
    listing: Listing & {
      imagePaths: {
        path: string;
      }[];
    };
  })[];
};
interface EmailTemplateProps {
  seller: User;
  order: OrderType;
  suborder: SuborderType;
}

export const SellerOrderConfirmation: React.FC<
  Readonly<EmailTemplateProps>
> = ({ suborder }) => (
  <div>
    <h1>{`You just sold an order! Suborder ID: ${suborder.id}`}</h1>

    <h2>Sale Summary</h2>
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
);
