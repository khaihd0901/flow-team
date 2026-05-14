import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search Facebook",
  loading = false,
  onFocus,
  onClear,
}) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleClear = () => {
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl border rounded-xl">
      <div
        className={`
          flex
          items-center
          gap-3
          rounded-xl
          border
          bg-muted/50
          px-3
          py-3
          w-[260px]
          md:w-sm
          transition-all
          duration-300

          ${
            focused
              ? "border-primary ring-2 ring-primary/20 bg-background"
              : "border-transparent"
          }
        `}
      >
        <Search
          className={`
            h-6
            w-6
            transition-all
            duration-300
            ${focused ? "text-primary" : "text-muted-foreground"}
          `}
        />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={() => setFocused(false)}
          className="
            w-full
            bg-transparent
            text-sm
            outline-none
            placeholder:text-muted-foreground
          "
        />

        {loading && (
          <div
            className="
              h-4
              w-4
              animate-spin
              rounded-full
              border-2
              border-primary
              border-t-transparent
            "
          />
        )}

        {!!value && !loading && (
          <button
            onClick={handleClear}
            className="
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              bg-muted
              transition-colors
              hover:bg-muted-foreground/20
            "
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
