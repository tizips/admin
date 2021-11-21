import { request } from 'umi';

export async function doApis(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/apis', { params });
}

export async function doParents() {
  return request<APIResponse.Response<any>>('/api/admin/permission/parents');
}

export async function doCreate(params?: any) {
  return request<APIResponse.Response<any>>('/api/admin/permission', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: number, params?: any) {
  return request<APIResponse.Response<any>>(`/api/admin/permissions/${id}`, {
    method: 'PUT',
    data: params,
  });
}

