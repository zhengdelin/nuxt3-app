<template>
  <div :class="['tabs', { [`tabs-${type}`]: !!type, 'is-sticky': sticky, 'sticky-to-header': sticky && stickyToHeader }]" :style="tabContainerStyle">
    <slot>
      <AgentTabItem v-for="item in items" :key="item[itemValueKey]" :value="item[itemValueKey]" :title="item[itemTitleKey]"></AgentTabItem>
    </slot>
  </div>
  <div v-if="isAnyPageSlotPassed" class="tab-content">
    <template v-for="tab in items" :key="tab[itemValueKey]">
      <template v-if="isPageSlotPassed(tab)">
        <div v-if="useVShow || isPageActive(tab)" v-show="isPageActive(tab)">
          <slot :name="`page.${tab[itemValueKey]}`"></slot>
        </div>
      </template>
    </template>
  </div>
</template>
<script setup lang="ts">
import { useVModel } from "~~/composables/useVModel";
type Tab = any;
interface Tabs {
  items?: Tab[];
  /**
   * @default value
   */
  itemValueKey?: string;
  /**
   * @default title
   */
  itemTitleKey?: string;
  modelValue?: any;
  /**
   * 預設active的tab，當modelValue有傳值時將會無效
   * @default default
   */
  defaultItem?: string;
  tabContainerStyle?: any;

  type?: "default" | "inner-bordered";
  sticky?: boolean;
  stickyToHeader?: boolean;

  /**
   * 開啟路由選項
   */
  router?: boolean;
  routerQueryKey?: string;

  useVShow?: boolean;
}

const props = withDefaults(defineProps<Tabs>(), {
  itemValueKey: "value",
  itemTitleKey: "title",
  type: "default",
  modelValue: undefined,
  defaultItem: "default",
  router: false,
  routerQueryKey: "tab",
  sticky: false,
  stickyToHeader: true,
  useVShow: false,
});
const emit = defineEmits(["update:modelValue"]);
const slots = useSlots();

const isPageSlotPassed = computed(() => (tab: any) => !!slots[`page.${tab[props.itemValueKey]}`]);
const isAnyPageSlotPassed = computed(() => !!props.items?.some((tab) => isPageSlotPassed.value(tab)));

const isRouter = computed(() => props.router);
const router = useRouter();
const curRouteQuery = computed(() => router.currentRoute.value.query);
const curRouteQueryTab = computed(() => curRouteQuery.value[props.routerQueryKey] as string | undefined);

function changeTabRoute(v: string) {
  if (isRouter.value && v !== curRouteQueryTab.value) {
    router.push({ query: extendCurrentRouteQuery({ [props.routerQueryKey]: v }) });
  }
}

const { modelV } = (() => {
  if (props.modelValue !== undefined) {
    return {
      modelV: useVModel({
        props,
        emit,
        setter(v) {
          emit("update:modelValue", v);
          changeTabRoute(v);
        },
      }),
    };
  }
  return {
    modelV: ref(props.defaultItem),
  };
})();
provide("modelValue", modelV);

if (isRouter.value) {
  watch(modelV, (v) => {
    if (v) {
      changeTabRoute(v);
    }
  });
  watchEffect(() => {
    if (curRouteQueryTab.value) {
      modelV.value = curRouteQueryTab.value;
    }
  });
}

function isPageActive(tab: Tab) {
  return modelV.value === tab[props.itemValueKey];
}
</script>
<style scoped lang="scss">
.tabs {
  background-color: white;
  &,
  & + .tab-content {
    --tab-height: 48px;
  }
  height: var(--tab-height);
  display: flex;
  align-items: center;
  overflow: auto;
  white-space: nowrap;

  &.is-sticky {
    position: sticky;
    top: 0;
    &.sticky-to-header {
      top: var(--header-height);
    }
    left: 0;
    z-index: 2;
  }

  &.tabs-inner-bordered {
    &,
    & + .tab-content {
      --tab-height: 68px;
    }
    gap: 8px;
    padding: 12px 16px;
  }
}
</style>
