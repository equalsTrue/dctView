export function isObjectValueEqual(a, b) {
  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)
  if (aProps.length !== bProps.length) {
    return false
  }
  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i]
    if (propName !== '__ob__') {
      const propA = a[propName]
      const propB = b[propName]
      if (propA !== null && propB !== null && propA !== propB) {
        if ((typeof (propA) === 'object')) {
          if (this.isObjectValueEqual(propA, propB)) {
            continue
          }
        } else if (propA !== undefined && (typeof (propA) !== 'string') && isNaN(propA) && isNaN(propB)) {
          continue
        } else {
          return false
        }
      } else if (propA === null && propB !== null) {
        return false
      } else if (propB === null && propA !== null) {
        return false
      }
    }
  }
  return true
}
