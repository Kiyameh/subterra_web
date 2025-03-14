import {auth} from '@/auth'
import BasicCard from '@/components/_Atoms/boxes/basic-card'
import CardTitle from '@/components/_Atoms/boxes/card-title'
import CollapsibleBox from '@/components/_Atoms/boxes/collapsible-box'
import CaveCreationForm from '@/components/_document-pages/cave-edition-board/cave-creation-form'
import NotFoundCard from '@/components/cards/404-not-found'

import PageContainer from '@/components/theming/page-container'
import {getInstanceId} from '@/database/services/instance.actions'
import {getSystemIndex, SystemIndex} from '@/database/services/system.actions'
import {LuPlusCircle} from 'react-icons/lu'

interface PageProps {
  params: Promise<{instance: string}>
}
export default async function CaveCreationPage({params}: PageProps) {
  // Obtener el nombre de la instancia
  const instanceName = (await params).instance

  // Obtener el id de la instancia
  const instanceId = await getInstanceId(instanceName)

  // Obtener el id del usuario
  const userId = (await auth())?.user?._id

  // Obtener el indice de sistemas (para el select)
  const systemIndex = (await getSystemIndex(instanceName)).content as
    | SystemIndex[]
    | undefined

  if (!instanceId || !userId)
    return (
      <PageContainer>
        <NotFoundCard
          title="Algo ha ido mal al cargar los datos"
          text="Intentalo de nuevo mas tarde"
        />
      </PageContainer>
    )

  return (
    <PageContainer className="justify-start">
      <BasicCard
        defaultWidth="xl"
        cardHeader={
          <CardTitle
            title={`Crear cavidad en ${instanceName}`}
            icon={<LuPlusCircle />}
          />
        }
      >
        <CollapsibleBox
          title={`Cavidades`}
          color="info"
        >
          <p>
            ● Las cavidades representan una unica entrada a una cueva o sistema
            de cuevas.
          </p>
          <p>
            ● Cada cavidad puede pertenecer a un solo sistema, pero un sistema
            puede tener varias cavidades.
          </p>
          <p>
            ● Revisa los datos con atención antes de enviar el formulario. La
            cavidad se añadira a la instancia actual.
          </p>
        </CollapsibleBox>
        <CaveCreationForm
          instanceId={instanceId}
          commanderId={userId}
          systemIndex={systemIndex}
        />
      </BasicCard>
    </PageContainer>
  )
}
