import * as React from 'react'

import { cn } from '~/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  adornment?: string | React.ReactNode
  adornmentClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, adornment, adornmentClassName, ...props }, ref) => {
  const adornmentRef = React.useRef<HTMLSpanElement>(null)

  if (adornment) {
    return (
      <div className="relative w-auto">
        {adornment && (
          <span
            ref={adornmentRef}
            className={cn(
              'absolute inset-y-0 left-2 flex items-center bg-transparent py-2 text-blue-60 text-sm font-normal border-none',
              adornmentClassName,
            )}
          >
            {adornment}
          </span>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
            adornment && 'pl-8',
            className,
          )}
          style={{ paddingRight: adornmentRef.current?.clientWidth }}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
