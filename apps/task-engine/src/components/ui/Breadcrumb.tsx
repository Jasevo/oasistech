import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={index} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-oasis-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-gray-900 font-medium' : ''}>{item.label}</span>
            )}
            {!isLast && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </span>
        )
      })}
    </nav>
  )
}
