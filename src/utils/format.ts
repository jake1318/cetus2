import BigNumber from "bignumber.js";

export function formatAmount(
  amount: number | string | BigNumber,
  decimals = 2,
  abbreviate = true
): string {
  const bn = new BigNumber(amount);

  if (bn.isNaN()) return "0";

  if (!abbreviate || bn.lt(1000)) {
    return bn.toFixed(decimals);
  }

  if (bn.lt(1000000)) {
    return `${bn.div(1000).toFixed(decimals)}K`;
  }

  if (bn.lt(1000000000)) {
    return `${bn.div(1000000).toFixed(decimals)}M`;
  }

  return `${bn.div(1000000000).toFixed(decimals)}B`;
}

export function formatAddress(address: string, length = 6): string {
  if (!address) return "";

  return `${address.substring(0, length)}...${address.substring(
    address.length - 4
  )}`;
}

export function calculatePriceImpact(
  amountIn: BigNumber,
  amountOut: BigNumber,
  spotPrice: BigNumber
): BigNumber {
  if (amountIn.isZero() || amountOut.isZero() || spotPrice.isZero()) {
    return new BigNumber(0);
  }

  const expectedAmountOut = amountIn.multipliedBy(spotPrice);
  const priceImpact = new BigNumber(1)
    .minus(amountOut.div(expectedAmountOut))
    .multipliedBy(100);

  return priceImpact.isLessThan(0) ? new BigNumber(0) : priceImpact;
}
