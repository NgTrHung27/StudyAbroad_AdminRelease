"use client";

import { navItems } from "@/data/nav-items";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type Props = {
  description?: string;
  title?: string;
  className?: string;
};

export const Heading = ({ title, description, className }: Props) => {
  const pathname = usePathname();
  const item = navItems;

  const currentItem = item.find((item) => item.root === pathname);

  return (
    <div className="w-full space-y-1">
      <h1
        className={cn("text-xl font-bold text-main dark:text-white", className)}
      >
        {title ?? currentItem?.label}
      </h1>
      <p className="text-sm text-muted-foreground dark:text-neutral-300 italic">
        {description}
      </p>
    </div>
  );
};
