import React, {Component} from 'react'
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Icon,
  message
} from 'antd'
import LinkSpan from '../../components/link-span'
import {reqProducts, reqUpdateProductStatus, reqSearch} from '../../api'
import {PAGE_SIZE, SEARCH_TYPE} from '../../config/constants'

const Option = Select.Option

export default class Home extends Component {

  state = {
    total: 0,
    current: 1,
    loading: false,
    products: [],
    searchWord: '',
    searchType: SEARCH_TYPE.SEARCH_BY_NAME,
    isSearch: false
  }

  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price'
      },
      {
        title: '状态',
        render: (product) => {
          return (
            <div>
              <Button type={product.status === 1 ? 'primary' : 'danger'} style={{marginRight: '20px'}}>{product.status === 1 ? '在售中' : '已下架'}</Button>
              <LinkSpan onClick={() => this.updateSellStatus(product)}>{product.status === 1 ? '下架' : '上架'}</LinkSpan>
            </div>
          )
        }
      },
      {
        title: '操作',
        render: (product) => {
          return (
            <div>
              <LinkSpan onClick={() => {
                this.props.history.push('/product/detail', product)
              }} style={{marginRight: '20px'}}>详情</LinkSpan>
              <LinkSpan onClick={() => {
                this.props.history.push('/product/add-update', product)
              }}>修改</LinkSpan>
            </div>
          )
        }
      }
    ]
  }

  updateSellStatus = async (product) => {
    let {_id, status} = product
    status = status === 1 ? 0 : 1

    let res = await reqUpdateProductStatus(_id, status)
    if (res.status === 0) {
      let p = [...this.state.products]
      let item = p.find(i => i._id === _id)
      item.status = status

      if (status === 1) {
        message.success('商品上架成功！')
      } else {
        message.success('商品下架成功！')
      }

      this.setState({
        products: p
      })
    } else {
      message.error('更新状态失败！')
    }
  }

  getProducts = async (pageNum) => {
    console.log('geting product list.' + pageNum)
    this.setState({
      loading: true
    })
    let res = await reqProducts(pageNum, PAGE_SIZE)
    if (res.status === 0) {
      let {total, list} = res.data
      this.setState({
        total,
        loading: false,
        products: list,
        isSearch: false,
        current: pageNum
      })
    }
  }

  startSearch = async (pageNum) => {
    let {searchWord, searchType, isSearch} = this.state
    console.log('start search pagenum = ', pageNum)

    if (searchWord === '') {
      if (isSearch) {
        this.getProducts(1)
      }
      return
    }

    this.setState({
      loading: true,
      isSearch: true
    })
    let res
    if (searchType === SEARCH_TYPE.SEARCH_BY_NAME) {
      res = await reqSearch({
        pageNum,
        pageSize: PAGE_SIZE,
        productName: searchWord
      })
    } else if (searchType === SEARCH_TYPE.SEARCH_BY_DESC){
      res = await reqSearch({
        pageNum,
        pageSize: PAGE_SIZE,
        productDesc: searchWord
      })
    }

    if (res.status === 0) {
      let {total, list} = res.data
      this.setState({
        total,
        loading: false,
        products: list,
        current: pageNum
      })
    }
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getProducts(1)
  }

  onChangeSelect = (value) => {
    this.setState({
      searchType: value
    })
  }

  onChangeInput = (e) => {
    this.setState({
      searchWord: (e.target.value).trim()
    })
  }

  render() {
    console.log('home')
    let title = <div>
                  <Select defaultValue={SEARCH_TYPE.SEARCH_BY_NAME} style={{width: 150}} onSelect={this.onChangeSelect}>
                    <Option value={SEARCH_TYPE.SEARCH_BY_NAME}>按名称搜索</Option>
                    <Option value={SEARCH_TYPE.SEARCH_BY_DESC}>按描述搜索</Option>
                  </Select>
                  <Input placeholder="关键字" style={{width: 150, margin: '0 15px'}} onChange={this.onChangeInput} />
                  <Button type="primary" onClick={() => {this.startSearch(1)}}>搜索</Button>
                </div>

    let extra = <Button type="primary" onClick={() => {this.props.history.push('/product/add-update')}}>
                  <Icon type="plus" />
                  添加商品
                </Button>

    let {products, loading, total, isSearch, current} = this.state
    console.log(products)
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          loading={loading}
          dataSource={products}
          columns={this.columns}
          rowKey={record => record._id}
          pagination={{
                      defaultPageSize: PAGE_SIZE,
                      total,
                      current,
                      onChange: isSearch ? this.startSearch : this.getProducts
                    }}
        >
        </Table>
      </Card>
    )
  }
}