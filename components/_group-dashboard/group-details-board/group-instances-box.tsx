import {
  getSomeInstances,
  InstanceWithUsers,
} from '@/database/services/instance.actions'
import React from 'react'
import InstanceCard from '../../cards/instance-card'
import {getOneGroup, GroupWithUsers} from '@/database/services/group.actions'

/**
 * @version 1
 * @description Muestra las instancias de un grupo
 * @param groupName Nombre del grupo
 */

export default async function GroupInstancesBox({
  groupName,
}: {
  groupName: string
}) {
  // Obtener el grupo
  const group = (await getOneGroup(groupName)).content as GroupWithUsers | null

  // Obtener instancias populadas del grupo
  const instances = (
    await getSomeInstances(group?.instances.map((instance) => instance._id))
  ).content as InstanceWithUsers[] | null

  return (
    <>
      {instances &&
        instances.map((instance) => {
          return (
            <InstanceCard
              glassmorphism={false}
              key={instance.name}
              instance={instance}
            />
          )
        })}
    </>
  )
}
