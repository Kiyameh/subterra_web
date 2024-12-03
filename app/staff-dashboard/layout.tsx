import {auth} from '@/auth'
import PageContainer from '@/components/containing/page-container'
import NotFoundCard from '@/components/displaying/404-not-found'
import {PlatformObject} from '@/database/models/Platform.model'
import {getOnePlatform} from '@/database/services/platform.services'

export default async function Layout({children}: {children: React.ReactNode}) {
  let isStaff = false
  const subterra = (await getOnePlatform('subterra'))
    .content as PlatformObject | null
  const session = await auth()
  const userId = session?.user._id

  if (subterra && userId) {
    isStaff = subterra.staff.includes(userId)
  }

  if (!isStaff) {
    return (
      <PageContainer>
        <NotFoundCard />
      </PageContainer>
    )
  }

  return <>{children}</>
}