import {request} from "umi";

export async function doBlogCategoryByParents() {
  return request<APIResponse.Response<any>>('/api/admin/blog/category/parents');
}

export async function doBlogCategoryByInformation(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/blog/categories/${id}`);
}
