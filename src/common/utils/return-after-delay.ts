export function returnAfterDelay<T>(value: T, delay: number = 10): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value)
    }, delay)
  })
}
