import { MilestoneNote, PageHeader } from "../components/ui";

export function Method() {
  return (
    <>
      <PageHeader
        title="How to approach a problem you have never seen"
        lead="A repeatable order of operations, so that an unfamiliar statement does not turn into staring."
      />
      <MilestoneNote milestone="M1">
        The full guide plus the checklist that sits next to every problem — read the examples,
        derive the target complexity from the constraints, name the brute force, find its
        bottleneck, pick a pattern, only then write code — is the next slice.
      </MilestoneNote>
    </>
  );
}

export function Review() {
  return (
    <>
      <PageHeader
        title="Due today"
        lead="Spaced repetition: rate yourself after each attempt, and the problem comes back when it is about to fade."
      />
      <MilestoneNote milestone="M4">
        The review queue, the 1–5 rating and the schedule (1, 2, 3, 7 and 14 days, growing on
        repeated success) land with the progress slice.
      </MilestoneNote>
    </>
  );
}

export function Progress() {
  return (
    <>
      <PageHeader title="Progress" lead="Where you stand, per category and per pattern." />
      <MilestoneNote milestone="M4">
        Status per problem, notes, and JSON export/import — everything is stored locally, so the
        export is the only backup that exists.
      </MilestoneNote>
    </>
  );
}

export function CheatSheet() {
  return (
    <>
      <PageHeader
        title="Cheat sheet"
        lead="Complexity table, the constraints-to-complexity rule of thumb, and the three questions for the last ten minutes before an interview."
      />
      <MilestoneNote milestone="M1">
        Comes with the method slice, straight from the appendix of the source document.
      </MilestoneNote>
    </>
  );
}
