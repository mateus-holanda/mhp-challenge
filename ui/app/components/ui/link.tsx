import { Slot } from '@radix-ui/react-slot'
import { Link as ReLink, LinkProps as ReLinkProps } from '@remix-run/react'
import React, { FC } from 'react'
import { cn } from '~/lib/utils'

export interface LinkProps extends ReLinkProps {
  asChild?: boolean
}

export const Link: FC<LinkProps> = React.forwardRef<HTMLAnchorElement, LinkProps>(({ className, to, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : ReLink
  return <Comp to={to} className={cn('text-primary-neutral hover:text-primary-neutral/80', className)} ref={ref} {...props} />
})

Link.displayName = 'Link'
