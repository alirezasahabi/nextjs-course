import React from "react";

interface Props {
  /**
   * The "page" file of the current folder, which is placed next to the "layout" file
   * that output the parallel routes will be made available through the default "children" prop.
   * We can do this as an alternative instead of creating a dedicated parallel route sub folder.
   */
  children: React.ReactNode;
  modal: React.ReactNode;
}
const NewsDetailsLayout = ({ children, modal }: Props) => {
  return (
    <>
      {modal}
      {children}
    </>
  );
};

export default NewsDetailsLayout;
