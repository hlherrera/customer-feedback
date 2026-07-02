import { RATINGS } from "../constants";

type RatingInputProps = {
  value: number | null;
  onChange: (value: number) => void;
};

export const RatingInput = ({ value, onChange }: RatingInputProps) => (
  <div
    className="grid grid-cols-5 gap-2"
    role="radiogroup"
    aria-label="Overall rating"
  >
    {RATINGS.map((rating) => {
      const selected = rating === value;
      return (
        <button
          className={`h-11 rounded border text-sm font-semibold transition ${
            selected
              ? "border-cafe-700 bg-cafe-700 text-white"
              : "border-cafe-200 bg-white text-cafe-700 hover:border-cafe-500"
          }`}
          key={rating}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(rating)}
        >
          {rating}
        </button>
      );
    })}
  </div>
);
