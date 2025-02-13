import { Link as ReLink } from '@remix-run/react'
import { FC } from 'react'
import { Button } from '~/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/drawer'
import { Link } from '~/components/ui/link'

export interface ErrorPageProps {
  code?: number
  statusText?: string
  errorMessages?: string
  traceTitle?: string
  trace?: string
}

export const ErrorPage: FC<ErrorPageProps> = ({ code, statusText, errorMessages, traceTitle, trace }) => {
  const showTrace = Boolean(trace && process.env.NODE_ENV !== 'production')
  return (
    <Drawer>
      <div className="flex flex-col bg-gray-50 dark:bg-black items-center justify-center h-screen text-center">
        <ReLink to="/" className="items-center space-x-2 flex">
          <img
            src="/assets/img/my-home-pathway-logo.png"
            alt="My Home Pathway's Logo"
            className='md:absolute top-0 left-20 flex justify-center my-12 w-48'
          />
        </ReLink>
        <div className="mb-2">
          {code === 500 ? (
            <>
              <h1 className="text-4xl font-bold my-10">Unexpected Error</h1>
              <p className="text-muted-foreground">Sorry, this page doesn&apos;t seem to be working.</p>
              <p className="text-muted-foreground">If this issue persists please contact our support team.</p>
              <div className="mt-4 text-center">
                <p className="text-muted-foreground mb-3">
                  You can also try going <Link to="javascript: history.back();">back</Link> to where you were or go to our{' '}
                  <Link to="/">home page</Link>
                </p>
              </div>
            </>
          ) : (
            <>
              {code === 404 ? (
                <>
                  <h1 className="text-4xl font-bold my-10">Page Not Found</h1>
                  <p className="text-muted-foreground">Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold my-10">
                    {code ? `${code}: ` : ''}
                    {statusText}
                  </h1>
                  <p className="text-muted-foreground">{errorMessages}</p>
                </>
              )}
              <div className="mt-4 text-center">
                <p className="text-muted-foreground mb-3">
                  Try going <Link to="javascript: history.back();">back</Link> where you were or go to our <Link to="/">home page</Link>
                </p>
              </div>
            </>
          )}
        </div>

        {showTrace ? (
          <DrawerTrigger asChild>
            <Button variant="outline">View Trace</Button>
          </DrawerTrigger>
        ) : null}
      </div>
      {showTrace ? (
        <DrawerContent>
          <div className="mx-auto w-full">
            <DrawerHeader>
              <DrawerTitle>Debug Trace</DrawerTitle>
              <DrawerDescription>{traceTitle}</DrawerDescription>
            </DrawerHeader>
            <div className="w-full p-4 pb-0 overflow-y-auto h-[70vh]">
              <pre>{trace}</pre>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      ) : null}
    </Drawer>
  )
}
