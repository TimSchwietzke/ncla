import { Link } from "react-router";
import { PageHeader } from "../components/ui";

export default function NotFound() {
  return (
    <>
      <PageHeader title="Not found" lead="That page does not exist." />
      <Link to="/" className="text-sm text-accent">
        Back to the start →
      </Link>
    </>
  );
}
