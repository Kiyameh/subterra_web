import React from 'react'
import BasicCard from '@/components/_Atoms/boxes/basic-card'
import {FaUserGroup} from 'react-icons/fa6'
import GroupsBoard from '@/components/_Organisms/boards/all-groups-board'

export default function GroupsSection() {
  return (
    <section
      id="groups-section"
      className="w-full min-h-screen  p-5 flex flex-col justify-evenly items-center bg-cover bg-center bg-no-repeat bg-fixed"
      style={{backgroundImage: 'url(/stock/v9.jpg)'}}
    >
      <BasicCard
        defaultWidth="xl"
        glassmorphism
        cardHeader={
          <>
            <div className="flex gap-4">
              <FaUserGroup className="text-3xl" />
              <h2 className="text-2xl font-bold">Grupos</h2>
            </div>
            <p>
              Aquí puedes encontrar los grupos creados actualmente en Subterra.
            </p>
          </>
        }
      >
        <GroupsBoard />
      </BasicCard>
    </section>
  )
}