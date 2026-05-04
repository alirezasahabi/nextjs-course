/**
 * Parallel routes
 * It's feature that allows us to render the content multiple routes
 * with separate paths on one & the same page.
 * 
 * To set up parallel routing, we must add a layout file to that path
 * where we want to have the parallel routes.
 * Then we need to add one sub folder per parallel route.
 * We add a parallel route by adding a folder starts with "@".
 * This is part of parallel route naming convention that NextJS looks for.
 * 
 * By default, layout components receive "children" prop which is
 * the content of the page that's currently shown on the screen.
 * But when working with parallel routes, we're not gonna have the children prop.
 * Instead, we're gonna one prop per parallel route with that name we chose
 * after the "@" as prop name.
 * 
 * Now, if we navigate to this parallel routes path, we'll see
 * the content of these pages(sub folders start with "@") next to each other
 * even though we're on one single route.
 */

import React from "react";

interface Props {
  archive: React.ReactNode;
  latest: React.ReactNode;
}
const ArchiveLayout = ({ archive, latest }: Props) => {
  return (
    <div>
      <h1>Archived News</h1>
      <section id="archive-filter">{archive}</section>
      <section id="archive-latest">{latest}</section>
    </div>
  );
};

export default ArchiveLayout;
