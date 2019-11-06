import React, {Component} from 'react'
import {Card, Table, Button, Icon, message, Modal} from 'antd'
import LinkSpan from '../../components/link-span'
import {reqCategorys, reqUpdateCategory, reqAddCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

const modals = {
  off: 0,
  add: 1,
  update: 2
}
export default class Catagory extends Component {
  state = {
    categorys: [],
    subCategorys: [],
    parentId: '0',
    parentName: '',
    loading: false,
    showModals: modals.off
  }

  initCategoryName = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        width: '30%',
        render: (category) => (
          <span>
            <LinkSpan
              onClick={() => this.updateCategory(category)}
              style={{marginRight: 20}}
            >
              修改分类
            </LinkSpan>
            {
              this.state.parentId === '0' ? <LinkSpan onClick={() => this.showSubCategorys(category)}>查看子分类</LinkSpan> : null
            }
          </span>
        )
      },
    ]
  }

  showSubCategorys = (category) => {
    let parentId = category._id
    this.setState({
      parentId,
      parentName: category.name
    }, () => {
      this.getCategorys()
    })
  }

  getCategorys = async () => {
    this.setState({loading: true})
    let {parentId} = this.state
    let res = await reqCategorys(parentId)
    this.setState({loading: false})

    if (res.status === 0) {
      if (parentId === '0') {
        let categorys = res.data
        this.setState({
          categorys
        })
      } else {
        let subCategorys = res.data
        console.log('getCategorys info')
        console.log(subCategorys)
        this.setState({
          subCategorys
        })
      }
    } else{
      message.error('获取商品分类数据失败')
    }
  }

  showCategorys = () => {
    console.log('preparing back to 1.')
    this.setState({
      parentId: '0',
      parentName: '',
      SubCategorys: []
    }, () => {
      this.getCategorys()
      console.log('back to 1 ok.')
    })
  }

  addCategory = () => {
    this.setState({
      showModals: modals.add
    })
  }

  updateCategory = (category) => {
    this.category = category
    this.setState({
      showModals: modals.update
    })
  }

  handleCancel = () => {
    // this.form.resetFields()
    this.setState({
      showModals: modals.off
    })
  } 

  handleAdd = () => {
    
    this.addForm.validateFields(async (err, values) => {
      console.log('add')
      console.log(values)
      if (!err) {
        this.setState({
          showModals: modals.off
        })

        let {parentId, categoryName} = values
        this.addForm.resetFields()
        console.log('preparing add: ' + categoryName)
        let res = await reqAddCategory(parentId, categoryName)

        if (res.status === 0) {
          message.success('成功添加分类')
          this.getCategorys()
        }
      }
    })
  }

  handleUpdate = () => {

    this.updateForm.validateFields(async (err, values) => {
      console.log('update')
      console.log(values)
      if (!err) {
        this.setState({
          showModals: modals.off
        })

        let categoryId = this.category._id
        let {categoryName} = values
        this.updateForm.resetFields()
        console.log('preparing update: ' + categoryName)
        let res = await reqUpdateCategory(categoryId, categoryName)

        if (res.status === 0) {
          message.success('分类名称更新成功！')
          this.getCategorys()
        }
      }
    })
  }

  componentWillMount() {
    this.initCategoryName()
  }

  componentDidMount() {
    this.getCategorys()
  }

  render() {
    let {categorys, subCategorys, parentId, loading, parentName} = this.state
    let category= this.category || {}
    let title = parentId === '0' ? '一级分类列表' : (
      <div>
        <LinkSpan onClick={this.showCategorys}>
        一级分类列表
        </LinkSpan>
        <Icon type="arrow-right" style={{margin: '0 5px'}} />
        <span>{parentName}</span>
      </div>
    )

    let extra = <Button type="primary" onClick={this.addCategory}>
                  <Icon type="plus" />
                  添加
                </Button>
    return (
      <div>
        <Modal
          title="添加"
          visible={this.state.showModals === modals.add}
          onOk={this.handleAdd}
          onCancel={this.handleCancel}
        >
          <AddForm
            setForm = {(form) => this.addForm = form}
            categorys = {categorys}
            parentId = {parentId}
          />
        </Modal>

        <Modal
          title="修改"
          visible={this.state.showModals === modals.update}
          onOk={this.handleUpdate}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            categoryName={category.name}
            setForm = {(form) => this.updateForm = form}
          />
        </Modal>

        <Card title={title} extra={extra}>
          <Table
            bordered
            dataSource={parentId === '0' ? categorys : subCategorys}
            columns={this.columns}
            loading={loading}
            rowKey={record => record._id}
          />
        </Card>
      </div>
    )
  }
}