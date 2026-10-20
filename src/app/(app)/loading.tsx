export default function AppLoading() {
  return (
    <div className="container-page py-8" role="status" aria-busy="true" aria-label="Memuat halaman">
      <div className="h-4 w-36 animate-pulse rounded-sm bg-paper-deep" />
      <div className="mt-4 h-10 w-72 animate-pulse rounded-sm bg-paper-deep" />
      <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-sm bg-paper-deep" />
      <div className="mt-10 grid gap-4 lg:grid-cols-[380px_1fr]">
        <div className="space-y-3">
          <div className="h-11 w-full animate-pulse rounded-sm bg-paper-deep" />
          <div className="h-24 w-full animate-pulse rounded-sm bg-paper-deep" />
          <div className="h-24 w-full animate-pulse rounded-sm bg-paper-deep" />
          <div className="h-24 w-full animate-pulse rounded-sm bg-paper-deep" />
        </div>
        <div className="h-[420px] animate-pulse rounded-sm bg-paper-deep" />
      </div>
      <span className="sr-only">Memuat...</span>
    </div>
  );
}
