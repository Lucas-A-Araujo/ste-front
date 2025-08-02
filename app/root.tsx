import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import notFoundSvg from "../assets/undraw_page-not-found_6wni.svg";
import { AuthProvider } from "./controllers/contexts/AuthContext";
import { PersonProvider } from "./controllers/contexts/PersonContext";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PersonProvider>
        <Outlet />
      </PersonProvider>
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
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
    <main className="pt-16 p-4 container mx-auto">
      <div className="text-center py-12">
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
