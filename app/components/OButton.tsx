import { ReactNode } from 'react'
import { Button, ButtonProps } from 'react-aria-components'

import ProgressCircle from '@app/components/ProgressCircle'

interface OButton extends ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'outlined' | 'text'
  isPending?: boolean
}

export default function OButton({
  children,
  variant = 'primary',
  ...props
}: OButton) {
  return (
    <span
      className={`
        ${variant === 'outlined' ? '[&_.react-aria-Button]:bg-transparent [&_.react-aria-Button]:border [&_.react-aria-Button]:border-solid [&_.react-aria-Button]:border-white' : ''}
        ${variant === 'text' ? '[&_.react-aria-Button]:bg-transparent' : ''}
      `}
    >
      <Button {...props}>
        {props.isPending ? (
          <ProgressCircle
            className="py-0.5 flex justify-center"
            aria-label="Loading…"
            isIndeterminate
          />
        ) : (
          children
        )}
      </Button>
    </span>
  )
}
