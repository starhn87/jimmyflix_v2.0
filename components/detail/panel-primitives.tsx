

export const panelHeading = 'text-lg font-semibold tracking-tight text-ink sm:text-xl'
export const responsiveCardGrid =
  'mt-5 flex flex-wrap justify-center gap-x-4 gap-y-8 sm:gap-5 lg:justify-start'
export const centeredItem = 'w-[47%] max-w-[180px] text-center sm:w-[180px]'

export function EmptyPanel({ message }: { message: string }) {
  return (
    <p className="mt-7 rounded-2xl border border-tone/8 bg-tone/4 p-7 text-center text-sm text-subtle">
      {message}
    </p>
  )
}
