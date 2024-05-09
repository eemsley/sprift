export const paymentIntentClientSecretToPaymentIntent = (
  paymentIntentClientSecret: string,
): string => {
  return `${paymentIntentClientSecret.split("_")[0]}_${
    paymentIntentClientSecret.split("_")[1]
  }`;
};
