"use client";

interface Props {
  error: Error;
}
const ErrorPage = ({}: Props) => {
  return (
    <main className="error">
      <h1>An error occurred!</h1>
      <p>Failed to fetch meals.</p>
    </main>
  );
};

export default ErrorPage;
