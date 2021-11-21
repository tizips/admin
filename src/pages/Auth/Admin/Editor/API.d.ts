declare namespace APIAuthAdmin {
  export type Props = {
    visible?: boolean;
    params?: APIAuthAdmins.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  }

  export type Editor = {
    username?: string;
    nickname?: string;
    password?: string;
    signature?: string;
    roles?: number[];
  }

  export type Former = {
    username?: string;
    nickname?: string;
    password?: string;
    signature?: string;
    roles?: number[];
  }

  export type Role = {
    id: number;
    name?: string;
  }

  export type Loading = {
    confirmed?: boolean;
    permission?: boolean;
  }
}