import Link from "next/link";
import logo from "@/assets/logo.png";
/**Every class defined in this module will be available as a property on this imported object */
import classes from "./main-header.module.css";
import Image from "next/image";
import MainHeaderBackground from "./main-header-background";
import NavLink from "./nav-link";

const MainHeader = () => {
  return (
    <>
      <MainHeaderBackground />
      <header className={classes.header}>
        <Link href="/" className={classes.logo}>
          <Image src={logo} alt="logo" priority />
          Next-Level Food
        </Link>

        <nav className={classes.nav}>
          <ul>
            <li>
              <NavLink href="/meals">Browse Meals</NavLink>
            </li>
            <li>
              <NavLink href="/community">Foodies Commiunity</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default MainHeader;
