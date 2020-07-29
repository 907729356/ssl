import request from '@/utils/request'

export function listBrand(query) {
  return request({
    url: '/brand/list',
    method: 'get',
    params: query
  })
}
// 提交方查询
export function queryList(query) {
  return request({
    url: '/drug/application/querySave',
    method: 'get',
    params: query
  })
}
// 提交方删除
export function delRowData(data) {
  return request({
    url: '/drug/application/delete',
    method: 'post',
    data
  })
}
// 申请列表查询
export function labList(query) {
  return request({
    url: '/drug/application/queryLab',
    method: 'get',
    params: query
  })
}
// 中转站列表查询
export function stationList(query) {
  return request({
    url: '/drug/application/queryCommited',
    method: 'get',
    params: query
  })
}

// 中转方确认
export function sureStatus(data) {
  return request({
    url: '/drug/application/confirm',
    method: 'post',
    data
  })
}
// 总务处列表查询
export function departmentList(query) {
  return request({
    url: '/drug/application/queryAll',
    method: 'get',
    params: query
  })
}
// 总务处-审批
export function departmentPass(data) {
  return request({
    url: '/drug/application/pass',
    method: 'post',
    data
  })
}
// 处置分类列表
export function drugTypeList(data) {
  return request({
    url: '/drug/address/drugType',
    method: 'get',
    params: data
  })
}
// 学校列表
export function schoolList(data) {
  return request({
    url: '/drug/address/school',
    method: 'get',
    params: data
  })
}
// 校区列表
export function schoolZone(data) {
  return request({
    url: '/drug/address/zone',
    method: 'get',
    params: data
  })
}
// 实验室列表
export function laboratoryList(data) {
  return request({
    url: '/drug/address/laboratory',
    method: 'get',
    params: data
  })
}
// 模糊搜索
export function searchList(data) {
  return request({
    url: '/drug/dic/query',
    method: 'get',
    // method: 'post',
    params: data
    // data
  })
}
// 提交方新增
export function materielAdd(data) {
  return request({
    url: '/drug/dic/add',
    method: 'post',
    data
  })
}

// 提交方保存
export function saveStatus(data) {
  return request({
    url: '/drug/application/add',
    method: 'post',
    data
  })
}
// 提交方提交
export function drugCommit(data) {
  return request({
    url: '/drug/application/commit',
    method: 'post',
    data
  })
}

export function createBrand(data) {
  return request({
    url: '/brand/create',
    method: 'post',
    data
  })
}

export function readBrand(data) {
  return request({
    url: '/brand/read',
    method: 'get',
    data
  })
}

export function updateBrand(data) {
  return request({
    url: '/brand/update',
    method: 'post',
    data
  })
}

