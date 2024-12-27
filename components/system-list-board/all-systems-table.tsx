'use client'
import React from 'react'
import Link from 'next/link'

import {SystemIndex} from '@/database/services/system.actions'

import {ColumnDef} from '@tanstack/react-table'
import {DataTable} from '@/components/ui/data-table'
import {DataTableColumnHeader} from '@/components/ui/data-table-column-header'

import {Button} from '@/components/ui/button'
import DistanceBadge from '@/components/_Atoms/badges/distance-badge'
import BasicCard from '@/components/_Atoms/boxes/basic-card'
import CardTitle from '@/components/_Atoms/boxes/card-title'
import BooleanBadge from '@/components/_Atoms/badges/boolean-badge'
import RefBadge from '@/components/_Atoms/badges/ref-badge'

import {PiCirclesThreeBold} from 'react-icons/pi'
import {TbEditCircle} from 'react-icons/tb'
import {FaMagnifyingGlass} from 'react-icons/fa6'

/**
 * @version 1
 * @description Muestra una tabla con todos los sistemas de una instancia
 * @param systemIndex Lista de sistemas
 * @param instanceName Nombre de la instancia
 * @param isEditor Si el usuario es editor
 */

export default function AllSystemTable({
  systemIndex,
  instanceName,
  isEditor,
}: {
  systemIndex: SystemIndex[]
  instanceName: string
  isEditor: boolean
}) {
  const columns: ColumnDef<SystemIndex>[] = [
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
      accessorKey: 'catalog',
      header: ({column}) => (
        <DataTableColumnHeader
          column={column}
          title="Catálogo"
        />
      ),
    },
    {
      accessorKey: 'initials',
      header: ({column}) => (
        <DataTableColumnHeader
          column={column}
          title="Siglas"
        />
      ),
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
      accessorKey: 'length',
      header: ({column}) => (
        <DataTableColumnHeader
          column={column}
          title="Desarrollo"
        />
      ),
      cell: ({row}) => {
        return <DistanceBadge valueInMeters={row.original.length} />
      },
    },
    {
      accessorKey: 'depth',
      header: ({column}) => (
        <DataTableColumnHeader
          column={column}
          title="Profundidad"
        />
      ),
      cell: ({row}) => {
        return <DistanceBadge valueInMeters={row.original.depth} />
      },
    },
    {
      accessorKey: 'regulations',
      header: ({column}) => (
        <DataTableColumnHeader
          column={column}
          title="Regulaciones"
        />
      ),
      cell: ({row}) => {
        return (
          <BooleanBadge
            invertedColor
            value={row.original.regulations}
          />
        )
      },
    },
    {
      accessorKey: 'massif',
      header: ({column}) => (
        <DataTableColumnHeader
          column={column}
          title="Macizo"
        />
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Acciones',
      cell: ({row}) => {
        return (
          <div className="flex gap-2">
            <Link
              href={`/instance/${instanceName}/systems/${row.original._id}`}
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
                href={`/instance/${instanceName}/systems/${row.original._id}/edit`}
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
          title={`Sistemas de ${instanceName}`}
          icon={<PiCirclesThreeBold />}
        />
      }
    >
      <DataTable
        columns={columns}
        data={systemIndex}
      />
    </BasicCard>
  )
}
