import React, {Component} from 'react'
import {Card, Table, Button, message, Modal, Tree} from 'antd'
import {reqRoleList, reqAddRole, reqUpdateRole} from '../../api'
import {now, formateTime} from '../../utils/dateUtil'
import menuList from '../../config/menuConfig'
import memoryUtil from '../../utils/memoryUtil'

const { TreeNode } = Tree

export default class Role extends Component {

  constructor(props) {
    super(props)
    this.addRoleRef = React.createRef();
  }

  state = {
    roleList: [],
    loading: false,
    visible: false,
    permissionVisible: false,
    permissionBtn: false,
    selectedRole: {},
    selectedKeys: [],
    checkedKeys: []
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  showPermissionModal = () => {
    this.setState({
      permissionVisible: true
    })
  }

  handleAddRole = async () => {
    let roleName = this.addRoleRef.current.value
    if (!roleName) {
      message.error('添加角色失败！角色名不能为空')
      return
    }
    let res = await reqAddRole(roleName)
    if (res.status === 0) {
      message.success('添加角色成功！')
      this.getRolesInfo()
    } else {
      message.error('添加角色失败！')
    }
    this.setState({
      visible: false,
    })
  }

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    })
  }

  handleAddPermission = async () => {
    const {selectedRole, checkedKeys} = this.state
    let username = memoryUtil.user.username
    let res = await reqUpdateRole({
      _id: selectedRole._id,
      menus: checkedKeys,
      auth_time: now(),
      auth_name: username
    })
    if (res.status === 0) {
      message.success('更新角色权限成功！')
      this.getRolesInfo()
      selectedRole.menus = checkedKeys
    } else {
      message.error('更新角色权限失败！')
    }
    this.setState({
      permissionVisible: false
    })
  }

  handleCancelPermission = () => {
    let {selectedRole} = this.state

    this.setState({
      permissionVisible: false,
      checkedKeys: selectedRole.menus
    })
  }

  getRolesInfo = async () => {
    this.setState({
      loading: true
    })
    let res = await reqRoleList()
    this.setState({
      loading: false
    })
    if (res.status === 0) {
      this.setState({
        roleList: res.data
      })
    } else {
      message.error('获取角色列表失败！')
    }
  }

  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: formateTime
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateTime
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      }
    ]
  }

  initSelection = () => {
    this.rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          permissionBtn: true,
          selectedRole: selectedRows[0],
          checkedKeys: selectedRows[0].menus
        })
      }
    }
  }

  initTreeData = () => {
    this.treeData = [...menuList]
  }

  renderTreeNodes = data => 
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />
    })
    
  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  }

  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  }

  componentWillMount() {
    this.initColumns() 
    this.initSelection()
    this.initTreeData()
  }

  componentDidMount() {
    this.getRolesInfo()
  }

  render() {
    let {roleList, loading, permissionBtn, selectedRole, checkedKeys} = this.state
    const title = <div>
                    <Button type="primary" onClick={this.showModal}>创建角色</Button>
                    <Button disabled={!permissionBtn} onClick={this.showPermissionModal}>设置角色权限</Button>
                  </div>

    console.log('role render()')
    return (
      <div>
        <Modal
          title="创建角色"
          visible={this.state.visible}
          onOk={this.handleAddRole}
          onCancel={this.handleCancel}
        >
          <label htmlFor="role_name" >角色名称：</label>
          <input id="role_name" placeholder="请输入角色名称" ref={this.addRoleRef} />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={this.state.permissionVisible}
          onOk={this.handleAddPermission}
          onCancel={this.handleCancelPermission}
        >
          <span>角色名称：</span>
          <input id="role_name" disabled placeholder={selectedRole ? selectedRole.name : ''} />
          <Tree
            checkable
            defaultExpandAll
            checkedKeys={selectedRole ? checkedKeys : []}
            onCheck={this.onCheck}
            onSelect={this.onSelect}
          >
            {this.renderTreeNodes(this.treeData)}
          </Tree>
        </Modal>

        <Card title={title}>
          <Table
            bordered
            rowSelection={this.rowSelection}
            dataSource={roleList}
            columns={this.columns}
            loading={loading}
            rowKey={record => record._id}
          />
        </Card>
      </div>
    )
  }
}