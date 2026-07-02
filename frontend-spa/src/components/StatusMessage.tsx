type StatusMessageProps = {
  tone: "success" | "error";
  children: string;
};

export const StatusMessage = ({ tone, children }: StatusMessageProps) => {
  const classes =
    tone === "success"
      ? "border-sage/30 bg-green-50 text-green-900"
      : "border-red-200 bg-red-50 text-red-900";

  return (
    <p className={`rounded border px-3 py-2 text-sm ${classes}`}>{children}</p>
  );
};
