<template>
  <div
    :class="[
      'text-field',
      size,
      {
        'is-error': error,
      },
    ]"
  >
    <label
      :for="textFieldId"
      :class="[
        'text-field__input-control',
        {
          'is-active': isActive,
          'is-required': required,
          'is-labeled': !!label,
          'is-prepended': isPrepended,
          'is-appended': isAppended,
          'is-focus': isFocus,
          'is-always-focus': alwaysFocus,
          [`bg-${bg}`]: !!bg,
          [`border-${borderColor}`]: bordered && borderColor,
        },
      ]"
    >
      <div v-if="isPrepended" class="prepend-inner">
        <slot name="prepend-inner"></slot>
      </div>
      <div class="field">
        <span class="label" v-if="label">{{ label }}</span>
        <div class="input" tabindex="1" @focus="onFocus" @blur="onBlur">
          <slot name="input" :on-focus="onFocus" :on-blur="onBlur">
            <input
              :class="['input-original', inputClass]"
              :placeholder="placeholder"
              :type="type"
              :id="textFieldId"
              v-model="modelV"
              @click="onInputClick"
              @input="onInput"
              @change="onChange"
              @focus.stop="onFocus"
              @blur.stop="onBlur"
              :readonly="readonly"
            />
          </slot>
        </div>
      </div>
      <div v-if="clearable" class="clearable" @click="clear">
        <AgentIconXCircle :size="20"></AgentIconXCircle>
      </div>
      <div v-if="isAppended" class="append-inner" @click="onAppendInnerClick">
        <slot name="append-inner"></slot>
      </div>
    </label>
    <div class="error-messages">
      <AgentIconExclamationTriangleFill></AgentIconExclamationTriangleFill>
      <span>{{ errorMessage || "請輸入" }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { debounce } from "~~/composables/useDebounceThrottle";
type Trigger = "change" | "input";
interface InputText {
  modelValue?: any;
  label?: string;
  required?: boolean;
  type?: string;
  size?: "large" | "medium";
  placeholder?: string;

  clearable?: boolean;
  readonly?: boolean;
  focus?: boolean;
  alwaysFocus?: boolean;
  inputClass?: string;

  bg?: string;
  bordered?: boolean;
  borderColor?: string;

  trigger?: Trigger;
  debounce?: boolean;
  debounceInterval?: number;

  error?: boolean;
  errorMessage?: string;
}

const props = withDefaults(defineProps<InputText>(), {
    required: false,
    size: "large",
    bg: "white",
    bordered: true,
    borderColor: "grey",
    readonly: false,
    focus: false,
    alwaysFocus: false,
    trigger: "input",
    debounce: false,
    debounceInterval: 300,
    error: false,
    clearable: true,
  }),
  emit = defineEmits(["update:modelValue", "click:append-inner", "click:input"]);
const slots = useSlots();
const modelV = ref(props.modelValue);
//外側修改時同步資料
watch(
  () => props.modelValue,
  (v) => {
    if (v !== modelV.value) modelV.value = v;
  }
);

function emitModelValue() {
  emit("update:modelValue", modelV.value);
}

function updateModalValue(v: any) {
  modelV.value = v;
  emitModelValue();
}

function output(i: Event) {
  if (!(i as InputEvent).isComposing) emitModelValue();
}
const onChange = (() => {
  if (props.trigger === "change") return output;
})();
const onInput = (() => {
  if (props.trigger === "input") {
    if (props.debounce) return debounce(output, { immediately: false, delay: props.debounceInterval });
    return output;
  }
})();

const instance = getCurrentInstance();
const textFieldId = computed(() => `text-field__${instance?.uid}`);
const isActive = computed(() => !!modelV.value);
const isPrepended = computed(() => !!slots["prepend-inner"]);
const isAppended = computed(() => !!slots["append-inner"] || props.clearable);

const isFocus = ref(props.focus);
const alwaysFocus = ref(props.alwaysFocus);

function onFocus() {
  isFocus.value = true;
}
function onBlur() {
  isFocus.value = false;
}

function onAppendInnerClick() {
  emit("click:append-inner");
}

function onInputClick() {
  emit("click:input");
}

function clear() {
  updateModalValue("");
}

defineExpose({
  textFieldId,
  focus: onFocus,
  blur: onBlur,
  clear,
});
</script>

<style scoped lang="scss">
@use "sass:math";
.text-field {
  position: relative;
  width: 100%;

  &.large &__input-control {
    height: 52px;
  }
  &.medium &__input-control {
    height: 40px;
  }

  .error-messages {
    @extend %agent-text-error, %agent-text-p6;
    display: flex;
    gap: 4px;
    padding-top: 4px;
    height: 0;
    overflow: hidden;
    transition: height .2s;
  }

  &.is-error .error-messages{
    // display: flex;
    height: 24px
  }
  &.is-error &__input-control {
    @extend %agent-border-error;
  }

  &__input-control {
    $transition-duration: 100ms;
    $input-padding-left: 16px;
    $input-padding-right: $input-padding-left;
    $appendedPrependedPadding: $input-padding-left * 0.75;
    $input-padding-y: 5px;
    --input-padding-left: #{$input-padding-left};
    --input-padding-right: #{$input-padding-right};
    --label-height: 0px;

    display: flex;
    overflow: hidden;
    border-radius: 6px;
    // padding: 5px $input-padding-left;
    position: relative;

    &.is-labeled {
      --label-height: 18px;
      .field input::placeholder {
        opacity: 0;
      }
    }
    &.is-prepended {
      padding-left: $appendedPrependedPadding;
      --input-padding-left: #{math.div($input-padding-left, 2)};
    }

    &.is-appended {
      padding-right: $appendedPrependedPadding;
      --input-padding-right: #{math.div($input-padding-right, 2)};
    }

    .field {
      display: flex;
      flex-direction: column;
      width: 100%;
      position: relative;

      .label {
        @extend %agent-text-sec-grey, %agent-text-p5;
        font-weight: bold;
        touch-action: none;
        pointer-events: none;
        z-index: 10;
        position: absolute;
        top: calc(50% - 12px);
        margin-left: var(--input-padding-left);
        transition-property: top, font-size, line-height;
        transition-duration: $transition-duration;
        transition-timing-function: ease-out;
        white-space: nowrap;
      }

      @mixin input-style() {
        @extend %agent-text-p5;
        height: 24px;
        outline: none;
        border: none;
        width: 100%;
        background: inherit;
      }

      .input {
        display: flex;
        align-items: center;
        flex: 1;
        padding-top: calc(var(--label-height) + $input-padding-y);
        padding-bottom: $input-padding-y;
        padding-left: var(--input-padding-left);
        padding-right: var(--input-padding-right);
        background: inherit;
        cursor: text;

        :deep(.input-original) {
          &::placeholder {
            @extend %agent-text-sec-grey;
          }
          @include input-style();
        }
      }
    }

    &.is-focus {
      @extend %agent-border-black;
    }

    &.is-focus,
    &.is-always-focus,
    &.is-active {
      // padding-top: $input-padding-y + var(--label-height);

      .field {
        .label {
          top: $input-padding-y;
          font-size: 12px;
          line-height: 18px;
        }

        .input input::placeholder {
          opacity: 1;
        }
      }
    }

    &.is-required .label::after {
      @extend %agent-text-error, %agent-text-p5;
      content: "*";
      position: absolute;
      line-height: inherit;
      right: -11px;
      height: 100%;
    }

    .prepend-inner,
    .append-inner,
    .clearable {
      display: flex;
      align-items: center;
    }

    .append-inner,
    .clearable {
      cursor: pointer;
    }

    .clearable {
      @extend %agent-text-dark-grey;
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover {
      .clearable {
        opacity: 1;
      }
    }
  }
}
</style>
