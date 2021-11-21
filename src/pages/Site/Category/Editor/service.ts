import { request } from 'umi';

export async function doParents() {
  return request<APIResponse.Response<any>>('/api/admin/category/parents');
}

export async function doInformation(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/categories/${id}`);
}

export async function doCreate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/category', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: number, params?: any) {
  return request<APIResponse.Response<any>>(`/api/admin/categories/${id}`, {
    method: 'PUT',
    data: params,
  });
}

