export default function ComprasLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="h-10 w-64 animate-pulse rounded bg-gray-200" />

      <div className="mt-4 h-5 w-80 max-w-full animate-pulse rounded bg-gray-100" />

      <div className="mt-10 space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between gap-4">
              <div className="space-y-3">
                <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-48 animate-pulse rounded bg-gray-100" />
              </div>

              <div className="h-7 w-24 animate-pulse rounded-full bg-gray-200" />
            </div>

            <div className="mt-6 flex justify-between border-t border-gray-100 pt-5">
              <div className="h-8 w-28 animate-pulse rounded bg-gray-200" />
              <div className="h-10 w-28 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
