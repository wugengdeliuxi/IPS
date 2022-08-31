import request from '@/utils/request'

// 获取角色
export function getRoles() {
  return request({
    url: '/api_v3/manage/meta/roles',
    method: 'get'
  })
}

export function getMessage(params) {
  return request({
    url: '/api_v3/manage/notifys',
    method: 'get',
    params
  })
}

/**
 * 创建消息
 * @param  {string}  type 1：阶段，2：状态，3：系统内置操作，4：操作，5：卡片，6：详情，7：打印，9：标签页，10：筛选，11：排序
 * @param  {string}  name
 */
export function createMessage(data) {
  return request({
    url: '/api_v3/manage/notifys',
    method: 'post',
    data
  })
}

/**
 * 删除字典、模型
 */
export function deleteMessage(data) {
  return request({
    url: `/api_v3/manage/notifys/${data.id}`,
    method: 'delete'
  })
}

/**
 * 启用/禁用字典、模型
 */
export function changeMessageStatus(data) {
  return request({
    url: `/api_v3/manage/notifys/${data.id}`,
    method: 'patch'
  })
}

/**
 * 查看消息
 */
export function getMessageItem(data) {
  return request({
    url: `/api_v3/manage/notifys/${data.id}`,
    method: 'get'
  })
}

/**
 * 编辑消息
 * @param {string} name 名称
 */
export function editMessage(data) {
  return request({
    url: `/api_v3/manage/notifys/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 消息配置
 */

/**
 * 消息配置列表
 */
export function getMessNotifybind(params) {
  return request({
    url: '/api_v3/manage/notify/list',
    method: 'get',
    params
  })
}

/**
 * 绑定消息操作
 */
export function createNotifybind(data) {
  return request({
    url: '/api_v3/manage/notify/bind',
    method: 'post',
    data
  })
}
