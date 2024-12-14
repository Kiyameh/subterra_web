import BasicCard from '@/components/_Atoms/boxes/basic-card'
import CardTitle from '@/components/_Atoms/boxes/card-title'
import React from 'react'
import {FaRegImage} from 'react-icons/fa'

interface ImageCardProps {
  src?: string
  alt?: string
}
export default function ImageCard({}: ImageCardProps) {
  return (
    <BasicCard
      cardHeader={
        <CardTitle
          title={'Imagen del grupo'}
          subtitle="Funcionalidad en desarrollo. Proximamente estará disponible"
          icon={<FaRegImage />}
        />
      }
      className="w-full"
    >
      <span></span>
    </BasicCard>
  )
}