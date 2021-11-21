import { request } from 'umi';

export async function doRoleBySelf() {
  return request<APIResponse.Response<any>>('/api/admin/role/self');
}

export async function doCreate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/admin', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: number, params?: any) {
  return request<APIResponse.Response<any>>(`/api/admin/admins/${id}`, {
    method: 'PUT',
    data: params,
  });
}

