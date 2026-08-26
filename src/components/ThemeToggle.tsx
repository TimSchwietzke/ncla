import { useTheme, type ThemePreference } from "../lib/theme";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "light" },
  { value: "dark", label: "dark" },
  { value: "system", label: "auto" },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="flex overflow-hidden rounded-md border border-line"
    >
      {OPTIONS.map((option) => {
        const active = preference === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              setPreference(option.value);
            }}
            aria-pressed={active}
            className={`flex-1 px-2 py-1 font-mono text-2xs transition-colors ${
              active
                ? "bg-accent-soft text-accent"
                : "text-ink-faint hover:bg-surface-2 hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
