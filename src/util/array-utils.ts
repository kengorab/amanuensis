export function updateWhere<T>(array: T[], predicate: (item: T) => boolean, patch: Partial<T>): T[] {
  const idx = array.findIndex(predicate)
  if (idx < 0) return array

  const newItem = { ...array[idx], ...patch }
  const newItems = [...array]
  newItems[idx] = newItem
  return newItems
}