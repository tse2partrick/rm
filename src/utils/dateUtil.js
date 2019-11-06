export const now = () => {
  return new Date(Date.now()).toLocaleString()
}

export const formateTime = (time) => {
  return new Date(time).toLocaleString()
}