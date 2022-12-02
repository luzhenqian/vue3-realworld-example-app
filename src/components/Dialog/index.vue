<template>
  <div v-if="props.open" class="dialog-bg">
    <div class="dialog-container">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  open: Boolean
})

const emits = defineEmits(['onClose'])

</script>

<style>
.dialog-bg {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(0 0 0/0.15);
  z-index: 1000;
}

.dialog-container {
  display: inline-block;
  border-radius: 12px;
  padding: 24px;
  background-color: white;
  box-shadow: 0 0 transparent, 0 0 transparent, 0 20px 25px -5px rgb(0 0 0/0.1), 0 8px 10px -6px rgb(0 0 0/0.1);
}
</style>