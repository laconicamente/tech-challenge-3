export const formatCurrency = (v: number) => {
  const n = (Number(v) || 0).toFixed(2).replace(".", ",");
  return "R$ " + n.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const parseCurrencyToNumber = (
  value: string | number | null | undefined
): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  return (
    parseFloat(
      value
        .replace(/[R$\s]/g, "")
        .replace(/\./g, "")
        .replace(",", ".")
     ) || 0
  );
};
