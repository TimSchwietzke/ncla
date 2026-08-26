import { Link } from "react-router";
import { PageHeader } from "../components/ui/primitives";

export default function NotFound() {
  return (
    <div className="max-w-[76ch]">
      <PageHeader title="Not found" lead="That page does not exist." />
      <Link to="/" className="text-sm text-accent hover:underline">
        Back to the start →
      </Link>
    </div>
  );
}
