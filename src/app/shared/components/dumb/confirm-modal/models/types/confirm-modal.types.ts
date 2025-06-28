import { CModalType } from "@shared/components/dumb/confirm-modal/models/constants/confirm-modal.constants";

export type ModalType= typeof CModalType[keyof typeof CModalType]