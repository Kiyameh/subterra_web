import {auth} from '@/auth'
import BasicCard from '@/components/_Atoms/boxes/basic-card'
import CardTitle from '@/components/_Atoms/boxes/card-title'
import NotFoundCard from '@/components/cards/404-not-found'
import ExplorationEditionForm from '@/components/_document-pages/exploration-edition-board/exploration-edition-form'
import PageContainer from '@/components/theming/page-container'
import {
  getPlainExploration,
  PlainExploration,
} from '@/database/services/exploration.actions'
import {LuPlusCircle} from 'react-icons/lu'
import {CaveIndex, getCaveIndex} from '@/database/services/cave.actions'
import {getGroupsIndex, GroupIndex} from '@/database/services/group.actions'

interface PageProps {
  params: Promise<{instance: string; document: string}>
}
export default async function ExplorationEditionPage({params}: PageProps) {
  // Obtener el id del documento
  const explorationId = (await params).document
  // Obtener el nombre de la instancia
  const instanceName = (await params).instance
  // Obtener el id del usuario
  const userId = (await auth())?.user?._id

  // Obtener la cavidad
  const exploration = (await getPlainExploration(explorationId))
    .content as PlainExploration | null

  // Obtener el índice de cuevas
  const caveIndex = (await getCaveIndex(instanceName)).content as
    | CaveIndex[]
    | undefined

  // Obtener el índice de grupos
  const groupIndex = (await getGroupsIndex()).content as
    | GroupIndex[]
    | undefined

  if (!exploration) {
    return (
      <PageContainer>
        <NotFoundCard
          title="Algo ha ido mal al cargar los datos"
          text="Intentalo de nuevo más tarde"
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="justify-start">
      {userId ? (
        <BasicCard
          defaultWidth="xl"
          cardHeader={
            <CardTitle
              title={`Editar ${exploration.name}`}
              icon={<LuPlusCircle />}
            />
          }
        >
          <ExplorationEditionForm
            commanderId={userId}
            exploration={exploration}
            caveIndex={caveIndex}
            groupIndex={groupIndex}
          />
        </BasicCard>
      ) : (
        <NotFoundCard
          title="Algo ha ido mal"
          text="Ha habido un error al cargar los datos, intentalo de nuevo mas tarde"
        />
      )}
    </PageContainer>
  )
}
