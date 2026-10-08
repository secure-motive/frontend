import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

interface IconBaseProps extends IconProps {
  /** Side length of the square viewBox the path was drawn on. */
  grid: number
  children: ReactNode
}

/**
 * Outline icons drawn in the current text colour, so hover states can recolour
 * them. Size with `className` (e.g. `size-4`). Decorative by default — pass
 * `aria-hidden={false}` and a label if an icon ever stands alone.
 *
 * The arrow, chevron and shield paths are the vectors exported from the Figma
 * file, kept on their original grid.
 */
function IconBase({ grid, strokeWidth = 1, children, ...props }: IconBaseProps) {
  return (
    <svg
      viewBox={`0 0 ${grid} ${grid}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <IconBase grid={16} {...props}>
      <path d="M11.3333 10.6667L14 8L11.3333 5.33333M14 8H2" />
    </IconBase>
  )
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <IconBase grid={16} {...props}>
      <path d="M4.6667 10.6667L2 8L4.6667 5.33333M2 8H14" />
    </IconBase>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <IconBase grid={12} {...props}>
      <path d="M9.5 4.5L6 8L2.5 4.5" />
    </IconBase>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <IconBase grid={20} strokeWidth={1.25} {...props}>
      <path d="M10 3.33333V16.6667M16.6667 10H3.33333" />
    </IconBase>
  )
}

export function MapPinIcon(props: IconProps) {
  return (
    <IconBase grid={24} strokeWidth={1.5} {...props}>
      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </IconBase>
  )
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <IconBase grid={16} {...props}>
      <path d="M6 8.5L7.5 10L10 6.5M8 1.80933C6.49049 3.24282 4.48017 4.02905 2.39867 4C2.13389 4.80665 1.99931 5.65034 2 6.49933C2 10.2273 4.54933 13.3593 8 14.248C11.4507 13.36 14 10.228 14 6.5C14 5.62667 13.86 4.786 13.6013 3.99933H13.5C11.3693 3.99933 9.43333 3.16733 8 1.80933Z" />
    </IconBase>
  )
}

/* The mobile menu toggle and the video play mark are not part of the design;
   these match the weight of the exported icons. */

export function PlayIcon(props: IconProps) {
  return (
    <IconBase grid={24} strokeWidth={1.5} {...props}>
      <path d="M8 5.5v13l10.5-6.5L8 5.5z" />
    </IconBase>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <IconBase grid={24} strokeWidth={1.5} {...props}>
      <path d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
    </IconBase>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <IconBase grid={24} strokeWidth={1.5} {...props}>
      <path d="M6 18L18 6M6 6l12 12" />
    </IconBase>
  )
}

export function MaximizeIcon(props: IconProps) {
  return (
    <IconBase grid={24} strokeWidth={1.5} {...props}>
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </IconBase>
  )
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <IconBase grid={24} strokeWidth={1.5} {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
    </IconBase>
  )
}

