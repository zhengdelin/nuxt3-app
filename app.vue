<template>
  <NuxtLayout>
    <Loading v-if="isLoading"></Loading>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
  <ModalContainer />
</template>
<script setup lang="ts">
import { useLoading } from "./composables/useLoading";
import ModalContainer from "~~/composables/useModal/ModalContainer.vue";

const { isLoading } = useLoading(true);
</script>
