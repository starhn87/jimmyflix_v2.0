export const getDailyRotationIndex = (itemCount: number, cadenceDays = 1) => {
  if (itemCount <= 0) return 0
  const day = Math.floor(Date.now() / 86_400_000)
  return Math.floor(day / cadenceDays) % itemCount
}

export const getRotatingSpotlight = <T,>(items: T[], cadenceDays = 1) =>
  items[getDailyRotationIndex(items.length, cadenceDays)]
