import { Ref } from "vue";

export interface IModal {
  id: number;
  modal: any;
  modelValue: Ref<boolean>;
  props: any;
}
// let autoIncrementId = 0;
const modalContainers = reactive<IModal[]>([]);

const autoIncrementId = {
  id: 1,
  get nextId() {
    return ++this.id;
  },
};

export default class ModalContainer {
  static get items() {
    return modalContainers;
  }

  static addModal(modal: Omit<IModal, "id">) {
    const id = autoIncrementId.nextId;
    modalContainers.push(Object.assign({}, modal as any, { id }));
    return id;
  }

  static removeModal(id: number) {
    // console.log('id :>> ', id);
    // console.log('modalContainers :>> ', modalContainers);
    // modalContainers = modalContainers.filter((i) => (i.id = id));
    const modalId = modalContainers.findIndex((i) => i.id === id);
    if (modalId === -1) return;
    modalContainers.splice(modalId, 1);
  }
}
