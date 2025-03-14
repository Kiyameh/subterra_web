'use client'
import React from 'react'
import {SidebarGroup, useSidebar} from '@/components/ui/sidebar'
import {AdminBadge, EditorBadge} from '../../_Atoms/slots/user-slots'
import {FaGear} from 'react-icons/fa6'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {IoClose} from 'react-icons/io5'
import ResignEditorDialog from '../instance-dialogs/resign-editor-dialog'
import ResignCoordinatorDialog from '../instance-dialogs/resign-coordinator-dialog'

/**
 * @version 1
 * @description Componente para sidebar de instancia que indica el rol del usuario
 * @param isEditor
 * @param isAdmin
 * @param instanceId Id de la instancia
 * @param userId Id del usuario
 */

export default function SidebarInstanceRoleBox({
  isEditor,
  isCoordinator,
  instanceId,
  userId,
}: {
  isEditor: boolean
  isCoordinator: boolean
  instanceId: string | undefined
  userId: string | undefined
}) {
  const {isMobile, toggleSidebar} = useSidebar()
  const isOpen = useSidebar().open

  const [resignEditorOpen, setResignEditorOpen] = React.useState(false)
  const [resignCoordinatorOpen, setResignCoordinatorOpen] =
    React.useState(false)

  if (!userId || !instanceId) return null

  return (
    <>
      <SidebarGroup className="flex flex-row items-center gap-2">
        {isEditor && isOpen && (
          <EditorBadge
            label="Editor"
            helperText="Eres editor de esta instancia"
          />
        )}
        {isCoordinator && isOpen && (
          <AdminBadge
            label="Coordinador"
            helperText="Eres coordinador de esta instancia"
          />
        )}
        {(isEditor || isCoordinator) && isOpen && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <FaGear className="text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  setResignEditorOpen(true)
                  if (isMobile) toggleSidebar()
                }}
              >
                <IoClose />
                Renunciar como editor
              </DropdownMenuItem>
              {isCoordinator && (
                <DropdownMenuItem
                  onClick={() => {
                    setResignCoordinatorOpen(true)
                    if (isMobile) toggleSidebar()
                  }}
                >
                  <IoClose />
                  Renunciar como coordinador
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarGroup>
      <ResignEditorDialog
        instanceId={instanceId}
        userId={userId}
        isOpen={resignEditorOpen}
        onOpenChange={setResignEditorOpen}
      />
      <ResignCoordinatorDialog
        instanceId={instanceId}
        userId={userId}
        isOpen={resignCoordinatorOpen}
        onOpenChange={setResignCoordinatorOpen}
      />
    </>
  )
}
