import * as React from 'react'
import {auth} from '@/auth'
import {Session} from 'next-auth'

import {GroupIndex} from '@/database/services/group.actions'
import {checkIsAdmin} from '@/database/services/group.actions'
import {checkIsMember} from '@/database/services/group.actions'
import {getGroupsIndex} from '@/database/services/group.actions'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

import SidebarGroupSelector from '@/components/_Organisms/sidebar/sidebar-group-selector'
import SidebarGroupNavigation from '@/components/_Organisms/sidebar/sidebar-group-navigation'
import SidebarUserMenu from '@/components/_Organisms/sidebar/sidebar-user-menu'
import SidebarLoginButton from '@/components/_Organisms/sidebar/sidebar-login-button'
import SidebarRoleIndicator from './sidebar-role-indicator'

interface GroupSidebarProps extends React.ComponentProps<typeof Sidebar> {
  groupName: string
}

/**
 * @version 1
 * @description Sidebar para grupos
 * @param groupName Nombre del grupo
 */
export default async function GroupSidebar({
  groupName,
  ...props
}: GroupSidebarProps) {
  // Obtener el usuario actual:
  const user = (await auth())?.user as Session['user'] | null

  // Obtener índice de grupos de la base de datos:
  const groupsIndex = (await getGroupsIndex()).content as GroupIndex[] | null

  // Obtener Índice del grupo actual:
  const currentGroupIndex = groupsIndex?.find(
    (group) => group.name === groupName
  ) as GroupIndex | null

  // Comprobar si el usuario es miembro del grupo:
  const isMember = await checkIsMember(user?._id, groupName)

  // Comprobar si el usuario es admin del grupo:
  const isAdmin = await checkIsAdmin(user?._id, groupName)
  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        {/*? null manejado en el componente:*/}
        <SidebarGroupSelector
          groupsIndex={groupsIndex}
          currentGroupIndex={currentGroupIndex}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarRoleIndicator
          isEditor={isMember}
          editorTag="Miembro"
          editorText="Eres miembro de este grupo"
          isAdmin={isAdmin}
          adminText="Eres administrador de este grupo"
        />
        {currentGroupIndex && (
          <SidebarGroupNavigation
            isMember={isMember}
            isAdmin={isAdmin}
          />
        )}
      </SidebarContent>
      <SidebarFooter>
        {user ? <SidebarUserMenu user={user} /> : <SidebarLoginButton />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
