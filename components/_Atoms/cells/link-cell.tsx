import Link from 'next/link'
import {MdEmail, MdPhone, MdLink, MdOpenInNew} from 'react-icons/md'

export function LinkCell({
  label,
  value,
  type,
}: {
  label?: string
  value?: string
  type?: 'email' | 'phone' | 'internal' | 'external'
}) {
  const icon =
    type === 'email' ? (
      <MdEmail />
    ) : type === 'phone' ? (
      <MdPhone />
    ) : type === 'internal' ? (
      <MdLink />
    ) : type === 'external' ? (
      <MdOpenInNew />
    ) : null

  const protocolPattern = /^(?:f|ht)tps?:\/\//i

  let href = value
  switch (type) {
    case 'email':
      href = `mailto:${value}`
      break
    case 'phone':
      href = `tel:${value}`
      break
    case 'internal':
      href = value
      break
    case 'external':
      href = value && !protocolPattern.test(value) ? `https://${value}` : value
      break
  }

  return (
    <>
      {value && (
        <Link
          href={href || ''}
          className="flex gap-2 items-center"
        >
          {label ? (
            <span className="text-sm">{label}</span>
          ) : (
            <span className="hover:text-primary text-sm">{value}</span>
          )}
          <span className="text-primary">{icon}</span>
        </Link>
      )}
    </>
  )
}
