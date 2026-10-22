<template>
  <Transition 
    :name="name" 
    :mode="mode"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
  >
    <slot />
  </Transition>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    default: 'page-fade'
  },
  mode: {
    type: String,
    default: 'out-in'
  }
})

const emit = defineEmits(['before-enter', 'enter', 'leave'])

function onBeforeEnter(el) {
  emit('before-enter', el)
}

function onEnter(el, done) {
  emit('enter', el, done)
  done()
}

function onLeave(el, done) {
  emit('leave', el, done)
  done()
}
</script>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
