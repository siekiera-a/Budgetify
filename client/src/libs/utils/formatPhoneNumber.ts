export const formatPhoneNumber = (number: string) => {
  if (number.length !== 9) {
    return number;
  }

  const phoneChunks = [
    number.substring(0, 3),
    number.substring(3, 6),
    number.substring(6),
  ];

  return phoneChunks.join(" ");
};
