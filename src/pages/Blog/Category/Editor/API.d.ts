declare namespace APIBlogCategory {

  type Props = {
    visible?: boolean;
    params?: APISiteCategories.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  }

  type Editor = {
    parent?: number;
    name?: string;
    picture?: string;
    title?: string;
    keyword?: string;
    description?: string;
    uri?: string;
    order?: number;
    is_page?: number;
    is_comment?: number;
    is_enable?: number;
    page?: string;
  }

  type Former = {
    parent?: number;
    name?: string;
    pictures?: any[];
    title?: string;
    keyword?: string;
    description?: string;
    uri?: string;
    order?: number;
    is_page?: number;
    is_comment?: number;
    is_enable?: number;
    page?: any;
  }

  type Loading = {
    confirmed?: boolean;
    parents?: boolean;
    upload?: boolean;
    information?: boolean;
  }

}
