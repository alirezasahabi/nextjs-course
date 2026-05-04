/**
 * When user enters an invalid URL we get a default 404 page by NextJS.
 * We can also create our own custom not found page by creating a file named "not-found".
 * It will automatically cover any sibiling & nested pages.
 * (Ex: If we add it on the root level, we can catch all not-found erros).
 */

const NotFoundPage = () => {
  return (
    <main className="not-found">
      <h1>404 | Not Found!</h1>
      <p>Could not find the requested page or resource.</p>
    </main>
  );
};

export default NotFoundPage;
