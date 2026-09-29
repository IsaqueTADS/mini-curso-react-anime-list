export function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 15 }).map((_, index) => (
        <div
          key={index}
          className="aspect-2/3 w-full animate-pulse rounded-lg bg-muted"
        />
      ))}
    </div>
  )
}
