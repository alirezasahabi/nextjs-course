import Link from "next/link";
import logo from "@/assets/logo.png";
/**Every class defined in this module will be available as a property on this imported object */
import classes from "./main-header.module.css";

const MainHeader = () => {
  return (
    <header className={classes.header}>
      <Link href="/" className={classes.logo}>
        {/**
         * Unlike in React projects, we can't just pass the image like this(src={logo}).
         * Instead we have to access the "src" property. Because this imported logo in NextJS projects
         * will be an object where the path to the image is stored under this "src" property.
         */}
        <img src={logo.src} alt="logo" />
        Next-Level Food
      </Link>

      <nav className={classes.nav}>
        <ul>
          <li>
            <Link href="/meals">Browse Meals</Link>
          </li>
          <li>
            <Link href="/community">Foodies Commiunity</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainHeader;
