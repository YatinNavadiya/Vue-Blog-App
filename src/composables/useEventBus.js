// src/composables/useEventBus.js
import { readonly, ref } from 'vue'

const events = ref({})

export function useEventBus() {
  const emit = (event, ...args) => {
    if (events.value[event]) {
      events.value[event].forEach(callback => callback(...args))
    }
  }

  const on = (event, callback) => {
    if (!events.value[event]) {
      events.value[event] = []
    }
    events.value[event].push(callback)
  }

  return {
    emit,
    on,
    events: readonly(events)
  }
}
