import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { checkPower } from 'utils'
import { ADD, UPDATE, DELETE } from 'constants/options'
import TeacherList from './List'
import TeacherSearch from './Search'
import TeacherModal from './ModalForm'

const namespace = 'accountTeacher'

function Teacher ({ location, curPowers, dispatch, accountTeacher, modal, loading }) {
  const addPower = checkPower(ADD, curPowers)
  const updatePower = checkPower(UPDATE, curPowers)
  const deletePower = checkPower(DELETE, curPowers)

  const { field, keyword } = location.query

  const searchProps = {
    field,
    keyword,
    addPower,
    onSearch (fieldsValue) {
      dispatch({
        type: `${namespace}/query`,
        payload: { current: 1, ...fieldsValue },
      })
    },
    onAdd () {
      dispatch({
        type: 'modal/showModal',
        payload: { type: 'create' },
      })
    },
  }

  const listProps = {
    accountTeacher,
    loading,
    updatePower,
    deletePower,
    onPageChange (fieldsValue) {
      dispatch({
        type: `${namespace}/query`,
        payload: { ...fieldsValue },
      })
    },
    onDeleteItem (id) {
      dispatch({ type: `${namespace}/delete`, payload: { id } })
    },
    onEditItem (item) {
      dispatch({
        type: `${namespace}/showModal`,
        payload: { type: 'update', curItem: item },
      })
    },
    onStatusItem (item) {
      dispatch({
        type: `${namespace}/updateStatus`,
        payload: { curItem: item },
      })
    },
    onDeleteBatch (ids) {
      dispatch({
        type: 'accountTeacher/deleteBatch',
        payload: { ids },
      })
    },

  }

  const modalProps = {
    modal,
    loading,
    onOk (data) {
      dispatch({
        type: data.id
          ? `${namespace}/update`
          : `${namespace}/create`,
        payload: { curItem: data },
      })
    },
    onCancel () {
      dispatch({ type: 'modal/hideModal' })
    },
  }

  return (
    <div className="content-inner">
      <TeacherSearch {...searchProps} />
      <TeacherList {...listProps} />
      <TeacherModal {...modalProps} />
    </div>
  )
}

Teacher.propTypes = {
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  accountTeacher: PropTypes.object.isRequired,
  curPowers: PropTypes.array.isRequired,
  loading: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
}

function mapStateToProps ({ accountTeacher, modal, loading }) {
  return { accountTeacher, modal, loading }
}

export default connect(mapStateToProps)(Teacher)
