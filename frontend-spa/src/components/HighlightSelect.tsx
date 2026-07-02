import { HIGHLIGHTS } from "../constants";
import type { Highlight } from "../types";

type HighlightSelectProps = {
  id: string;
  value: Highlight | "";
  onChange: (value: Highlight | "") => void;
};

export const HighlightSelect = ({
  id,
  value,
  onChange,
}: HighlightSelectProps) => (
  <select
    className="h-11 w-full rounded border border-cafe-200 bg-white px-3 text-cafe-700 outline-none transition focus:border-cafe-500 focus:ring-2 focus:ring-cafe-100"
    id={id}
    value={value}
    onChange={(event) => onChange(event.target.value as Highlight | "")}
    required
  >
    <option value="">Select one</option>
    {HIGHLIGHTS.map((highlight) => (
      <option key={highlight} value={highlight}>
        {highlight}
      </option>
    ))}
  </select>
);
