declare namespace APIBlog {

  type Category = {
    id?: number;
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
    page?: any;
  }

}
