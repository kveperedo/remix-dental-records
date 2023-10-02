import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, type ActionFunctionArgs, json } from "@remix-run/node";
import { getValidatedFormData } from "remix-hook-form";
import type { z } from "zod";
import { recordSchema } from "~/components/record-form";
import { withDelay } from "~/lib/utils";
import { createRecord } from "~/models/record.server";

const resolver = zodResolver(recordSchema);
type RecordSchema = z.infer<typeof recordSchema>;

export const action = async ({ request }: ActionFunctionArgs) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<RecordSchema>(request, resolver);

  if (errors) {
    return json({ errors, defaultValues });
  }

  const record = await withDelay(createRecord(data));

  return redirect(`/records/${record.id}`);
};

export const loader = () => redirect("/");
