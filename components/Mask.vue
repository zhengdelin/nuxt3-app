<template>
  <div v-show="show" :class="['mask', position]">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(defineProps<{ show?: boolean; position?: "fixed" | "absolute" }>(), {
  show: true,
  position: "absolute",
});

watch(
  () => props.show,
  (v) => {
    if (v) {
      addBodyOverflowHidden();
    } else {
      removeBodyOverflowHidden();
    }
  },
);

function removeBodyOverflowHidden() {
  document.body.classList.remove("overflow-hidden");
}
function addBodyOverflowHidden() {
  document.body.classList.add("overflow-hidden");
}

onMounted(addBodyOverflowHidden);
onUnmounted(removeBodyOverflowHidden);
</script>
<style lang="scss">
.mask {
  top: 0;
  left: 0;
  background-color: adjust-color($color: #000, $alpha: -0.7);
  z-index: 2000;
  height: 100vh;
  width: 100%;
}
</style>
