export * from './api';

export interface ConfirmDialogState {
  isOpen: boolean;
  rowId: number | null;
  isMultiple: boolean;
}
