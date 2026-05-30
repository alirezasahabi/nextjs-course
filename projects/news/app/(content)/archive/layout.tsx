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
