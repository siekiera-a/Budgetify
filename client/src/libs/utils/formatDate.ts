const formatNumber = (number: number) => {
  return number.toString().padStart(2, "0");
};

export function formatDate(text: string) {
  const date = new Date(text);
  if (date) {
    return `${formatNumber(date.getUTCDate())}/${formatNumber(
      date.getMonth() + 1
    )}/${date.getUTCFullYear()}`;
  }
  return "";
}
