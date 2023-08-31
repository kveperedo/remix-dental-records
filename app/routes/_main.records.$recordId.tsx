import { Link, useParams } from "@remix-run/react";

export default function RecordIdPage() {
  const params = useParams();

  return (
    <>
      <h1>Record ID page: {params.recordId}</h1>

      <Link to="../">Go to records</Link>
    </>
  );
}
