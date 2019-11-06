import React, {Component} from 'react'
import {
  Card,
  Input,
  Icon,
  Form,
  Button,
  Cascader,
  message
} from 'antd'
import PicturesWall from './pictures-wall'
import LinkSpan from '../../components/link-span'
import {reqCategorys, reqAddProduct, reqUpdateProduct} from '../../api'
import RichTextEditor from './rich-text-editor'

const Item = Form.Item
const { TextArea } = Input
const FormItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: {span: 22}
}

class AddUpdate extends Component {
  state = {
    options: [
    ]
  }

  constructor(props) {
    super(props)
    this.picWallsRef = React.createRef()
    this.richTextEditorRef = React.createRef()
  }
  submit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('go ajax.')
        console.log(values)
        let imgs = this.picWallsRef.current.getImgs()
        let detail = this.richTextEditorRef.current.getEditorState()

        console.log(detail)
        let {name, price, desc, categoryIds} = values
        if (categoryIds.length === 1) {
          categoryIds.unshift('0')
        }

        let productInfo = {
          categoryId: categoryIds[1],
          pCategoryId: categoryIds[0],
          name,
          desc,
          price,
          detail,
          imgs
        }
        if (!this.product._id) {
          let res = await reqAddProduct(productInfo)
          if (res.status === 0) {
            message.success('添加商品成功！')
          } else {
            message.error('添加商品失败！')  
          }
        } else {
          let res = await reqUpdateProduct({_id: this.product._id, ...productInfo})
          if (res.status === 0) {
            message.success('更新商品成功！')
            let r = await reqCategorys(productInfo.pCategoryId)
            console.log('after update.')
            console.log(r.data)
          } else {
            message.error('更新商品失败！')  
          }
        }
      } else {
        message.error('提交失败，数据错误')
      }
    })
  }

  validatePrice = (rule, value, callback) => {
    if (value >= 0) {
      callback()
    } else {
      callback('价格不能小于0')
    }
  }

  loadData = async selectedOptions => {
    console.log('loadData ')
    const targetOption = selectedOptions[0]
    targetOption.loading = true
    let res = await reqCategorys(targetOption.value)
    targetOption.loading = false
    if (res.status === 0) {
      if (res.data.length > 0) {
        targetOption.children = []
        res.data.forEach((category, index) => {
          targetOption.children[index] = {
            value: category._id,
            label: category.name
          }
        })
      } else {
        targetOption.isLeaf = true
      }
      this.setState({
        options: [...this.state.options],
      })
    } else {
      message.error('获取子分类信息失败。')
    }
  }

  initOptions = async () => {
    let res = await reqCategorys('0')

    if (res.status === 0) {
      let options = []
      res.data.forEach((category, index) => {
        options[index] = {
          value: category._id,
          label: category.name,
          isLeaf: false
        }
      })

      if (this.product._id && this.product.pCategoryId !== '0') {
        let result = await reqCategorys(this.product.pCategoryId)
        if (result.status === 0) {
          let parent = options.find(item => item.value === this.product.pCategoryId)

          parent.children = result.data.map((i) => ({
            value: i._id,
            label: i.name,
          }))
        }
      }

      this.setState({
        options
      })
    } else {
      message.error('获取分类信息失败')
    }
  }

  getProductInfo = () => {
    let data = this.props.location.state
    if (!!data) {
      this.product = this.props.location.state
    } else {
      this.product = {}
    }
  }

  changeImgs = async (imgsArr) => {
    let product = this.product
    product.imgs = imgsArr

    let res = await reqUpdateProduct(product)
    if (res.status === 0) {
      message.success('商品图片已更新')
    } else {
      message.error('商品图片更新失败')
    }
  }

  componentDidMount() {
    this.initOptions()
  }

  componentWillMount() {
    this.getProductInfo()
  }

  render() {
    const {getFieldDecorator} = this.props.form
    let product = this.product
    console.log('product info', product)

    let title = (
      <div>
        <LinkSpan onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" style={{marginRight: 10}} />
        </LinkSpan>
        <span>{product._id ? '修改商品' : '添加商品'}</span>
      </div>
    )
    const { options } = this.state;

    return (
      <Card title={title}>
        <Form {...FormItemLayout}>
          <Item label="商品名称：" wrapperCol={{span: 8}}>
            {
              getFieldDecorator('name', {
                initialValue: product.name ? product.name : '',
                rules: [
                  {required: true, message: '商品名称不能为空'}
                ]
              })(
                <Input placeholder="请输入商品名称" />
              )
            }
          </Item>
          <Item label="商品描述：" wrapperCol={{span: 8}}>
            {
              getFieldDecorator('desc', {
                initialValue: product.desc ? product.desc : '',
                rules: [
                  {required: true, message: '商品描述不能为空'}
                ]
              })(
                <TextArea placeholder="请输入商品描述" autosize={{minRows: 2}}  />
              )
            }
          </Item>
          <Item label="商品价格：" wrapperCol={{span: 8}}>
            {
              getFieldDecorator('price', {
                initialValue: product.price ? product.price : '',
                rules: [
                  {required: true, message: '商品价格不能为空'},
                  {validator: this.validatePrice}
                ]
              })(
                <Input type="number" addonAfter="元" />
              )
            }
          </Item>
          <Item label="商品分类" wrapperCol={{span: 8}}>
            {

              getFieldDecorator('categoryIds', {
                initialValue: product.pCategoryId === '0' ? [product.categoryId] : [product.pCategoryId, product.categoryId],
                rules: [
                  {required: true, message: '必须选择商品分类'}
                ]
              })(
                <Cascader
                  options={options}
                  loadData={this.loadData}
                />  
              )  
            }
          </Item>
          <Item label="商品图片：">
            <PicturesWall imgs={product._id ? product.imgs : []} ref={this.picWallsRef} changeImgs={(imgsArr) => this.changeImgs(imgsArr)} />
          </Item>
          <Item label="商品详情">
            <RichTextEditor detail={product._id ? product.detail : null} ref={this.richTextEditorRef} />
          </Item>
          <Item>
            <Button type="primary" onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(AddUpdate)