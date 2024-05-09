import { env } from "process";
import axios from "axios";

import { prisma, type Order, type OrderLine, type SubOrder } from "@spree/db";

const SHIPPO_TOKEN = env.SHIPPO_API_KEY;

/**
 * Creates an order in the database with SubOrders and OrderLines.
 * @param userId input user ID
 * @param cart array of listing ids in cart
 */
export const createOrder = async (userId: string, cart: string[]) => {
  // Get all listings in the users cart
  const listingsInOrder = await prisma.listing.findMany({
    where: {
      id: {
        in: cart,
      },
    },
  });

  // Get unique seller ids to create individual suborders using a Set to prevent duplicates
  const sellerIds = new Set<string>(
    listingsInOrder.map((listing) => listing.sellerId),
  );

  // Create all promises for shipping labels
  const shippingCostPromises = Array.from(sellerIds).map((id) =>
    getCheapestShippingRate(
      userId,
      id,
      listingsInOrder.map(({ id }) => id),
    ),
  );

  // Run shipping cost calculations in parallel
  const shippingCostValues = await Promise.all(shippingCostPromises);
  if (!shippingCostValues) {
    throw new Error("No shipping cost value found for order.");
  }
  shippingCostValues.forEach((shippingCostValue, index) => {
    if (!shippingCostValue)
      throw new Error(
        `No shipping cost value found for sellerId: ${sellerIds[index]}`,
      );
  });

  const subOrderPromises = Array.from(sellerIds).map((id, index) => {
    return prisma.subOrder.create({
      data: {
        seller: {
          connect: {
            id,
          },
        },
        shippingCost: shippingCostValues[index]?.amount as number,
        shippoObjectId: shippingCostValues[index]?.object_id as string,
        lines: {
          create: listingsInOrder
            .filter(({ sellerId }) => sellerId === id)
            .map(({ price, weight, sellerId, id: listingId }) => ({
              price,
              weight,
              sellerId,
              listingId,
            })),
        },
      },
    });
  });

  const suborders = await Promise.all(subOrderPromises);

  const shippingTransactionsPromises = suborders.map(
    ({ shippoObjectId, id }) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      return createShippingTransaction(shippoObjectId as string, id);
    },
  );

  const shippingTransactions = await Promise.all(shippingTransactionsPromises);

  for (const transaction of shippingTransactions) {
    if (!transaction) {
      throw new Error(`No transaction found.`);
    }
  }

  // Create main order with all suborders
  const order = await prisma.order.create({
    data: {
      // Initialize with 0 because we are going to update this later
      total: 0,
      purchaser: {
        connect: {
          id: userId,
        },
      },
      // Initialize empty because we are going to update this later
      paymentIntent: "",
      suborders: { connect: suborders.map(({ id }) => ({ id })) },
    },
    include: {
      suborders: {
        include: {
          lines: true,
        },
      },
    },
  });

  // Calculate order prices and return to user
  const orderTotalData = await getOrderTotal(order);
  const totalPrice = Number(orderTotalData.total);

  return {
    order,
    totalPrice,
  };
};

/**
 * Gets the cheapest shipping rate
 * @param buyerId user id of buyer
 * @param sellerId user id of seller
 * @param listingIds array of listing ids
 */
export const getCheapestShippingRate = async (
  buyerId: string,
  sellerId: string,
  listingIds: string[],
): Promise<Rate | undefined> => {
  try {
    // Check if buyer and seller exist
    const [buyer, seller] = await Promise.all([
      prisma.user.findUnique({
        where: { id: buyerId },
      }),
      prisma.user.findUnique({
        where: { id: sellerId },
      }),
    ]);

    // No buyer
    if (!buyer) {
      throw new Error("Buyer not found.");
    }

    // No seller
    if (!seller) {
      throw new Error("Seller not found.");
    }

    const buyerAddress: AddressInput = {
      name: buyer.name,
      email: buyer.email,
      phone: buyer.phone,
      street1: buyer.street1,
      city: buyer.city,
      state: buyer.state,
      zip: buyer.zip,
      country: buyer.country,
    };

    const sellerAddress: AddressInput = {
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      street1: seller.street1,
      city: seller.city,
      state: seller.state,
      zip: seller.zip,
      country: seller.country,
    };

    const listings = await prisma.listing.findMany({
      where: {
        id: {
          in: listingIds,
        },
      },
    });

    const listingParcelDetails: Parcel[] = listings.map(
      ({ weight, weightUnit }) => ({
        weight: weight.toString(),
        mass_unit: weightUnit.toLowerCase(),
        // CHANGE THIS LATER
        length: "10",
        width: "15",
        height: "3",
        distance_unit: "in",
      }),
    );

    // Get rates for label from seller to buyer
    const response = await axios.post(
      "https://api.goshippo.com/shipments/",
      {
        address_from: sellerAddress,
        address_to: buyerAddress,
        parcels: listingParcelDetails,
        async: false,
      },
      {
        headers: {
          Authorization: `ShippoToken ${SHIPPO_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unsafe-member-access
    const rates: Rate[] = response.data.rates!;
    if (!rates) {
      console.log("No shipping rates found.");
      throw new Error("No shipping rates found.");
    }
    // Sort rates by price
    rates.sort((a, b) => {
      return a.amount - b.amount;
    });
    // Get the cheapest rate
    if (rates[0]) {
      return rates[0];
    }
  } catch (err) {
    console.log("An error occurred when calculating shipping costs.");
    throw new Error("An error occurred when calculating shipping costs.");
  }
};

/**
 * Creates a shipping transaction in the Shippo API
 * @param shippingRateId object_id of shippo rate
 */
export const createShippingTransaction = async (
  shippingRateId: string,
  suborderId: string,
) => {
  const transaction = await axios.post<Transaction>(
    "https://api.goshippo.com/transactions/",
    {
      rate: shippingRateId,
      label_file_type: "PDF",
      async: false,
    },
    {
      headers: {
        Authorization: `ShippoToken ${SHIPPO_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );

  await prisma.subOrder.update({
    where: { id: suborderId },
    data: { shippoLabelUrl: transaction.data.label_url },
  });

  return transaction;
};

type GetOrderTotalInput = Order & {
  suborders: (SubOrder & { lines: OrderLine[] })[];
};

/**
 * Gets the subtotal, shipping, and total cost for an order by its id
 * @param order Order object
 */
export const getOrderTotal = async (
  order: GetOrderTotalInput,
): Promise<OrderTotal> => {
  if (!order) {
    throw new Error("No order found.");
  }

  const orderTotal = { subtotal: 0, shipping: 0, total: 0 };

  const suborders = order.suborders;
  // Run order total calculations in parallel
  await Promise.all(
    suborders.map((suborder) => {
      orderTotal.shipping += Number(suborder.shippingCost);
      orderTotal.subtotal += suborder.lines.reduce(
        (acc, line) => acc + Number(line.price),
        0,
      );
    }),
  );

  orderTotal.total = orderTotal.subtotal + orderTotal.shipping;

  return orderTotal;
};

interface Parcel {
  weight: string;
  mass_unit: string;
}

interface AddressInput {
  name: string;
  phone: string;
  email: string;
  street1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Rate {
  object_created: string;
  object_id: string;
  object_owner: string;
  shipment: string;
  attributes: [string];
  amount: number;
  currency: string;
  amount_local: number;
  currency_local: string;
  provider: string;
  provider_image_75: string;
  provider_image_200: string;
  servicelevel: object;
  estimated_days: number;
  arrives_by: string | null;
  duration_terms: string | null;
  messages: [];
  carrier_account: string;
  test: boolean;
  zone: string;
}

interface OrderTotal {
  subtotal: number;
  shipping: number;
  total: number;
}

interface Transaction {
  object_state: string;
  status: string;
  object_created: string;
  object_updated: string;
  object_id: string;
  object_owner: string;
  test: boolean;
  rate: string;
  tracking_number: string;
  tracking_status: string;
  eta: null;
  tracking_url_provider: string;
  label_url: string;
  commercial_invoice_url: null;
  messages: string[];
  order: null;
  metadata: string;
  parcel: string;
  billing: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payments: any[];
  };
  qr_code_url: null;
}
