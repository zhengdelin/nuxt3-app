import Modal, { BaseModalProps, UseModal } from "./modal";

/**
 * @see 如果想在SFC檔中使用useModal，props中必須包含modelValue用來控制modal的顯示
 * @example 在SFC檔中使用AgentModal => <AgentModal v-bind="$props"></AgentModal>
 *
 * @default onConfirm、onCancel、onClose三個回調函數將不會直接傳遞至Modal
 * onCancel預設在執行完畢後會自動關閉Modal
 * onConfirm、執行完畢後如果回傳值true，會自動關閉Modal，如果為Promise將會等待至Promise fulfilled並且沒有報錯後關閉Modal
 * @param params
 * @returns
 */
export function useModal<T = BaseModalProps>(params: UseModal<T>) {
  const modal = new Modal<T>(params);

  const { destroyWhenRouteChange = true } = params;
  // 避免路由切換了而modal仍然存在
  if (destroyWhenRouteChange) {
    const router = useRouter();
    watch(
      computed(() => router.currentRoute.value.path),
      () => {
        // console.log("routeChange", modal);
        modal.destroyModalImmediately();
      },
    );
  }

  return {
    show: () => modal.showModal(),
    close: () => modal.closeModal(),
    destroy: () => modal.destroyModal(),
  };
}
