import { request } from 'utils'

export async function query (params) {
  return request('/api/teacher', {
    method: 'get',
    data: params,
  })
}

export async function get (params) {
  return request('/api/teacherItem', {
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request('/api/teacher', {
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request('/api/teacher', {
    method: 'delete',
    data: params,
  })
}

export async function removeBatch (params) {
  return request('/api/deleteBatch', {
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request('/api/teacher', {
    method: 'put',
    data: params,
  })
}
