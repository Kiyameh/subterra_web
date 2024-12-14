'use client'
import React from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {Answer} from '@/database/types/answer.type'
import {CaveFormValues} from '@/database/validation/cave.schemas'
import {CaveFormSchema} from '@/database/validation/cave.schemas'
import {createCave} from '@/database/services/cave.services'

import {Form} from '@/components/ui/form'
import SubmitButton from '@/components/_Atoms/buttons/submit-button'
import DbAwnserBox from '@/components/_Atoms/boxes/db-answer-box'
import TextField from '@/components/_Atoms/fields/text-field'
import {caveShapes, utmZones} from '@/database/models/Cave.enums'
import TextAreaField from '@/components/_Atoms/fields/text-area-field'
import BooleanField from '@/components/_Atoms/fields/boolean-field'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import MultipleSelectionField from '@/components/_Atoms/fields/multiple-selection-field'
import MultiTextField from '@/components/_Atoms/fields/multi-text-field'
import Divider from '@/components/_Atoms/boxes/divider'
import SelectionField from '@/components/_Atoms/fields/selection-field'
import InfoBox from '@/components/_Atoms/boxes/info-box'
import {BsExclamationTriangle} from 'react-icons/bs'

const EMPTY_CAVE: CaveFormValues = {
  instances: [],
  explorations: [],
  system: undefined,
  datatype: 'cave',

  catalog: '',
  initials: [],
  name: '',
  alt_names: [],
  cave_shapes: [],
  description: '',
  regulations: undefined,
  regulation_description: '',
  length: 0,
  depth: 0,

  municipality: '',
  locality: '',
  toponymy: [],
  massif: '',
  location_description: '',
  geolog_age: '',
  geolog_litology: '',
  arqueolog: '',
  paleontolog: '',
  mineralog: '',
  contamination: '',
  biolog: '',
  hidrolog_system: '',
  hidrolog_subsystem: '',

  coordinates: {
    x_coord: 0,
    y_coord: 0,
    z_coord: 0,
    coord_proyec: 'ETRS89',
    hemisphere: 'N',
    utm_zone: '30',
  },
}

/**
 * @version 1
 * @description Formulario para crear una cavidad
 * @param instanceName Nombre de la instancia
 * @param commanderId Editor que crea la cavidad
 */

export default function CaveCreationForm({
  instanceName,
  commanderId,
}: {
  instanceName: string
  commanderId: string
}) {
  const [dbAnswer, setDbAnswer] = React.useState<Answer | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<CaveFormValues>({
    resolver: zodResolver(CaveFormSchema),
    defaultValues: EMPTY_CAVE,
  })

  function onSubmit(values: CaveFormValues) {
    setDbAnswer(null)
    startTransition(async () => {
      const answer = await createCave(values, instanceName, commanderId)
      setDbAnswer(answer)
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <Accordion type="single">
          <AccordionItem
            value="item-1"
            className="border-0"
          >
            <span>Introduce los datos:</span>
            <AccordionTrigger className="bg-muted rounded-lg px-4 py-3 mt-2 hover:no-underline">
              <div className="flex items-center justify-start gap-2 text-base">
                <span className="h-8 w-8 rounded-full flex items-center justify-center border-2 border-primary text-xl font-bold">
                  1
                </span>
                <h2>Información general</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-2 py-6">
              <TextField
                control={form.control}
                name="catalog"
                label="Número de Catálogo externo"
                placeholder="CAT-123"
              />
              <MultiTextField
                control={form.control}
                name="initials"
                label="Siglas de exploración"
                placeholder="AR-01"
              />
              <TextField
                control={form.control}
                name="name"
                label="Nombre"
                placeholder="Cueva del pirata"
              />
              <MultiTextField
                control={form.control}
                name="alt_names"
                label="Nombres alternativos"
                placeholder="Torca de isla tortuga"
              />
              <MultipleSelectionField
                control={form.control}
                name="cave_shapes"
                label="Tipo de entrada"
                options={caveShapes as unknown as string[]}
              />
              <TextAreaField
                control={form.control}
                name="description"
                label="Descripción"
                placeholder="La cueva del pirata tiene un tesoro escondido..."
              />
              <BooleanField
                control={form.control}
                name="regulations"
                label="Regulaciones"
              />
              <TextAreaField
                control={form.control}
                name="regulation_description"
                label="Descripción de las regulaciones"
                placeholder="No se permite el paso de animales"
              />
              <TextField
                control={form.control}
                name="length"
                label="Longitud"
                placeholder="1242"
                type="number"
                endContent="metros"
              />
              <TextField
                control={form.control}
                name="depth"
                label="Profundidad"
                placeholder="102"
                type="number"
                endContent="metros"
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-2"
            className="border-0"
          >
            <AccordionTrigger className="bg-muted rounded-lg px-4 py-3 mt-2 hover:no-underline">
              <div className="flex items-center justify-start gap-2 text-base">
                <span className="h-8 w-8 rounded-full flex items-center justify-center border-2 border-primary text-xl font-bold">
                  2
                </span>
                <h2>Datos de localización</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-2 py-6">
              <Divider text="Coordenadas" />
              <InfoBox
                color="warning"
                title="Datum"
                icon={<BsExclamationTriangle />}
                className="mb-4"
              >
                Asegurate de intruducir las coordenadas en Datum ETRS89
              </InfoBox>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <TextField
                  control={form.control}
                  name="coordinates.x_coord"
                  label="Coordenada X"
                  placeholder=""
                  endContent="metros"
                  type="number"
                />
                <TextField
                  control={form.control}
                  name="coordinates.y_coord"
                  label="Coordenada Y"
                  placeholder=""
                  endContent="metros"
                  type="number"
                />
                <TextField
                  control={form.control}
                  name="coordinates.z_coord"
                  label="Coordenada Z"
                  placeholder=""
                  endContent="msnm"
                  type="number"
                />
                <SelectionField
                  control={form.control}
                  name="coordinates.hemisphere"
                  label="Hemisferio"
                  options={['N', 'S']}
                />
                <SelectionField
                  control={form.control}
                  name="coordinates.utm_zone"
                  label="Zona UTM"
                  options={utmZones as unknown as string[]}
                />
              </div>
              <Divider />
              <TextField
                control={form.control}
                name="municipality"
                label="Municipio"
                placeholder="Isla tortuga"
              />
              <TextField
                control={form.control}
                name="locality"
                label="Localidad"
                placeholder="Villasable"
              />
              <MultiTextField
                control={form.control}
                name="toponymy"
                label="Toponimia"
                placeholder="Mar del sur"
              />
              <TextField
                control={form.control}
                name="massif"
                label="Macizo"
                placeholder="Monte de los piratas"
              />
              <TextAreaField
                control={form.control}
                name="location_description"
                label="Descripción de la localización"
                placeholder="La cueva se encuentra en la falda del monte"
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-3"
            className="border-0"
          >
            <AccordionTrigger className="bg-muted rounded-lg px-4 py-3 mt-2 hover:no-underline">
              <div className="flex items-center justify-start gap-2 text-base">
                <span className="h-8 w-8 rounded-full flex items-center justify-center border-2 border-primary text-xl font-bold">
                  3
                </span>
                <h2>Datos científicos</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-2 py-6">
              <TextField
                control={form.control}
                name="geolog_age"
                label="Edad geológica"
                placeholder="Jurásico"
              />
              <TextAreaField
                control={form.control}
                name="geolog_litology"
                label="Litología"
                placeholder="Caliza"
              />
              <TextAreaField
                control={form.control}
                name="arqueolog"
                label="Arqueología"
                placeholder="Datos de interes arqueológicos"
              />
              <TextAreaField
                control={form.control}
                name="paleontolog"
                label="Paleontología"
                placeholder="Datos de interes paleontológicos"
              />
              <TextAreaField
                control={form.control}
                name="mineralog"
                label="Mineralogía"
                placeholder="Datos de interes mineralógicos"
              />
              <TextAreaField
                control={form.control}
                name="contamination"
                label="Contaminación"
                placeholder="Presencia de residuos humanos"
              />
              <TextAreaField
                control={form.control}
                name="biolog"
                label="Biología"
                placeholder="Datos de interes biológicos"
              />
              <TextField
                control={form.control}
                name="hidrolog_system"
                label="Cuenca hidrológica"
                placeholder="Datos hidrológicos de la cuenca"
              />
              <TextField
                control={form.control}
                name="hidrolog_subsystem"
                label="Subsistema hidrológico"
                placeholder="Datos hidrológicos locales"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="text-destructive-foreground text-sm">
          {!form.formState.isValid && form.formState.isDirty && (
            <p>Algunos datos introducidos no son correctos</p>
          )}
        </div>
        <DbAwnserBox answer={dbAnswer} />
        {dbAnswer?.ok ? (
          <p>Cavidad creadad</p>
        ) : (
          <SubmitButton
            label="Crear cavidad"
            isPending={isPending}
          />
        )}
      </form>
    </Form>
  )
}