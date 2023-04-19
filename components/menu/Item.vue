<template>
  <div class="menu-item">
    <div :class="['menu-item__item', { 'is-active': isActive }]" @click="onClick">
      <span class="menu-item__title">{{ item.title }}</span>
      <template v-if="isSubMenu">
        <AgentIconMinus v-show="isMenuOpen" class="text-dark-grey"></AgentIconMinus>
        <AgentIconPlus v-show="!isMenuOpen" class="text-dark-grey"></AgentIconPlus>
      </template>
    </div>
    <Transition @before-enter="onBeforeOpen" @enter="onOpening" @leave="onBeforeOpen">
      <div v-show="isMenuOpen" v-if="isSubMenu || $slots.children" class="menu-item__children">
        <slot name="children">
          <MenuItem v-for="child in item.children" :key="child.key" :item="child"></MenuItem>
        </slot>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { MenuProvide, MenuItem as TMenuItem } from "./index";

const props = defineProps<{ item: TMenuItem }>();
const key = computed(() => props.item.key);
const { modelValue, isOpen, toggle } = inject<MenuProvide>("menu", {
  modelValue: computed({
    get() {},
    set() {},
  }),
  isOpen: () => false,
  toggle: () => {},
  open: () => {},
  close: () => {},
});

function setModalValue() {
  modelValue.value = props.item.key;
}

const isSubMenu = computed(() => !!props.item.children?.length);
const isMenuOpen = computed(() => isSubMenu.value && isOpen(key.value));

const isActive = computed(() => modelValue.value === props.item.key);
const menuItemRoute = computed(() => props.item.route);
// const menuItemRoutePath = computed(() => {
//   const route = menuItemRoute.value;
//   if (!route) return "";

//   if (typeof route === "string") return route;
// });
const router = useRouter();
const isRouteActive = computed(() => {
  const route = menuItemRoute.value;
  const currentRoute = router.currentRoute.value;
  if (!route) return false;

  const compareRoutes = [];
  if (typeof route === "string") {
    compareRoutes.push(() => currentRoute.fullPath === route);
  } else {
    if ("name" in route) {
      compareRoutes.push(() => currentRoute.name === route.name);
    }
    if ("path" in route) {
      compareRoutes.push(() => currentRoute.path === route.path);
    }
    if ("query" in route) {
      compareRoutes.push(() => Object.isEqual(currentRoute.query, route.query));
    }
    if ("params" in route) {
      compareRoutes.push(() => Object.isEqual(currentRoute.params, route.params));
    }
  }
  return compareRoutes.every((fn) => fn());
});

if (menuItemRoute.value) {
  watchEffect(() => {
    if (isRouteActive.value) {
      setModalValue();
    }
  });

  //   watch(router.currentRoute, () => {
  //     console.log("v :>> ", isRouteActive.value, props.item);
  //   });
}

function onClick() {
  if (isSubMenu.value) {
    toggle(key.value);
  } else {
    setModalValue();
    if (menuItemRoute.value) router.push(menuItemRoute.value);
  }
}

/**
 * 打開之前
 * @param el
 */
function onBeforeOpen(el: any) {
  el.style.height = 0;
}

/**
 * 打開了、打開中
 * @param el
 */
function onOpening(el: any) {
  el.style.transition = ".5s";
  el.style.overflow = "hidden";

  // 為了取得高度，獲取高度後再變回0
  el.style.height = "auto";
  const h = el.clientHeight;
  el.style.height = 0;

  // 在瀏覽器下一渲染幀前修改動畫
  requestAnimationFrame(() => {
    el.style.height = h + "px";
  });
}
</script>
<style scoped lang="scss">
.menu-item {
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 40px 14px;
    border-bottom: 1px solid #f1f1f1;
    cursor: pointer;

    &:hover,
    &.is-active {
      @extend %agent-bg-background;
    }
  }

  &__title {
    font-size: 14px;
    line-height: 22px;
    font-weight: 600;
  }

  &__children {
  }
  &__children & &__item {
    padding: 12px 40px;
    border-bottom: 0;
  }
  &__children & &__item &__title {
    color: #505050;
    font-size: 14px;
    line-height: 24px;
    font-weight: 400;
    letter-spacing: 0.02em;
  }
  &__item.is-active &__title,
  &__children & &__item.is-active &__title {
    color: black;
  }
}
</style>
