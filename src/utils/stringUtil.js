export const firstUppercase = (str) => {
  let ret

  let [first, ...rest] = str
  ret = first.toUpperCase() + rest.join('').toLowerCase()

  return ret
}