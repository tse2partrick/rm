import React, {Component} from 'react'
import LinkSpan from '../../components/link-span'
import {Card, Table, message, Button, Modal} from 'antd'
import {reqAllUsers, reqAddUser, reqDelUser, reqUpdateUser} from '../../api'
import AddUserForm from './add-user-form'
import UpdateUserForm from './update-user-form'
import {formateTime} from '../../utils/dateUtil'

export default class User extends Component {
  constructor(props) {
    super(props)
    this.addFormRef = React.createRef()
    this.updateFormRef = React.createRef()
  }
  state = {
    userInfo: {},
    selectedUser: {},
    delVisible: false,
    updateVisible: false,
    visible: false
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateTime
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (rid) => {
          let res = this.state.userInfo.roles.find(role => role._id === rid)
          return res ? res.name : ''
        }
      },
      {
        title: '操作',
        dataIndex: '',
        render: (user) => {
          return (
            <div>
              <LinkSpan style={{marginRight: '10px'}} onClick={() => this.updateUser(user)}>修改</LinkSpan>
              <LinkSpan onClick={() => this.delUser(user)}>删除</LinkSpan>
            </div>
          )
        }
      }
    ]
  }

  updateUser = (user) => {
    this.setState({
      selectedUser: user,
      updateVisible: true
    })
    console.log('update user')
  }

  delUser = (user) => {
    this.setState({
      selectedUser: user,
      delVisible: true
    })

    Modal.confirm({
      title: '删除用户',
      content: `确定要删除用户${user.username}吗？`,
      onOk: this.handleDel,
      onCancel: this.handleCancelDel,
      okText: '确认',
      cancelText: '取消'
    })
  }

  handleDel = async () => {
    let {selectedUser} = this.state
    console.log('del user')
    let res = await reqDelUser(selectedUser._id)
    if (res.status === 0) {
      message.success('删除用户成功！')
      this.getAllUsers()
    } else {
      message.error('删除用户失败！')
    }
  }

  handleCancelDel = () => {
    this.setState({
      delVisible: false
    })
  }

  getAllUsers = async () => {
    let res = await reqAllUsers()
    if (res.status === 0) {
      this.setState({
        userInfo: res.data
      })
    } else {
      message.error('获取所有用户列表失败！')
    }
  }

  addUser = () => {
    this.setState({
      visible: true
    })
  }

  handleAddUser = () => {
    this.addFormRef.current.validateFields(async (err, values) => {
      if (!err) {
        console.log(values)
        let res = await reqAddUser(values)
        if (res.status === 0) {
          this.getAllUsers()
        } else {
          message.error('添加用户失败！')
        }
      }
    })
    this.setState({
      visible: false
    })
    this.addFormRef.current.resetFields()
  }

  handleCancelAddUser = () => {
    this.setState({
      visible: false
    })
    this.addFormRef.current.resetFields()
  }

  handleUpdateUser = () => {
    this.updateFormRef.current.validateFields(async (err, values) => {
      if (!err) {
        console.log(values)
        let updateInfo = Object.assign(values, {
          _id: this.state.selectedUser._id
        })
        let res = await reqUpdateUser(updateInfo)
        if (res.status === 0) {
          this.getAllUsers()
        } else {
          message.error('更新用户失败！')
        }
      }
    })
    this.setState({
      updateVisible: false
    })
  }

  handleCancelUpdateUser = () => {
    this.setState({
      updateVisible: false
    })
  }

  componentDidMount() {
    this.initColumns()
    this.getAllUsers()
  }

  render() {
    let {userInfo, visible, selectedUser, updateVisible} = this.state
    const title = <div>
                    <Button type="primary" onClick={() => this.addUser()}>创建用户</Button>
                  </div>
    return (
      <div>
        <Modal
          title="创建用户"
          visible={visible}
          onOk={this.handleAddUser}
          onCancel={this.handleCancelAddUser}
        >
          <AddUserForm ref={this.addFormRef} />
        </Modal>

        <Modal
          title="更新用户"
          visible={updateVisible}
          onOk={this.handleUpdateUser}
          onCancel={this.handleCancelUpdateUser}
        >
          <UpdateUserForm user={selectedUser} ref={this.updateFormRef} />
        </Modal>
        
        <Card title={title}>
          <Table
            bordered
            dataSource={userInfo.users}
            columns={this.columns}
            rowKey={record => record._id}
          />
        </Card>
      </div>
    )
  }
}