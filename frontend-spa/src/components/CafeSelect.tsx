import type { Cafe } from "../types";

type CafeSelectProps = {
  cafes: Cafe[];
  id: string;
  isLoading: boolean;
  value: number | null;
  onChange: (value: number | null) => void;
};

export const CafeSelect = ({
  cafes,
  id,
  isLoading,
  value,
  onChange,
}: CafeSelectProps) => (
  <select
    className="h-11 w-full rounded border border-cafe-200 bg-white px-3 text-cafe-700 outline-none transition focus:border-cafe-500 focus:ring-2 focus:ring-cafe-100 disabled:cursor-not-allowed disabled:bg-cafe-50"
    id={id}
    value={value ?? ""}
    onChange={(event) =>
      onChange(event.target.value ? Number(event.target.value) : null)
    }
    disabled={isLoading || cafes.length === 0}
    required
  >
    <option value="">{isLoading ? "Loading cafes..." : "Select one"}</option>
    {cafes.map((cafe) => (
      <option key={cafe.id} value={cafe.id}>
        {cafe.name}
      </option>
    ))}
  </select>
);
