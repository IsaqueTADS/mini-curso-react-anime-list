interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-4">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:border-primary/60 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Anterior
      </button>

      <span className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </span>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:border-primary/60 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Próxima
      </button>
    </nav>
  )
}
