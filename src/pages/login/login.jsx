import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import './login.less'
import { Form, Icon, Input, Button, message } from 'antd';
import {reqLogin} from '../../api'
import memoryUtil from '../../utils/memoryUtil'
import storageUtil from '../../utils/storageUtil'

const Item = Form.Item

class Login extends Component {
  constructor(props) {
    super(props)
    this.form = this.props.form
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let {username, password} = values
        let res = await reqLogin(username, password)
        
        if (res.status === 0) {
          message.success('登录成功')
          memoryUtil.user = res.data
          storageUtil.setUser(res.data)
          this.props.history.replace('/')
        } else {
          message.error(res.msg)
        }
      }
    })
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

  render() {
    const user = memoryUtil.user
    if (user && user._id) {
      return <Redirect to={"/"} />
    }
    const { getFieldDecorator } = this.form

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {
                getFieldDecorator('username', {
                  rules: [
                    {pattern: /^[a-zA-Z0-9]+$/, message: '用户名必须是字母数字下划线'},
                    {required: true, message: '用户名不能为空'},
                    {min: 4, message: '用户名长度不能小于4位'},
                    {max: 12, message: '用户名长度不能大于12位'}
                  ]
                })(<Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />)
              }
            </Item>
            <Item>
              {
                getFieldDecorator('password', {
                  rules: [
                    {validator: this.validatePwd}
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )
              }
            </Item>
            <Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                  登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    )
  }
}

const WrappedLogin = Form.create()(Login);

export default WrappedLogin