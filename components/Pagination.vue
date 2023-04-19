<template>
  <div class="pagination">
    <button class="pagination__btn-prev" :disabled="isInFirstPage" @click="toPreviousPage">
      <IconAngleLeft :size="20"></IconAngleLeft>
    </button>
    <div class="pagination__btn-groups">
      <template v-for="index in total" :key="index">
        <button v-if="isEllipsisPage(index)" class="pagination__btn">
          <IconEllipsis></IconEllipsis>
        </button>
        <button v-else :class="['pagination__btn', { 'is-active': modelValue === index, 'is-hidden': isHidden(index) }]" @click="modelV = index">
          {{ index }}
        </button>
      </template>
    </div>
    <button class="pagination__btn-next" :disabled="isInLastPage" @click="toNextPage">
      <IconAngleRight :size="20"></IconAngleRight>
    </button>
  </div>
</template>
<script setup lang="ts">
import { useVModel } from "~~/composables/useVModel";
interface Pagination {
  modelValue: number;
  total: number;
  visibleCount?: number;
  size?: string;
}

const props = withDefaults(defineProps<Pagination>(), {
  visibleCount: 3,
  size: "36px",
});
const emit = defineEmits(["update:modelValue"]);

const modelV = useVModel({ props, emit, propName: "modelValue" });

const isInFirstPage = computed(() => modelV.value === 1);
const isInLastPage = computed(() => modelV.value === props.total);
function toNextPage() {
  if (modelV.value !== props.total) modelV.value++;
}

function toPreviousPage() {
  if (modelV.value !== 1) modelV.value--;
}

const needToHide = computed(() => props.total > props.visibleCount);
const minMaxShow = computed(() => {
  const { total, visibleCount } = props;
  if (!needToHide.value) {
    return {
      min: 1,
      max: total,
    };
  }

  let { min, max } = (() => {
    const isVisibleCountOdd = visibleCount % 2 !== 0; // 奇數
    if (isVisibleCountOdd) {
      const halfOfVisibleCount = Math.floor(visibleCount / 2);
      /**
       * @example visibleCount = 3
       * halfOfVisibleCount = 1, modelV = 2
       * min ~ max = 1(2-1) ~ 3(2+1)
       */
      return {
        min: modelV.value - halfOfVisibleCount,
        max: modelV.value + halfOfVisibleCount,
      };
    }

    /**
     * 偶數情況 右邊加兩位，左邊減一位
     * @example visibleCount = 4
     * modelV = 2
     * min ~ max = 1(2-1) ~ 4(2+2)
     */
    return {
      min: modelV.value - visibleCount / 2 - 1,
      max: modelV.value + visibleCount / 2,
    };
  })();
  // min超出左邊界了，所以將min和max都往後平移超出的距離
  if (min < 1) {
    max += 1 - min;
    min = 1;
  }

  // max超出右邊界了，所以將min和max都往前平移超出的距離
  if (max > total) {
    min -= max - total;
    max = total;
  }

  return { min, max };
});

const curPageMoreThanHalf = computed(() => {
  return modelV.value > props.total / 2;
});

const ellipsisPageIndex = computed(() => {
  if (!needToHide.value) return -1;
  if (curPageMoreThanHalf.value) {
    return 2;
  }
  return props.total - 1;
});

const isEllipsisPage = computed(() => (i: number) => ellipsisPageIndex.value === i);

const isHidden = computed(() => (i: number) => {
  const { min, max } = minMaxShow.value;

  // console.log("min, max, i :>> ", min, max, i);
  const isHidden = i < min || i > max;
  if (i === 1) return !curPageMoreThanHalf.value && isHidden;
  else if (i === props.total) return curPageMoreThanHalf.value && isHidden;

  return isHidden;
});
</script>
<style scoped lang="scss">
.pagination {
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0px;
  gap: 16px;

  &__btn-groups {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__btn-prev,
  &__btn-next,
  &__btn {
    width: v-bind("size");
    height: v-bind("size");
    padding: 8px;
    &:hover {
      background-color: #f7f7f7;
      cursor: pointer;
    }
  }

  &__btn-prev,
  &__btn-next {
    &:disabled {
      color: #a7a7a7;
    }
    border-radius: 999px;
  }

  &__btn {
    border-radius: 12px;
    line-height: 20px;
    color: #505050;
    font-size: 18px;
    line-height: 28px;
    font-weight: 600;
    &.is-active {
      background-color: #876651;
      color: white;
    }

    &.is-hidden {
      display: none;
    }
  }
}
</style>
