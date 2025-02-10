"use client";

interface Props {
  error: Error;
}
const FilterError = ({ error }: Props) => {
  return (
    <div id="error">
      <h2>Error</h2>
      <p>{error.message}</p>
    </div>
  );
};

export default FilterError;
