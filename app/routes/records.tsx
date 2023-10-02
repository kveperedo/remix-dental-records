import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import type { LucideProps } from "lucide-react";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Book,
  LayoutDashboard,
  LogOut,
  Settings,
  StickyNote,
  Users2,
} from "lucide-react";
import NavbarLink from "~/components/navbar-link";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { userPrefs } from "~/cookies.server";
import { cn } from "~/lib/utils";
import { requireUser } from "~/session.server";

const navLinks: Array<{
  to: string;
  label: string;
  Icon: React.ComponentType<LucideProps>;
}> = [
  {
    to: "/records",
    label: "Records",
    Icon: Users2,
  },
  {
    to: "/notes",
    label: "Notes",
    Icon: StickyNote,
  },
  {
    to: "/dentists",
    label: "Dentists",
    Icon: Book,
  },
  {
    to: "Dashboard",
    label: "Dashboard",
    Icon: LayoutDashboard,
  },
  {
    to: "/settings",
    label: "Settings",
    Icon: Settings,
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);

  const cookieHeader = request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);

  return json({ user, isSidebarOpen: cookie?.isSidebarOpen ?? false });
};

export default function RecordsPage() {
  const { user, isSidebarOpen } = useLoaderData<typeof loader>();
  const sidebarFetcher = useFetcher();

  return (
    <div className="flex h-full flex-col">
      <main className="flex h-full flex-1">
        <aside
          className={cn(
            "flex flex-col border-r border-r-slate-200 p-4",
            isSidebarOpen && "w-64",
          )}
        >
          <div className="mb-4 flex flex-col items-center">
            <div className="flex w-full items-center justify-between">
              {isSidebarOpen && (
                <Link
                  className="flex items-center gap-1 text-xl font-semibold"
                  to="."
                >
                  Dental Records
                </Link>
              )}
              <sidebarFetcher.Form
                className={isSidebarOpen ? "ml-auto" : "m-0"}
                action="/toggle-sidebar"
                method="post"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="submit"
                        name="isSidebarOpen"
                        value={isSidebarOpen ? "false" : "true"}
                      >
                        {isSidebarOpen ? (
                          <ArrowLeftToLine size={20} />
                        ) : (
                          <ArrowRightToLine size={20} />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {isSidebarOpen ? "Collapse" : "Expand"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </sidebarFetcher.Form>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {navLinks.map((props) => (
              <NavbarLink
                key={props.to}
                {...props}
                isSidebarOpen={isSidebarOpen}
              />
            ))}
          </div>

          {user && (
            <div className="mt-auto flex flex-col items-center gap-4">
              <div className="w-full border-t border-slate-100" />
              {isSidebarOpen && (
                <div className="flex w-full flex-col text-left">
                  <span className="line-clamp-2 font-medium"> {user.name}</span>
                  <span className="truncate text-sm text-slate-700">
                    {user.email}
                  </span>
                </div>
              )}
              <Form className="w-full" action="/logout" method="post">
                <Button
                  className={cn("gap-4", isSidebarOpen ? "w-full" : "w-10")}
                  variant="secondary"
                  size={isSidebarOpen ? "default" : "icon"}
                  type="submit"
                >
                  <LogOut size={20} />
                  {isSidebarOpen && <span>Logout</span>}
                </Button>
              </Form>
            </div>
          )}
        </aside>
        <Outlet />
      </main>
    </div>
  );
}
