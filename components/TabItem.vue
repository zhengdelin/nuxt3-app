<template>
  <div :class="['tab-item', { 'is-active': value === modelV }]" @click="onClick">
    <span class="title">{{ title }}</span>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { WritableComputedRef } from "vue";

interface TabItem {
  value: any;
  title: string;
}

const props = defineProps<TabItem>();

const modelV = inject<WritableComputedRef<any>>(
  "modelValue",
  computed({
    get() {},
    set() {},
  }),
);

function onClick() {
  modelV.value = props.value;
}
</script>
<style scoped lang="scss">
.tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
}

.tabs-default {
  .tab-item {
    padding: 12px 16px;
    border-bottom: 1px solid #e9e9e9;
    flex: 1;
    height: 100%;

    .title {
      font-size: 14px;
      line-height: 22px;
      font-weight: 600;
      color: #7c7c7c;
    }

    &.is-active {
      border-bottom: 2px solid black;
      .title {
        @extend %agent-text-black;
      }
    }
  }
}

.tabs-inner-bordered {
  .tab-item {
    color: #7c7c7c;
    padding: 4px 12px;
    border: 1px solid #a7a7a7;
    border-radius: 999px;

    .title {
      font-size: 14px;
      line-height: 24px;
      font-weight: 400;
      letter-spacing: 0.02em;
    }

    &.is-active {
      border: 1px solid black;
      color: black;
    }
  }
}
</style>
