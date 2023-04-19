<template>
  <template v-for="modalContainer in items" :key="modalContainer.id">
    <teleport to="body">
      <div :id="`modal${modalContainer.id}`">
        <component :is="modalContainer.modal" v-bind="modalContainer.props"></component>
      </div>
    </teleport>
  </template>
</template>
<script setup lang="ts">
import ModalContainer from "~~/composables/useModal/modal-container";
const items = computed(() => ModalContainer.items);
</script>
<style scoped lang="scss"></style>
