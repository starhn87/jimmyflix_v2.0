export const MEDIA_RAIL_HEADER_CLASS_NAME = 'mb-5 px-4 sm:px-8 lg:px-12'

export const MEDIA_RAIL_TRACK_CLASS_NAME = 'flex gap-3 px-4 pb-7 sm:gap-4 sm:px-8 lg:gap-5 lg:px-12'

export const MEDIA_RAIL_LIST_CLASS_NAME = `no-scrollbar snap-x snap-mandatory scroll-px-4 overflow-x-auto sm:scroll-px-8 lg:scroll-px-12 ${MEDIA_RAIL_TRACK_CLASS_NAME}`

export const MEDIA_RAIL_SKELETON_LIST_CLASS_NAME = `overflow-hidden ${MEDIA_RAIL_TRACK_CLASS_NAME}`

export const MEDIA_RAIL_ITEM_CLASS_NAME = 'w-[42vw] min-w-[136px] max-w-[190px] shrink-0 snap-start sm:w-[27vw] md:w-[20vw] lg:w-[15vw] xl:w-[13vw]'

// Each rail reserves 28px below its cards, so these margins produce visual
// card-to-heading gaps of 40px on mobile and 64px on desktop.
export const CATALOG_RAIL_STACK_CLASS_NAME = 'relative z-10 mt-6 space-y-3 pb-20 sm:-mt-8 lg:space-y-9'
