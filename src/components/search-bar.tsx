import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

type SearchBarProps = {
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchBar({
  onSearch,
  placeholder = "Search items...",
  className,
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounce(value, 300)

useEffect(() => {
  onSearch(debouncedValue); // ✅ call onSearch only when user stops typing
}, [debouncedValue, onSearch]);
  
  return (
    <form
      className={className}
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value);
      }}
    >
      <div className="relative">
        <input
          id="search"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder={placeholder}
          className="pl-10 pr-10 bg-white/90 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-150 shadow-sm w-full py-2"
        />
        <Search className="pointer-events-none absolute top-1/2 left-3 w-5 h-5 text-green-500 -translate-y-1/2 opacity-80 select-none transition-all" />
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
            tabIndex={-1}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
