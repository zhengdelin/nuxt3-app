<template>
  <NuxtLayout>
    <Loading v-if="isLoading"></Loading>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { useLoading } from "./compositions/useLoading";

const { isLoading } = useLoading(true);
</script>
