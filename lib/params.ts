export type SearchParamValue = string | string[] | undefined

export const getFirstSearchParam = (value: SearchParamValue) => (
  Array.isArray(value) ? value[0] : value
)

export const parsePositiveInteger = (value: SearchParamValue) => {
  const parsed = Number(getFirstSearchParam(value))
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null
}
