import { ref, watch } from 'vue'

/**
 * Creates a debounced ref that updates after a specified delay
 * @param {import('vue').Ref} sourceRef 
 * @param {number} delayMs 
 * @returns {import('vue').Ref}
 */
export function useDebouncedRef(sourceRef, delayMs = 350) {
  const debounced = ref(sourceRef.value)
  let timeoutId = null

  watch(sourceRef, (newValue) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      debounced.value = newValue
    }, delayMs)
  })

  return debounced
}

/**
 * Debounce function executor
 */
export function debounce(fn, delay = 350) {
  let timeoutId = null
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
