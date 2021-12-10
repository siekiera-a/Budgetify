export const formatBankAccount = (number: string) => {
  if (number.length !== 26) {
    return number;
  }

  const numberChunks = [number.substring(0, 2)];
  const trimmedNumber = number.substring(2);

  for (let i = 0; i < trimmedNumber.length; i += 4) {
    numberChunks.push(trimmedNumber.substring(i, i + 4));
  }

  return numberChunks.join(" ");
};
