import { MilestoneNote, PageHeader } from "../components/ui/primitives";

export default function CheatSheet() {
  return (
    <div className="max-w-[76ch]">
      <PageHeader
        title="Cheat sheet"
        lead="Complexity table, the constraints-to-complexity rule of thumb, and the three questions for the last ten minutes before an interview."
      />
      <MilestoneNote milestone="M1">
        Comes with the method slice, straight from the appendix of the source document.
      </MilestoneNote>
    </div>
  );
}
