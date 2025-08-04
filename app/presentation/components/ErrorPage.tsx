import { isRouteErrorResponse } from "react-router";
import notFoundSvg from "../../../assets/undraw_page-not-found_6wni.svg";

interface ErrorPageProps {
  error: unknown;
}

export function ErrorPage({ error }: ErrorPageProps) {
  let message = "";
  let details = "";
  let stack: string | undefined;
  let is404 = false;

  if (isRouteErrorResponse(error)) {
    is404 = error.status === 404;
    message = is404 ? "Página não encontrada" : "Erro";
    details =
      is404
        ? "A página que você está procurando não existe."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {is404 && (
          <div className="mb-6">
            <img 
              src={notFoundSvg} 
              alt="Página não encontrada" 
              className="mx-auto h-48 w-48 text-gray-400"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{message}</h1>
        <p className="text-gray-600 mb-6">{details}</p>
        {!is404 && stack && (
          <pre className="w-full p-4 overflow-x-auto bg-gray-100 rounded-md">
            <code className="text-sm">{stack}</code>
          </pre>
        )}
        {is404 && (
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Voltar
          </button>
        )}
      </div>
    </main>
  );
} 