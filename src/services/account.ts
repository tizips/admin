import { request } from 'umi';

export async function doAccount() {
  return request<APIResponse.Response<any>>('/api/admin/account');
}

/** 退出登录接口 POST /api/logout */
export async function doLogout() {
  return request<APIResponse.Response<any>>('/api/admin/account/logout', {
    method: 'POST',
  });
}

export async function doPermission() {
  return request<APIResponse.Response<any>>('/api/admin/account/permission');
}