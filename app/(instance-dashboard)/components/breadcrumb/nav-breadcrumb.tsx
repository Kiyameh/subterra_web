'use client'
import {usePathname} from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default function NavigationBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter((part) => part)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((part, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/')

          return (
            <div
              key={index}
              className="flex items-center space-x-2"
            >
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link href={href}>{part}</Link>
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
