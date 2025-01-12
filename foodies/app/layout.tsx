import MainHeader from "@/components/main-header";
import "./globals.css";

/**
 * NextJS is looking for exported variables called "metadata" in all "layout" or "page" files.
 * In this object we can set metadata fields which is described in details in the NextJS docs: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 * This "metadata" constant allows us to add bunch of metadata, which are then:
 * exposed to search engine crawlers _ shows up when sharing a link to a page.
 * 
 * If we add this metadata to a layout, it will automatically be added
 * to all pages that are wrapped by that layout unless a layout/page sepecifies its own metadata.
 * 
 */
export const metadata = {
  title: "Next-Level Food",
  description: "Delicious meals, shared by a food-loving community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MainHeader />
        {children}
      </body>
    </html>
  );
}
