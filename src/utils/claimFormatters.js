export const money = (value) =>
  new Intl.NumberFormat(
    "en-ZA",
    {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 0
    }
  ).format(Number(value) || 0);

export const priorityColor = (priority) => {
  if (priority === "Critical") {
    return "error";
  }

  if (priority === "High") {
    return "warning";
  }

  if (priority === "Low") {
    return "success";
  }

  return "default";
};

export const stageColor = (stage = "") => {
  if (stage.includes("Awaiting")) {
    return "warning";
  }

  if (
    stage.includes("Review") ||
    stage.includes("Report")
  ) {
    return "info";
  }

  if (stage.includes("Complete")) {
    return "success";
  }

  return "default";
};
