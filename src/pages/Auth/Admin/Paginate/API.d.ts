declare namespace APIAuthAdmins {
  export type Data = {
    id?: number;
    username?: string;
    nickname?: string;
    signature?: string;
    is_enable?: number;
    roles?: { id: number; name: string }[];
    created_at?: string | moment.Moment;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  }

  export type Visible = {
    editor?: boolean;
  }
}