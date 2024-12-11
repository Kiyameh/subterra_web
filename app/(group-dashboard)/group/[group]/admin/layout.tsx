import React from 'react'
import {auth} from '@/auth'
import {checkIsAdmin} from '@/database/services/group.services'
import UnauthorizedCard from '@/components/displaying/401-unauthorized'

interface LayoutProps {
  params: Promise<{group: string}>
  children: React.ReactNode
}

export default async function AdminLayout({params, children}: LayoutProps) {
  // Obtener el nombre del grupo
  const groupName = (await params).group

  // Obtener el id del usuario
  const userId = (await auth())?.user?._id

  // Validar roles de usuario
  const isAdmin = (await checkIsAdmin(groupName, userId)).ok as boolean

  if (!isAdmin) return <UnauthorizedCard />

  return <>{children}</>
}
