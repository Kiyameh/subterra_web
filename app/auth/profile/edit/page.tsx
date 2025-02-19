import React from 'react'
import CardWithHeader from '@/components/_Atoms/boxes/card-with-header'
import {auth} from '@/auth'
import ProfileEditForm from '@/components/_authentication/profile-edit-form'
import {FullUser, getFullUser} from '@/database/services/user.actions'
import UnauthorizedCard from '@/components/cards/401-unauthorized'

export default async function EditProfilePage() {
  const userId = (await auth())?.user._id
  const user: FullUser | undefined = await getFullUser(userId)

  if (!user)
    return (
      <UnauthorizedCard
        text="Inicia sesión para acceder a esta página"
        redirectLabel="Iniciar sesión"
        redirectUrl="/auth/login"
      />
    )

  const {name, fullname, image, email} = user

  return (
    <CardWithHeader cardSubHeader="Editar perfil">
      <ProfileEditForm user={{name, fullname, image, email}} />
    </CardWithHeader>
  )
}
