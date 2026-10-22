import { Link, NavLink } from 'react-router'
import Button from '@/components/common/Button'
import Container from '@/components/common/Container'
import { CloseIcon, MenuIcon } from '@/components/common/icons'
import Logo from '@/components/common/Logo'
import { headerCta, primaryNav } from '@/data/navigation'
import type { MobileMenuState } from '@/hooks/useMobileMenu'
import { ROUTES } from '@/routes/paths'
import { cn } from '@/utils/helpers'
import MobileMenu from './MobileMenu'
import ServicesMenu from './ServicesMenu'
import { NAV_LABEL_CLASSES, navItemColors } from './navStyles'

const MOBILE_MENU_ID = 'mobile-menu'

interface HeaderProps {
  menu: MobileMenuState
}

/**
 * Fixed site header (64px). From `lg` up it shows the full navigation and the
 * assessment button; below that, a toggle opens the mobile menu.
 */
export default function Header({ menu }: HeaderProps) {
  const { isOpen, toggle, close, toggleRef } = menu

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cyber-teal/10 bg-cyber-bg/95 backdrop-blur-[6px]">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to={ROUTES.home} aria-label="SecureXmotive — home" className="shrink-0">
          <Logo variant="nav" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 nav:gap-1">
            {primaryNav.map((item) => (
              <li key={item.to}>
                {item.to === ROUTES.services ? (
                  <ServicesMenu />
                ) : (
                  <NavLink
                    to={item.to}
                    end={item.to === ROUTES.home}
                    className={({ isActive }) =>
                      cn(
                        NAV_LABEL_CLASSES,
                        'block px-2.5 py-2 whitespace-nowrap nav:px-4',
                        navItemColors(isActive),
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Button variant="outline" size="sm" to={headerCta.to}>
            {headerCta.label}
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls={MOBILE_MENU_ID}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          onClick={toggle}
          className="-mr-2 flex size-10 cursor-pointer items-center justify-center rounded-lg text-cyber-muted transition-colors hover:text-cyber-teal lg:hidden"
        >
          {isOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </Container>

      <MobileMenu id={MOBILE_MENU_ID} isOpen={isOpen} onClose={close} />
    </header>
  )
}
