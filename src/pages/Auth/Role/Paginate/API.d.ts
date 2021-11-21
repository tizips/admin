declare namespace APIAuthRoles {
  export type Data = {
    id?: number;
    name?: string;
    summary?: string;
    permissions?: any[];
    created_at?: string | moment.Moment;
    loading_deleted?: boolean;
  }

  export type Visible = {
    editor?: boolean;
  }
}