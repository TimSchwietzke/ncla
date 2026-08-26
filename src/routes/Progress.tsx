import { MilestoneNote, PageHeader } from "../components/ui/primitives";

export default function Progress() {
  return (
    <div className="max-w-[76ch]">
      <PageHeader title="Progress" lead="Where you stand, per category and per pattern." />
      <MilestoneNote milestone="M4">
        Status per problem, notes, and JSON export/import — everything is stored locally, so the
        export is the only backup that exists.
      </MilestoneNote>
    </div>
  );
}
