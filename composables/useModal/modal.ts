import ModalContainer from "./modal-container";

export interface BaseModalProps {
  onCancel?: () => any;
  onConfirm?: () => any;
}

type AutoCloseEvent = "onCancel" | "onConfirm";

export interface UseModal<T = BaseModalProps> {
  modal: any;
  props?: T;
  slots?: any;
  /**
   * @default true
   */
  destroyWhenClose?: boolean;
  /**
   * @default true
   */
  destroyWhenRouteChange?: boolean;
  /**
   * @default 呼叫對應事件時自動關閉
   * onConfirm:false
   * onCancel:true
   */
  autoClose?: Partial<Record<AutoCloseEvent, boolean>>;
}

const INITIAL_MODAL_ID = -1;

export default class Modal<T = BaseModalProps> {
  static AnimationDuration = 300;

  modal;
  props;
  slots;
  destroyWhenClose;
  autoClose;

  vNode: VNode | null = null;
  _rendered = false;
  _destroyModalTimer: any | null = null;
  _modalId: number = INITIAL_MODAL_ID;
  isModalVisible = ref(false);
  constructor({ modal, props, slots, destroyWhenClose = true, autoClose }: UseModal<T>) {
    this.modal = modal;
    this.props = props || {};
    this.autoClose = autoClose || {};
    this._setupProps();
    this.slots = slots;
    this.destroyWhenClose = destroyWhenClose;
  }

  setModalVisible(v: boolean) {
    // console.log(v ? "openModal" : "closeModal");
    this.isModalVisible.value = v;
    // console.log("setModalVisible", v);
    // console.log("vnode.component :>> ", this.vNode);
    // this.vNode?.component && (this.vNode.component.props.modelValue = v);
    // console.log(v ? "openModal" : "closeModal", this.vnode.component.props.modelValue);
  }

  closeModal() {
    if (!this.isModalVisible.value) return;
    // console.log("close modal");
    // console.log("this. :>> ", this.modal);
    this.destroyWhenClose ? this.destroyModal() : this.setModalVisible(false);
  }

  showModal() {
    this._clearDestroyModalTimer();
    if (this._rendered) {
      this.setModalVisible(true);
    } else {
      this.vNode = this._createVNode();
      this._renderModal();
    }
  }

  destroyModalImmediately() {
    // this.container?.parentNode?.removeChild(this.container);
    // this.container = null;
    // console.log("remove modal", this._modalId);
    ModalContainer.removeModal(this._modalId);
    this._modalId = INITIAL_MODAL_ID;
    this._rendered = false;
  }

  /**
   * destroy after animation
   */
  destroyModal() {
    this.setModalVisible(false);
    this._setDestroyModalTimer();
  }

  _setupProps() {
    const { onCancel: autoCloseOnCancel = true, onConfirm: autoCloseOnConfirm = false } = this.autoClose;
    const { onConfirm: _onConfirm, onCancel: _onCancel } = this.props as BaseModalProps;

    const onConfirm = async () => {
      // console.log("onConfirm");

      const fn = _onConfirm?.();

      const closeModal = () => autoCloseOnConfirm && this.closeModal();

      // onConfirm為promise
      if (fn?.then) {
        try {
          await fn;
          closeModal();
        } catch (error) {
          console.error(error);
        }
      } else if (fn) {
        closeModal();
      } else {
        // error
      }
    };
    const onCancel = () => {
      // console.log("onCancel");
      _onCancel?.();
      autoCloseOnCancel && this.closeModal();
    };

    this.props = Object.assign({}, this.props, {
      modelValue: this.isModalVisible,
      "onUpdate:modelValue": (v: boolean) => {
        if (v) this.setModalVisible(v);
        else {
          this.closeModal();
        }
      },
      onConfirm,
      onCancel,
    });

    // console.log("this.props :>> ", this.props);
  }

  _createVNode() {
    return h(this.modal, null, this.slots);
  }

  _renderModal() {
    this.isModalVisible.value = true;
    this._modalId = ModalContainer.addModal({
      modal: this.vNode,
      modelValue: this.isModalVisible,
      props: this.props,
    });
    // console.log('this._modalId :>> ', this._modalId);
    this._rendered = true;
  }

  _setDestroyModalTimer() {
    this._destroyModalTimer = setTimeout(() => {
      this.destroyModalImmediately();
    }, 500);
  }

  _clearDestroyModalTimer() {
    if (!this._destroyModalTimer) return;
    // 馬上清除上一次的modal及定時器
    clearTimeout(this._destroyModalTimer);
    this.destroyModalImmediately();
    this._destroyModalTimer = null;
  }
}
