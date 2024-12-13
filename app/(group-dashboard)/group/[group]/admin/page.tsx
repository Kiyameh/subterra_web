import React from 'react'
import {auth} from '@/auth'
import {getOneGroup} from '@/database/services/group.services'
import {PopulatedGroup} from '@/database/models/Group.model'

import NotFoundCard from '@/components/_Molecules/cards/404-not-found'
import PendingRequestBanner from '@/components/_Molecules/interactives/pending-request-banner'
import PageContainer from '@/components/theming/page-container'
import BasicCard from '@/components/_Atoms/boxes/basic-card'
import GroupEditionForm from '@/components/_Organisms/forms/group-edition-form'
import {FiBox} from 'react-icons/fi'
import {MdModeEdit} from 'react-icons/md'
import SquareButton from '@/components/_Atoms/buttons/square-button'
import {RiAddBoxLine} from 'react-icons/ri'
import Link from 'next/link'
import InfoBox from '@/components/_Atoms/boxes/info-box'

interface PageProps {
  params: Promise<{group: string}>
}

export default async function GroupAdminPage({params}: PageProps) {
  // Obtener el nombre del grupo
  const groupName = (await params).group as string

  // Obtener el id del usuario
  const userId = (await auth())?.user?._id as string | null

  // Obtener el grupo
  const group = (await getOneGroup(groupName)).content as PopulatedGroup | null

  // Peticiones de membresía pendientes
  const request = group?.member_requests

  if (!group) {
    return (
      <PageContainer>
        <NotFoundCard
          title="Algo ha ido mal"
          text="Ha habido un error al cargar los datos, intentalo de nuevo mas tarde"
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {request && request.length > 0 && (
        <PendingRequestBanner
          requests={request}
          groupId={group._id}
        />
      )}
      <BasicCard
        defaultWidth="xl"
        cardHeader={
          <div className="flex flex-row items-center gap-3">
            <FiBox className="text-xl" />
            <h2 className="text-xl">Instancias</h2>
          </div>
        }
      >
        <Link href={'admin/instance-request'}>
          <div className="flex flex-row gap-4 flex-wrap items-center justify-center">
            {group.instances.length < 3 && (
              <SquareButton
                text="Solicitar una instancia"
                icon={<RiAddBoxLine />}
                color="admin"
              />
            )}
            <div>
              <InfoBox
                title={
                  <span>
                    Tu grupo tiene
                    <span className="font-semibold text-info-foreground px-1">
                      {group.instances.length}
                    </span>
                    instancias
                  </span>
                }
              >
                {group.instances.length === 3
                  ? 'Has alcanzado el límite de instancias, elimina una para solicitar otra'
                  : 'Puedes solicitar hasta tres instancias'}
              </InfoBox>
            </div>
          </div>
        </Link>
      </BasicCard>

      <BasicCard
        defaultWidth="xl"
        cardHeader={
          <div className="flex flex-row items-center gap-3">
            <MdModeEdit className="text-xl" />
            <h2 className="text-xl">Editar información del grupo</h2>
          </div>
        }
      >
        {userId && (
          <GroupEditionForm
            initialData={group}
            commanderId={userId}
          />
        )}
      </BasicCard>
    </PageContainer>
  )
}
