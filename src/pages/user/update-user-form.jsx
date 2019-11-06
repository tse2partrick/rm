import React, {PureComponent} from 'react'
import { Form, Input, message, Select } from 'antd';
import {reqRoleList} from '../../api'

const Item = Form.Item
const { Option } = Select
const FormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: {span: 18}
}

class UpdateUserForm extends PureComponent {
  state = {
    roleList: []
  }

  getRoles = async () => {
    let res = await reqRoleList()
    if (res.status === 0) {
      this.setState({
        roleList: res.data
      })
    } else {
      message.error('获取角色列表失败！')
    }
  }

  getOptions = () => {
    let {roleList} = this.state
    if (roleList.length) {
      return roleList.map(role => (<Option key={role._id} value={role._id}>{role.name}</Option>))
    }
  }

  componentDidMount() {
    this.getRoles()
  }

  validatePwd = (rule, value, callback) => {
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      callback('密码只能为数字字母下划线组合')
    } else if (!value) {
      callback('密码不能为空')
    } else if (value.length < 4) {
      callback('密码长度不能小于4位')
    } else if (value.length > 12) {
      callback('密码长度不能大于12位')
    } else {
      callback()
    }
  }

  validatePhone = (rule, value, callback) => {
    if (!!value && !/^1[3456789]\d{9}$/.test(value)) {
      callback('请输入正确的手机号码！')
    } else {
      callback()
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {user} = this.props
    console.log('render update form.')
    return (
      <Form {...FormItemLayout}>
        <Item label="用户名：">
          {
            getFieldDecorator('username', {
              initialValue: user ? user.username : '',
              rules: [
                {required: true, message: '用户名不能为空'},
                {min: 4, message: '用户名长度不能小于4位'},
                {max: 12, message: '用户名长度不能大于12位'},
                {pattern: /^[a-zA-Z0-9]+$/, message: '用户名必须是字母数字下划线的组合'}
              ]
            })(
              <Input placeholder="请输入用户名" />
            )
          }
        </Item>
        <Item label="手机号码：">
          {
            getFieldDecorator('phone', {
              initialValue: user ? user.phone : '',
              rules: [
                {validator: this.validatePhone}
              ]
            })(
              <Input placeholder="请输入手机号码" />
            )
          }
        </Item>
        <Item label="邮箱：">
          {
            getFieldDecorator('email', {
              initialValue: user ? user.email : '',
              rules: [
                {type: 'email', message: '请输入正确的邮箱地址'}
              ]
            })(
              <Input placeholder="请输入邮箱" />
            )
          }
        </Item>
        <Item label="所属角色：">
          {
            getFieldDecorator('role_id', {
              initialValue: user ? user.role_id : '',
            })(
              <Select>
                {this.getOptions()}
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

const WrappedUpdateUserForm = Form.create()(UpdateUserForm);

export default WrappedUpdateUserForm