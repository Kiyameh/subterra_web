import BasicCard from '@/components/_Atoms/boxes/basic-card'
import React from 'react'
import {TextSlot} from '../../_Atoms/slots/text-slots'
import {MultiChipSlot} from '../../_Atoms/slots/chip-slots'
import {IoMdInformationCircle} from 'react-icons/io'
import CardTitle from '@/components/_Atoms/boxes/card-title'

import FetchingErrorButton from '@/components/_Atoms/buttons/fetching-error-button'
import {getOneGroup, GroupWithUsers} from '@/database/services/group.actions'

/**
 * @version 1
 * @description Muestra la información de un grupo
 * @param groupName Nombre del grupo
 */

export default async function GroupInfoCard({groupName}: {groupName: string}) {
  // Obtener el grupo
  const group = (await getOneGroup(groupName)).content as GroupWithUsers | null

  return (
    <BasicCard
      key="group_info_card"
      cardHeader={
        <CardTitle
          title={'Información general'}
          icon={<IoMdInformationCircle />}
        />
      }
    >
      {!group ? (
        <FetchingErrorButton />
      ) : (
        <>
          <TextSlot
            label="ID"
            value={group._id}
          />
          <TextSlot
            label="Ácronimo"
            value={group.acronym}
          />
          <TextSlot
            label="Nombre completo"
            value={group.fullname}
          />
          <TextSlot
            label="Nombre corto"
            value={group.name}
          />
          <MultiChipSlot
            label="Categorias"
            values={group.group_categories}
          />
        </>
      )}
    </BasicCard>
  )
}
