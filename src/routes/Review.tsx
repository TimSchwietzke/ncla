import { MilestoneNote, PageHeader } from "../components/ui/primitives";

export default function Review() {
  return (
    <div className="max-w-[76ch]">
      <PageHeader
        title="Due today"
        lead="Spaced repetition: rate yourself after each attempt, and the problem comes back when it is about to fade."
      />
      <MilestoneNote milestone="M4">
        The review queue, the 1–5 rating and the schedule — 1, 2, 3, 7 and 14 days, growing on
        repeated success — land with the progress slice.
      </MilestoneNote>
    </div>
  );
}
