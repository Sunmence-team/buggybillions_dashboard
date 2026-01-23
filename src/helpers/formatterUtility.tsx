export const formatISODateToYYYYMMDD = (isoString: string): string => {
  if (!isoString) {
    return "";
  }
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      // Handle invalid date strings gracefully
      console.warn(
        "Invalid date string provided to formatISODateToYYYYMMDD:",
        isoString
      );
      return "";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date to YYYY-MM-DD:", error);
    return "";
  }
};

export const formatterUtility = (amount: number, noSign = true) => {
  if (amount === null || amount === undefined) {
    return "";
  }
  const sign = noSign ? "" : "₦";
  return `${sign}${amount.toLocaleString("en-NG")}`;
};

export const formatCompactAmount = (amount: number) => {
  if (amount === null || amount === undefined) {
    return "";
  }

  const absAmount = Math.abs(amount);

  if (absAmount < 1_000_000) {
    return formatterUtility(amount);
  }

  const SI_SUFFIXES = [
    { value: 1e6, symbol: "M" }, // 1,000,000
    { value: 1e9, symbol: "B" }, // 1,000,000,000
    { value: 1e12, symbol: "T" }, // 1,000,000,000,000
  ];

  let tier = SI_SUFFIXES.filter((t) => absAmount >= t.value).pop();

  if (!tier) {
    return formatterUtility(amount);
  }

  const scaledValue = absAmount / tier.value;

  const formatted = parseFloat(scaledValue.toFixed(2)).toString();

  const sign = amount < 0 ? "-" : "";

  return `${sign}${formatted}${tier.symbol}`;
};

export const formatISODateToCustom = (isoString: string) => {
  if (!isoString) {
    return "";
  }

  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  let hours: string | number = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? String(hours).padStart(2, "0") : "12";

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}${ampm}`;
};

export function formatUnderScores(input: string, capitalize = false) {
  let formatted = input.replace(/_/g, " ");

  if (capitalize) {
    formatted = formatted
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return formatted;
}

export const getDateDifference = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffInMs = Number(end) - Number(start);

  if (diffInMs < 0) {
    return "Start date is after end date";
  }

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""}`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""}`;
  } else {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
  }
};

export function formatPrettyDate(dateString: string) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${month}, ${year}`;
}

/**
 * Formats a given date string into "Month (abbreviated) Day, Year".
 * e.g., "November 6, 2025" -> "Nov 6, 2025"
 *
 * @param {string | Date} dateInput - The input date string (e.g., "2025-11-06") or Date object.
 * @returns {string} The formatted date string, or an error message if invalid.
 */
export const formatShortDate = (dateInput: string | Date) => {
  // Try parsing the input. The Date constructor can handle most standard formats.
  const dateObj = new Date(dateInput);

  // Check if the date object is valid (handles invalid input strings)
  if (isNaN(dateObj.getTime())) {
    console.error("Invalid date input provided to formatShortDate:", dateInput);
    return "Invalid Date";
  }

  // Use Intl.DateTimeFormat for reliable and localized formatting
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short", // 'short' gives "Nov", "Dec", etc.
    day: "numeric", // 'numeric' gives "6", "15", etc.
  };

  // Format the date using a specific locale (e.g., 'en-US' or 'en-GB')
  // 'en-US' naturally produces the "Month Day, Year" order
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    dateObj
  );

  // The output of Intl.DateTimeFormat is typically "Nov 6, 2025"
  return formattedDate;
};

export function getFormattedDate() {
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  return now.toLocaleDateString("en-US", options);
}

/**
 * Formats a number with thousands separators.
 * @param value - The number or string to format.
 * @returns A formatted string (e.g., "1,000,000").
 */
export const formatNumberWithCommas = (value: number | string): string => {
  const num = Number(value);
  if (isNaN(num)) {
    return "";
  }
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Removes all non-digit characters from a string.
 * @param value - The string to unformat.
 * @returns A string containing only digits.
 */
export const unformatNumber = (value: string): string => {
  return value.replace(/\D/g, '');
};


/**
 * Sums a specific numeric property across an array of objects.
 * @param arr - The array of objects
 * @param key - A key that must exist within the objects of the array
 */
export function sumArray<T>(arr: T[], key: keyof T): number {
  return arr.reduce((total: number, item: T) => {
    const value = item[key];
    // Ensure the value is treated as a number
    return total + (Number(value) || 0);
  }, 0);
}