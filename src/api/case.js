import request from '@/utils/request'
/**
 * 查询字典
 * @param  {string}  type 1：阶段，2：状态，3：系统内置操作，4：操作，5：卡片，6：详情，7：打印，8: 菜单， 9：标签页，10：筛选，11：排序, 12：标签操作, 13：标签, 14消息模板, 15:消息关键字
 * @param  {string}  page
 * @param  {string}  pageSize
 */
export function getManageElements(params) {
  return request({
    url: '/api_v3/manage/elements',
    method: 'get',
    params
  })
}

/**
 * 创建字典、模板
 * @param  {string}  type 1：阶段，2：状态，3：系统内置操作，4：操作，5：卡片，6：详情，7：打印，9：标签页，10：筛选，11：排序
 * @param  {string}  name
 */
export function createManageElement(data) {
  return request({
    url: '/api_v3/manage/elements',
    method: 'post',
    data
  })
}

/**
 * 删除字典、模型
 */
export function deleteManageElement(data) {
  return request({
    url: `/api_v3/manage/elements/${data.id}`,
    method: 'delete'
  })
}

/**
 * 启用/禁用字典、模型
 */
export function changeManageElementStatus(data) {
  return request({
    url: `/api_v3/manage/elements/${data.id}`,
    method: 'patch'
  })
}

/**
 * 查看字典、模板
 */
export function getManageElementItem(data) {
  return request({
    url: `/api_v3/manage/elements/${data.id}`,
    method: 'get'
  })
}

/**
 * 编辑字典、模板
 * @param {string} name 名称
 */
export function editManageElementItem(data) {
  return request({
    url: `/api_v3/manage/elements/${data.id}`,
    method: 'put',
    data
  })
}
