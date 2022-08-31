import request from '@/utils/request'

/**
 * xxx
 */
export function getManageBusinesss(params) {
  return request({
    url: '/api_v3/manage/businesss',
    method: 'get',
    params
  })
}
