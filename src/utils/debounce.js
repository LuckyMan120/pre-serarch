export default function(cb, wait) {
  let timeout

  return (...args) => {
    if (timeout) clearTimeout(timeout)

    timeout = window.setTimeout(() => {
      timeout = null
      cb(...args)
    }, wait)
  }
}
