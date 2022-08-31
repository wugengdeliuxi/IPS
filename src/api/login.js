import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api_v3/app/site/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/api_v3/app/site/logout',
    method: 'post'
  })
}

export function loginByToken({ params }) {
  return request({
    url: '/api_v3/app/site/login-by-token',
    method: 'get',
    params
  })
}

