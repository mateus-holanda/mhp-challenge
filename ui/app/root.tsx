import { LinksFunction } from '@remix-run/node'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from '@remix-run/react'
import { StrictMode } from 'react'

import { ErrorPage } from './components/error-page'
import { Alerts } from './components/ui/alerts'
import { Sonner } from './components/ui/sonner'
import { Toaster } from './components/ui/toaster'
import styles from './style/tailwind.css?url'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

const Document = ({ children }: { children: React.ReactNode }) => {
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
        <Toaster />
        <Sonner richColors />
        <Alerts />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}

export const ErrorBoundary = () => {
  const error = useRouteError()

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <Document>
        <StrictMode>
          <ErrorPage code={error.status} statusText={error.statusText} errorMessages={error.data.message ?? error.data} />
        </StrictMode>
      </Document>
    )
  }

  let errorMessage = 'Unknown error'
  let trace: string | undefined
  if (error instanceof Error) {
    errorMessage = error.message
    trace = error.stack
  }

  return (
    <Document>
      <StrictMode>
        <ErrorPage code={500} traceTitle={errorMessage} trace={trace} />
      </StrictMode>
    </Document>
  )
}
