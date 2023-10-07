export const removeNullProperties = (data: object) => {
  if (typeof data !== 'object') {
    return data
  }

  for (const key in data) {
    if (data[key] === null) {
      delete data[key]
    } else if (typeof data[key] === 'object') {
      removeNullProperties(data[key])
    }
  }
  return data
}
