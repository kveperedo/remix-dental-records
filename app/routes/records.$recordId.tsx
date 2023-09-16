import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { Response, json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { getValidatedFormData } from "remix-hook-form";
import type { z } from "zod";
import RecordDialog from "~/components/record-dialog";
import { recordSchema } from "~/components/record-form";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { capitalize, withDelay } from "~/lib/utils";
import { getRecordById, updateRecord } from "~/models/record.server";

const resolver = zodResolver(recordSchema);
type RecordSchema = z.infer<typeof recordSchema>;

export const action = async ({ params, request }: ActionArgs) => {
  const { recordId } = params;

  if (!recordId) {
    throw new Error("No record ID provided");
  }

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<RecordSchema>(request, resolver);

  if (errors) {
    return json({ errors, defaultValues });
  }

  await withDelay(updateRecord({ ...data, id: recordId }));

  return json({});
};

export const loader = async ({ params }: LoaderArgs) => {
  const recordId = params.recordId;

  if (!recordId) {
    throw new Response("No record ID provided", { status: 400 });
  }

  const record = await getRecordById(recordId);

  if (!record) {
    throw new Response("No record found!", { status: 404 });
  }

  return json({ record });
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  { title: `Records | ${data?.record.name}` },
];

export default function RecordIdPage() {
  const { record } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon" asChild>
                <Link to="../">
                  <ArrowLeft size={20} />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Back to records</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-xl">{record.name}</span>

        <div className="ml-auto">
          <RecordDialog defaultValues={record} />
        </div>
      </div>

      <div className="my-4 w-full border-t border-slate-100" />

      <div className="flex flex-1">
        <div className="w-72 px-4">
          <h1 className="text-lg font-semibold">Personal Information</h1>
          <div className="flex flex-col gap-4 py-2">
            <div>
              <Label className="text-slate-500">Name</Label>
              <p>{record.name}</p>
            </div>
            <div>
              <Label className="text-slate-500">Birth Date</Label>
              <p>{format(new Date(record.birthDate), "LLLL dd, yyyy")}</p>
            </div>
            <div>
              <Label className="text-slate-500">Phone Number</Label>
              <p>{record.telephone}</p>
            </div>
            <div>
              <Label className="text-slate-500">Address</Label>
              <p>{record.address}</p>
            </div>
            <div>
              <Label className="text-slate-500">Gender</Label>
              <p>{capitalize(record.gender)}</p>
            </div>
            <div>
              <Label className="text-slate-500">Marital Status</Label>
              <p>{capitalize(record.status)}</p>
            </div>
            <div>
              <Label className="text-slate-500">Occupation</Label>
              <p>{record.occupation}</p>
            </div>
          </div>
        </div>
        <div className="flex-1">transactions</div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  console.log(error);

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  return (
    <div className="flex h-full w-full">
      <div className="m-auto flex flex-col items-center gap-4">
        <h1 className="text-lg font-semibold">{error.data}</h1>
        <Button asChild>
          <Link to="/">Go back to records</Link>
        </Button>
      </div>
    </div>
  );
}
