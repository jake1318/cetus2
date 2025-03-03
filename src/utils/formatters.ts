/**
 * Format a number as currency (USD)
 * @param value - Number to format
 * @param minimumFractionDigits - Minimum fraction digits (default: 0)
 * @param maximumFractionDigits - Maximum fraction digits (default: 2)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 2
): string => {
  // Handle edge cases
  if (value === undefined || value === null) return "$0";
  if (isNaN(value)) return "$0";

  // Format with appropriate rounding for different value ranges
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    })}B`;
  }

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    })}M`;
  }

  if (value >= 1_000) {
    return `$${(value / 1_000).toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    })}K`;
  }

  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits,
  })}`;
};

/**
 * Format a token amount for display
 * @param amount - Token amount as string or number
 * @param decimals - Number of decimal places for the token
 * @param displayDecimals - Number of decimals to display (default: 6)
 * @returns Formatted token amount
 */
export const formatTokenAmount = (
  amount: string | number,
  decimals: number = 9,
  displayDecimals: number = 6
): string => {
  if (amount === undefined || amount === null || amount === "") return "0";

  let numAmount: number;

  // Convert string to number if needed
  if (typeof amount === "string") {
    numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "0";
  } else {
    numAmount = amount;
  }

  // Convert to human readable format (divide by 10^decimals if working with on-chain amounts)
  // This would be used when working with actual blockchain values
  // const humanReadable = numAmount / Math.pow(10, decimals);

  // For our mock data, we're already using human readable values
  const humanReadable = numAmount;

  // Format with appropriate precision
  if (humanReadable < 0.000001) {
    return "<0.000001";
  }

  return humanReadable.toLocaleString(undefined, {
    maximumFractionDigits: displayDecimals,
  });
};

/**
 * Truncate an address to a shorter form
 * @param address - Full address
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 4)
 * @returns Truncated address with ellipsis
 */
export const truncateAddress = (
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string => {
  if (!address) return "";
  if (address.length <= startChars + endChars) return address;

  return `${address.substring(0, startChars)}...${address.substring(
    address.length - endChars
  )}`;
};

/**
 * Format a timestamp as a relative time (e.g., "2 hours ago")
 * @param timestamp - Timestamp in milliseconds or Date object
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (timestamp: number | Date): string => {
  const now = new Date();
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }

  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
};
