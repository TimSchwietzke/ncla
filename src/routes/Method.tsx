import { MilestoneNote, PageHeader } from "../components/ui/primitives";

export default function Method() {
  return (
    <div className="max-w-[76ch]">
      <PageHeader
        title="How to approach a problem you have never seen"
        lead="A repeatable order of operations, so that an unfamiliar statement does not turn into staring."
      />
      <MilestoneNote milestone="M1">
        The full guide plus the checklist that sits next to every problem — read the examples,
        derive the target complexity from the constraints, name the brute force, find its
        bottleneck, pick a pattern, only then write code — is the next slice.
      </MilestoneNote>
    </div>
  );
}
