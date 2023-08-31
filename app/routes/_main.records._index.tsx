import { Link } from "@remix-run/react";

export default function MainIndexPage() {
  return (
    <>
      <h1>Index page</h1>

      <Link to="123">Go to specific record</Link>
    </>
  );
}
