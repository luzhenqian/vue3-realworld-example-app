import { onMounted, onUnmounted } from "vue";

export function useEventListener<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  event: K,
  callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
) {
  onMounted(() => target.addEventListener(event, callback));
  onUnmounted(() => target.removeEventListener(event, callback));
}
