declare namespace APISiteCategory {
  export type Props = {
    visible?: boolean;
    params?: APISiteCategories.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  }

  export type Editor = {
    parent?: number;
    name?: string;
    picture?: string;
    title?: string;
    keyword?: string;
    description?: string;
    uri?: string;
    no?: number;
    is_page?: number;
    is_comment?: number;
    is_enable?: number;
    page?: string;
  }

  export type Former = {
    parent?: number;
    name?: string;
    picture?: string[];
    title?: string;
    keyword?: string;
    description?: string;
    uri?: string;
    no?: number;
    is_page?: number;
    is_comment?: number;
    is_enable?: number;
    page?: any;
  }

  type Information = {
    id?: number;
    parent?: number;
    name?: string;
    picture?: string;
    title?: string;
    keyword?: string;
    description?: string;
    uri?: string;
    no?: number;
    is_page?: number;
    is_comment?: number;
    is_enable?: number;
    page?: any;
  }

  export type Category = {
    id: number;
    name?: string;
  }

  export type Loading = {
    confirmed?: boolean;
    parents?: boolean;
    upload?: boolean;
    information?: boolean;
  }

  type Validators = {
    picture?: API.Validator;
  }
}