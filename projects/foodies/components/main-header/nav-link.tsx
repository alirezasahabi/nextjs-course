"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import classes from "./nav-link.module.css";

interface Props {
  href: string;
  children: string;
}
const NavLink = ({ href, children }: Props) => {
  const path = usePathname();

  return (
    <Link
      href={href}
      className={
        path.startsWith(href)
          ? `${classes.link} ${classes.active}`
          : classes.link
      }
    >
      {children}
    </Link>
  );
};

export default NavLink;
