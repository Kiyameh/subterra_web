'use client'
import React from 'react'
import Link from 'next/link'

import {ExplorationIndex} from '@/database/services/exploration.actions'

import {ColumnDef} from '@tanstack/react-table'
import {DataTableColumnHeader} from '@/components/ui/data-table-column-header'
import {DataTable} from '@/components/ui/data-table'

import BasicCard from '@/components/_Atoms/boxes/basic-card'
import CardTitle from '@/components/_Atoms/boxes/card-title'
import {Button} from '@/components/ui/button'
import DateBadge from '@/components/_Atoms/badges/date-badge'
import RefBadge from '@/components/_Atoms/badges/ref-badge'
import TimeBadge from '@/components/_Atoms/badges/time-badge'

import {TbEditCircle} from 'react-icons/tb'
import {FaMagnifyingGlass} from 'react-icons/fa6'
import {FaRegCompass} from 'react-icons/fa'

/**
 * @version 1
 * @description Muestra una tabla con todas las exploraciones de una instancia
 * @param explorationsIndex Índice de exploraciones
 * @param instanceName Nombre de la instancia
 * @param isEditor Si el usuario es editor
 */
export default function AllExplorationTable({
  explorationsIndex,
  instanceName,
  isEditor,
}: {
  explorationsIndex: ExplorationIndex[]
  instanceName: string
  isEditor: boolean
}) {
  const columns: ColumnDef<ExplorationIndex>[] = [
    {
      accessorKey: 'name',
      header: ({column}) => (
        <DataTableColumnHeader
          column={column}
          title="Nombre"
        />
      ),
    },
    {
      accessorKey: 'dates',
      header: 'Fechas',
      cell: ({row}) => {
        return (
          <div className="flex flex-row flex-wrap gap-1">
            {row.original.dates?.map((date, i) => (
              <DateBadge
                key={i}
                value={date}
              />
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: 'caves',
      header: 'Cavidades',
      cell: ({row}) => {
        return (
          <div className="flex flex-row flex-wrap gap-1">
            {row.original.caves?.map((cave) => (
              <RefBadge
                key={cave._id as string}
                baseUrl={`/instance/${instanceName}/caves/`}
                value={cave as {name: string; _id: string}}
                type="cave"
              />
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: 'groups',
      header: 'Grupos',
      cell: ({row}) => {
        return (
          <div className="flex flex-row flex-wrap gap-1">
            {row.original.groups?.map((group) => (
              <RefBadge
                key={group._id as string}
                baseUrl={`/group/`}
                value={group as {name: string; _id: string}}
                type="group"
              />
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: 'cave_time',
      header: ({column}) => (
        <DataTableColumnHeader
          column={column}
          title="Tiempo en cavidad"
        />
      ),
      cell: ({row}) => {
        return <TimeBadge valueInSeconds={row.original.cave_time} />
      },
    },

    {
      accessorKey: 'actions',
      header: 'Acciones',
      cell: ({row}) => {
        return (
          <div className="flex gap-2">
            <Link
              href={`/instance/${instanceName}/explorations/${row.original._id}`}
              replace
            >
              <Button
                variant="secondary"
                size="sm"
              >
                <FaMagnifyingGlass />
                Ver detalles
              </Button>
            </Link>

            {isEditor && (
              <Link
                href={`/instance/${instanceName}/explorations/${row.original._id}/edit`}
                replace
              >
                <Button
                  variant="editor"
                  size="sm"
                >
                  <TbEditCircle />
                  Editar
                </Button>
              </Link>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <BasicCard
      className="w-full"
      cardHeader={
        <CardTitle
          title={`Últimas exploraciones de ${instanceName}`}
          icon={<FaRegCompass />}
        />
      }
    >
      <DataTable
        columns={columns}
        data={explorationsIndex}
      />
    </BasicCard>
  )
}
