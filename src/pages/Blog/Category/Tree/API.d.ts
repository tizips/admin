declare namespace APISiteCategories {
  export type Data = {
    id?: number;
    name?: string;
    uri?: string;
    order?: number;
    is_page?: number;
    is_comment?: number;
    is_enable?: number;
    children?: Data[];
    created_at?: string | moment.Moment;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  }

  export type Visible = {
    editor?: boolean;
  }
}
