import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme, type ThemePreference } from "../../lib/theme";

const OPTIONS: { value: ThemePreference; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "Follow the system", icon: Monitor },
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
            title={option.label}
            className={`flex flex-1 items-center justify-center py-1.5 transition-colors ${
              active
                ? "bg-accent-soft text-accent"
                : "text-ink-faint hover:bg-surface hover:text-ink"
            }`}
          >
            <option.icon size={14} strokeWidth={1.75} />
            <span className="sr-only">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
