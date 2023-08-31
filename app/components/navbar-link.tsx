import type { LucideProps } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { NavLink as RemixNavLink } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { buttonVariants } from "./ui/button";

type NavbarLinkProps = {
  to: string;
  label: string;
  Icon: React.ComponentType<LucideProps>;
  isSidebarOpen: boolean;
};

const NavbarButton = ({ to, label, Icon, isSidebarOpen }: NavbarLinkProps) => {
  return (
    <RemixNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          buttonVariants({
            variant: isActive ? "secondary" : "ghost",
            size: isSidebarOpen ? "default" : "icon",
          }),
          "w-full",
          isSidebarOpen ? "justify-start gap-4" : "justify-center",
        )
      }
    >
      <Icon className="flex-shrink-0 text-inherit" />
      {isSidebarOpen && <span className="text-inherit">{label}</span>}
    </RemixNavLink>
  );
};

const NavbarLink = (props: NavbarLinkProps) => {
  if (props.isSidebarOpen) {
    return <NavbarButton {...props} />;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="w-full">
          <NavbarButton {...props} />
        </TooltipTrigger>
        <TooltipContent hideWhenDetached side="right">
          {props.label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NavbarLink;
