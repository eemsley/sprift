import { type PrismaOrder } from "~/contexts/API";

export interface Costs {
  subtotal: number;
  shipping: number;
  total: number;
}

// Calculates an order subtotal, shipping, and total costs from order object
export const getOrderCost = (order: PrismaOrder): Costs => {
  const costs = {
    subtotal: 0,
    shipping: 0,
    total: 0,
  };
  for (const suborder of order.suborders) {
    costs.shipping += Number(suborder.shippingCost);
    for (const listing of suborder.lines) {
      costs.subtotal += Number(listing.price);
    }
  }
  costs.total = costs.subtotal + costs.shipping;
  return costs;
};
