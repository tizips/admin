import { request } from 'umi';

export async function doPermissionBySelf() {
  return request<APIResponse.Response<any>>('/api/admin/permission/self');
}

export async function doCreate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/role', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: number, params?: any) {
  return request<APIResponse.Response<any>>(`/api/admin/roles/${id}`, {
    method: 'PUT',
    data: params,
  });
}

