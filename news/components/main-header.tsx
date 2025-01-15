import Link from "next/link";

const MainHeader = () => {
  return (
    <header
      style={{
        height: 50,
        padding: "0 1rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <Link href="/">Home</Link>
      <Link href="/news">News</Link>
    </header>
  );
};

export default MainHeader;
