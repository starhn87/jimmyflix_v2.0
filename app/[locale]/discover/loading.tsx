export default function DiscoverLoading() {
  return (
    <main className="mx-auto min-h-[70vh] max-w-[1600px] animate-pulse px-4 pt-10 pb-20 motion-reduce:animate-none sm:px-6 sm:pt-14 lg:px-10">
      <div className="h-3 w-32 rounded bg-tone/7" />
      <div className="mt-5 h-11 max-w-2xl rounded-xl bg-tone/7" />
      <div className="mt-4 h-5 max-w-xl rounded bg-tone/5" />
      <div className="mt-8 h-52 rounded-3xl bg-tone/5 sm:h-36" />
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => <div key={index} className="aspect-2/3 rounded-xl bg-tone/7" />)}
      </div>
    </main>
  )
}
