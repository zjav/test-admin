const qs = require('qs')
const Mock = require('mockjs')

let teacherListData = Mock.mock({
  'data|100': [
    {
      'id|+1': 1,
      name: '@cname',
      mobile: /^1[34578]\d{9}$/,
      email: '@email',
      status: '@boolean',
      created_at: '@integer(1487000000000, 1487999999999)',
      image () {
        return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.name.substr(0, 1))
      },
    },
  ],
  page: {
    total: 100,
    current: 1,
  },
})

module.exports = {

  'GET /api/teacherItem': function (req, res) {
    const getItem = qs.parse(req.query)
    const teacherItem = teacherListData.data.find((item) => {
      return item.id === +getItem.id
    })
    res.json({ success: true, data: teacherItem })
  },

  'GET /api/teacher': function (req, res) {
    const page = qs.parse(req.query)
    const pageSize = page.pageSize || 10
    const currentPage = page.current || 1

    let data
    let newPage

    let newData = teacherListData.data.concat()

    if (page.field) {
      const d = newData.filter((item) => {
        return item[page.field].indexOf(decodeURI(page.keyword)) > -1
      })

      data = d.slice((currentPage - 1) * pageSize, currentPage * pageSize)

      newPage = {
        current: currentPage * 1,
        total: d.length,
      }
    } else {
      data = teacherListData.data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      teacherListData.page.current = currentPage * 1
      newPage = teacherListData.page
    }
    res.json({ success: true, list: data, page: { ...newPage, pageSize: Number(pageSize) } })
  },

  'POST /api/teacher': function (req, res) {
    const newData = req.body
    newData.created_at = Mock.mock('@integer(1487000000000, 1487999999999)')
    newData.image = Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newData.name.substr(0, 1))

    newData.id = teacherListData.data.length + 1
    teacherListData.data.unshift(newData)

    teacherListData.page.total = teacherListData.data.length
    teacherListData.page.current = 1

    res.json({ success: true, data: teacherListData.data, page: teacherListData.page })
  },

  'DELETE /api/teacher': function (req, res) {
    const deleteItem = req.body

    teacherListData.data = teacherListData.data.filter((item) => {
      if (item.id === deleteItem.id) {
        return false
      }
      return true
    })

    teacherListData.page.total = teacherListData.data.length

    res.json({ success: true, data: teacherListData.data, page: teacherListData.page })
  },

  'DELETE /api/deleteBatch': function (req, res) {
    const { ids } = req.body

    teacherListData.data = teacherListData.data.filter((item) => {
      if (ids.find(cur => cur === item.id)) {
        return false
      }
      return true
    })

    teacherListData.page.total = teacherListData.data.length

    res.json({ success: true, data: teacherListData.data, page: teacherListData.page })
  },

  'PUT /api/teacher': function (req, res) {
    const editItem = req.body
    editItem.created_at = Mock.mock('@integer(1487000000000, 1487999999999)')
    editItem.image = Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', editItem.name.substr(0, 1))

    teacherListData.data = teacherListData.data.map((item) => {
      if (item.id === editItem.id) {
        return editItem
      }
      return item
    })

    res.json({ success: true, data: teacherListData.data, page: teacherListData.page })
  },

}
