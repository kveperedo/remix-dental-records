import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { userPrefs } from "~/cookies.server";

export const action = async ({ request }: ActionArgs) => {
  const cookieHeader = request.headers.get("Cookie");

  const cookie = (await userPrefs.parse(cookieHeader)) ?? {};
  const formData = await request.formData();

  const isSidebarOpen = formData.get("isSidebarOpen") === "true";
  cookie.isSidebarOpen = isSidebarOpen;

  return json(isSidebarOpen, {
    headers: {
      "Set-Cookie": await userPrefs.serialize(cookie),
    },
  });
};
