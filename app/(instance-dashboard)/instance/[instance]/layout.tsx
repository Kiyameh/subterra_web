import React from 'react'
import ShortcutTooltip from '@/components/_Atoms/badges/shortcut-tooltip'
import NavigationBreadcrumb from '@/components/navigations/dashboard-breadcrumb'
import InstanceSidebar from '@/components/_instance-dashboard/instace-sidebar/instance-sidebar'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import SubterraDropdown from '@/components/navigations/subterra-dropdown'
import FloatingContactForm from '@/components/_staff-dashboard/floating-contact-form/floating-contact'
import {auth} from '@/auth'

interface InstanceDashboardLayoutProps {
  params: Promise<{instance: string}>
  children: React.ReactNode
}

/**
 * Layout principal de la sección de instancia, que incluye la barra lateral
 * y la barra superior.
 */
export default async function InstanceDashboardLayout({
  params,
  children,
}: InstanceDashboardLayoutProps) {
  // Obtener nombre de la instancia de la URL:
  const instanceName = (await params).instance

  // Obtener el suario actual:
  const user = (await auth())?.user

  return (
    <SidebarProvider>
      {/* Componente de la barra lateral de instancia */}
      <InstanceSidebar instanceName={instanceName} />
      <SidebarInset className="bg-inherit">
        {/* Encabezado de la página */}
        <header className="flex h-12 md:h-10 items-center justify-between pr-4 bg-card transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10 ">
          {/* Botón de la barra lateral */}
          <div className="flex flex-row gap-2 items-center">
            <ShortcutTooltip shortcut="Ctrl+B">
              <SidebarTrigger className="mx-2 text-primary md:text-foreground scale-125 md:scale-100" />
            </ShortcutTooltip>
            <NavigationBreadcrumb />
          </div>
          <SubterraDropdown />
        </header>
        {/* Contenido de la página */}
        <main className="flex h-full items-center justify-center">
          {children}
        </main>
      </SidebarInset>
      <nav className="fixed top-6 right-6 z-50 md:bottom-6 md:top-auto">
        <FloatingContactForm commander={user} />
      </nav>
    </SidebarProvider>
  )
}
