import PageContainer from '@/components/theming/page-container'
import ImageCard from '@/components/cards/image-card'
import SystemInfoCard from '@/components/_document-pages/system-details-board/system-info-card'
import SystemCavesCard from '@/components/_document-pages/system-details-board/system-caves-card'
import SystemHeader from '@/components/_document-pages/system-details-board/system-header'
import SystemDescriptionCard from '@/components/_document-pages/system-details-board/system-description-card'
import SystemScienceCard from '@/components/_document-pages/system-details-board/system-science-card'
import SkeletonHeader from '@/components/cards/skelenton-header'
import {Suspense} from 'react'
import SkeletonCard from '@/components/cards/skeleton-card'
import DocumentNotificationArea from '@/components/_document-pages/document-notification-area/document-notification-area'

interface PageProps {
  params: Promise<{document: string; instance: string}>
}

export default async function SystemDetailPage({params}: PageProps) {
  // Obtener el id del documento
  const {instance, document} = await params

  return (
    <PageContainer className="justify-start">
      <Suspense fallback={null}>
        <DocumentNotificationArea
          instanceName={instance}
          type="system"
        />
      </Suspense>

      <ImageCard />

      <Suspense fallback={<SkeletonHeader />}>
        <SystemHeader systemId={document} />
      </Suspense>

      <div className="flex gap-4 flex-wrap justify-center">
        <Suspense fallback={<SkeletonCard />}>
          <SystemInfoCard systemId={document} />
        </Suspense>

        <Suspense fallback={<SkeletonCard />}>
          <SystemDescriptionCard systemId={document} />
        </Suspense>

        <Suspense fallback={<SkeletonCard />}>
          <SystemScienceCard systemId={document} />
        </Suspense>

        <Suspense fallback={<SkeletonCard />}>
          <SystemCavesCard systemId={document} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
