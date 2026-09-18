import { MEDIA_RAIL_ITEM_CLASS_NAME, MEDIA_RAIL_SKELETON_LIST_CLASS_NAME } from '@/components/media-rail-styles'

export function MediaRailSkeletonCards({ itemCount = 40 }: { itemCount?: number }) {
  return (
    <ul aria-hidden="true" className={MEDIA_RAIL_SKELETON_LIST_CLASS_NAME}>
      {Array.from({ length: itemCount }, (_, index) => (
        <li key={index} className={MEDIA_RAIL_ITEM_CLASS_NAME}>
          <div className="aspect-2/3 w-full rounded-xl bg-tone/7" />
          <div className="mt-3 min-h-15">
            <div className="h-4 w-4/5 rounded-md bg-tone/7" />
            <div className="mt-1 h-4 w-2/5 rounded-md bg-tone/7" />
          </div>
        </li>
      ))}
    </ul>
  )
}
