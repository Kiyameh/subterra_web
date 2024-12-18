import React from 'react'
import BasicCard from '@/components/_Atoms/boxes/basic-card'
import {LinkSlot} from '../../_Atoms/slots/link-slots'
import {TextSlot} from '../../_Atoms/slots/text-slots'
import CardTitle from '@/components/_Atoms/boxes/card-title'
import {MdAlternateEmail} from 'react-icons/md'

interface ContactCardProps {
  street?: string
  portal_number?: string
  floor?: string
  door?: string
  postal_code?: number
  city?: string
  province?: string
  country?: string
  phone?: string
  email?: string
  webpage?: string
}

export default function ContactCard({
  street,
  portal_number,
  floor,
  door,
  postal_code,
  city,
  province,
  country,
  phone,
  email,
  webpage,
}: ContactCardProps) {
  const address = [street, portal_number, floor, door]
    .filter(Boolean)
    .join(', ')

  return (
    <BasicCard
      key="contact_card"
      cardHeader={
        <CardTitle
          title="Información de contacto"
          icon={<MdAlternateEmail />}
        />
      }
    >
      <TextSlot
        label="Dirección"
        value={address}
      />
      <TextSlot
        label="Código postal"
        value={postal_code}
      />
      <TextSlot
        label="Ciudad"
        value={city}
      />
      <TextSlot
        label="Provincia"
        value={province}
      />
      <TextSlot
        label="País"
        value={country}
      />
      <LinkSlot
        label="Teléfono"
        type="phone"
        value={phone}
      />
      <LinkSlot
        label="Email"
        type="email"
        value={email}
      />
      <LinkSlot
        label="Web"
        type="external"
        value={webpage}
      />
    </BasicCard>
  )
}
