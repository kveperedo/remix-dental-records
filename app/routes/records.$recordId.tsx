import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getRecordById } from "~/models/record.server";

export const loader = async ({ params }: LoaderArgs) => {
  const recordId = params.recordId;

  if (!recordId) {
    throw new Error("No record ID provided");
  }

  const record = await getRecordById(recordId);

  if (!record) {
    throw new Error("No record found");
  }

  return json({ record });
};

export default function RecordIdPage() {
  const { record } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Record ID page: {record.id}</h1>

      <span>{record.name}</span>

      <Link to="../">Go to records</Link>
    </>
  );
}
