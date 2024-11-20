'use client'
import {ChevronRight} from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

interface Props {
  items: {
    title: string
    icon?: React.ReactElement
    items?: {
      title: string
      href: string
    }[]
  }[]
}

/**
 * Panel de navegación principal para colocar en un sidebar
 * Recibe un arreglo de items con la siguiente estructura:
 * @param title: string - Título del item
 * @param icon?: React.ReactElement - Icono del item
 * @param items?: {title: string, href: string}[] - Subitems del item
 */
export default function SidebarMainNavigation({items}: Props) {
  const instanceName = usePathname().split('/').pop()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Instancia</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={`${instanceName}/${subItem.href}`}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}