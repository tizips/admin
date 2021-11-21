import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/admins', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api/admin/admins/${id}`, { method: 'DELETE' });
}

export async function doEnable(data: APIRequest.Enable) {
  return request<APIResponse.Response<any>>('/api/admin/admin/enable', { method: 'PUT', data: data });
}