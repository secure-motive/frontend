import { SearchIcon } from './AdminIcons'
import { CloseIcon } from '@/components/common/icons'
import { cn } from '@/utils/helpers'

interface AdminSearchInputProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  className?: string
  id?: string
}

export function AdminSearchInput({
  value,
  onChange,
  placeholder = 'Search records...',
  className,
  id = 'admin-search',
}: AdminSearchInputProps) {
  return (
    <div className={cn('relative flex-1 min-w-[240px]', className)}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-cyber-muted" />
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-[#141414] py-2.5 pr-10 pl-10 font-body text-xs text-cyber-value placeholder:text-cyber-muted/60 transition-colors focus:border-cyber-teal/60 focus:bg-[#181818] focus:ring-1 focus:ring-cyber-teal/30 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-1/2 right-3 -translate-y-1/2 p-0.5 text-cyber-muted hover:text-white transition-colors"
          title="Clear search"
          aria-label="Clear search"
        >
          <CloseIcon className="size-3.5" />
        </button>
      )}
    </div>
  )
}
