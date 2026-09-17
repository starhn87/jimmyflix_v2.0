import { RetryButton } from '@/components/retry-button'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'

export function DataNotice({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale).common
  return (
    <div role="status" className="mb-5 rounded-xl border border-tone/15 bg-tone/5 p-4 text-sm text-subtle">
      <p>{dictionary.partialResults}</p>
      <RetryButton label={dictionary.retry} pendingLabel={dictionary.retrying} />
    </div>
  )
}
