import React from 'react'

import {getPopulatedCave, PopulatedCave} from '@/database/services/cave.actions'

import BasicCard from '@/components/_Atoms/boxes/basic-card'
import CardTitle from '@/components/_Atoms/boxes/card-title'
import FetchingErrorButton from '@/components/_Atoms/buttons/fetching-error-button'
import {ExplorationSlot} from '@/components/_Atoms/slots/documents-slots'

import {MdOutlineExplore} from 'react-icons/md'

export default async function ExplorationsCards({caveId}: {caveId: string}) {
  // Obtener la cavidad
  const cave = (await getPopulatedCave(caveId)).content as PopulatedCave | null

  return (
    <BasicCard
      key="explorations_card"
      cardHeader={
        <CardTitle
          title={'Ultimas exploraciones'}
          icon={<MdOutlineExplore />}
        />
      }
    >
      {!cave ? (
        <FetchingErrorButton />
      ) : (
        <>
          {cave.explorations.reverse().map((exploration) => (
            <ExplorationSlot
              key={exploration._id}
              exploration={exploration}
            />
          ))}
        </>
      )}
    </BasicCard>
  )
}
