export const numberFormatter = new Intl.NumberFormat("en-IN");
export const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export const shortDateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
});

export const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatPersonName(person: {
  firstName: string;
  lastName: string | null;
} | null) {
  if (!person) {
    return "Unassigned";
  }

  return [person.firstName, person.lastName].filter(Boolean).join(" ");
}

export function formatCustomerName(customer: {
  legalName: string;
  primaryContactName: string | null;
} | null) {
  if (!customer) {
    return "Not linked";
  }

  return customer.primaryContactName
    ? `${customer.legalName} (${customer.primaryContactName})`
    : customer.legalName;
}

export function formatDateTimeLocalInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}
