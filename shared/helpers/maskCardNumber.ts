
export const maskCardNumber = (cardNumber: string): string => {
  const cardNumberStr = String(cardNumber);
  const lastFourDigits = cardNumberStr.slice(-4);
  const maskedCardNumber = "•••• •••• ••••";

  return `${maskedCardNumber} ${lastFourDigits}`;
}