/** Hand-drawn 14px outline icons. Too few to justify an icon dependency. */

export function PanelIcon({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="1.5" y="2.5" width="11" height="9" rx="1.5" />
      <line x1="5.5" y1="2.5" x2="5.5" y2="11.5" />
      {collapsed ? <polyline points="7.75,5.75 9.5,7 7.75,8.25" /> : null}
    </svg>
  );
}
