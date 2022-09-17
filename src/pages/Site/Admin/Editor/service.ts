import { request } from 'umi';

export async function doCreate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/site/admin', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: number, params?: any) {
  return request<APIResponse.Response<any>>(`/api/admin/site/admins/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function doRoleByOnline() {
  return request<APIResponse.Response<any>>('/api/admin/site/role/online');
}