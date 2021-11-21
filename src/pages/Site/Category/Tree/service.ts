import { request } from 'umi';

export async function doTree(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/categories', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/categories/${id}`, { method: 'DELETE' });
}

export async function doEnable(data: APIRequest.Enable) {
  return request<APIResponse.Response<any>>('/api/admin/category/enable', { method: 'PUT', data: data });
}