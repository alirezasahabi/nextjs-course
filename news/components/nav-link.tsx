"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
  href: string;
  children: React.ReactNode;
}
const NavLink = ({ href, children }: Props) => {
  const path = usePathname();

  return (
    <Link href={href} className={path.startsWith(href) ? "active" : undefined}>
      {children}
    </Link>
  );
};

export default NavLink;
