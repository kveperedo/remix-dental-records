import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useMatches,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { getValidatedFormData } from "remix-hook-form";
import type { z } from "zod";
import RecordDialog from "~/components/record-dialog";
import { recordSchema } from "~/components/record-form";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { FULL_DATE_FORMAT } from "~/constants";
import { capitalize, withDelay } from "~/lib/utils";
import { getRecordById, updateRecord } from "~/models/record.server";

const resolver = zodResolver(recordSchema);
type RecordSchema = z.infer<typeof recordSchema>;

export const action = async ({ params, request }: ActionFunctionArgs) => {
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

export const loader = async ({ params }: LoaderFunctionArgs) => {
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

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `Records | ${data?.record.name}` },
];

const tabs = {
  transactions: {
    id: "transactions",
    to: "",
    route: "routes/records.$recordId._index",
  },
  files: {
    id: "files",
    to: "files",
    route: "routes/records.$recordId.files",
  },
} as const;

export default function RecordIdPage() {
  const { record } = useLoaderData<typeof loader>();
  const matches = useMatches();
  const navigate = useNavigate();

  const selectedChildRoute = useMemo(() => {
    const match = matches.find((match) =>
      Object.values(tabs).find((tab) => tab.route === match.id),
    );

    return match?.id ?? tabs.transactions.route;
  }, [matches]);

  const handleTabChange = (route: string) => {
    const tab = Object.values(tabs).find((tab) => tab.route === route);

    if (tab) {
      navigate(tab.to);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex min-h-0 flex-1">
        <div className="flex flex-col gap-4 border-r border-slate-100 p-4">
          <span className="flex h-10 items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    className="-ml-2"
                    variant="ghost"
                    size="icon-sm"
                    asChild
                  >
                    <Link to="../">
                      <ArrowLeft size={20} />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back to records</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <h1 className="text-lg font-semibold">Personal Information</h1>
          </span>
          <div className="flex flex-col gap-4 overflow-auto">
            <div>
              <Label className="text-slate-500">Name</Label>
              <p>{record.name}</p>
            </div>
            <div>
              <Label className="text-slate-500">Birth Date</Label>
              <p>{format(new Date(record.birthDate), FULL_DATE_FORMAT)}</p>
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

          <div className="mt-auto [&>*]:w-full">
            <RecordDialog defaultValues={record} />
          </div>
        </div>
        <Tabs
          className="flex flex-1 flex-col items-stretch gap-4 p-4"
          value={selectedChildRoute}
          onValueChange={handleTabChange}
        >
          <div className="flex items-center justify-between">
            <TabsList className="self-start">
              <TabsTrigger asChild value={tabs.transactions.route}>
                <Link prefetch="intent" to={tabs.transactions.to}>
                  Transactions
                </Link>
              </TabsTrigger>
              <TabsTrigger value={tabs.files.route}>
                <Link prefetch="intent" to={tabs.files.to}>
                  Files
                </Link>
              </TabsTrigger>
            </TabsList>
          </div>

          <Outlet />
        </Tabs>
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
