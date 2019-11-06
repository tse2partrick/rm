import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import {reqDelImg} from '../../api'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/*
  已定：图片墙直接上传到服务器
  1. 正常添加，最后提交（记录当前商品对应的图片名称地址，提交到商品的imgs数据里）
  2. 正常添加删除，最后提交（记录当前商品对应的图片名称地址，提交到商品的imgs数据里）
  3. 添加后，不提交
  4. 添加后又删除，不提交
*/

class PicturesWall extends React.Component {
  constructor(props) {
    super(props)

    let fileList = []

    let {imgs} = this.props
    console.log('constructor pcwall')
    console.log(imgs)
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img.name,
        status: 'done',
        url: img.url
      }))
    }

    console.log(fileList)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList
    }
  }

  getImgs = () => {
    console.log('getimages', this.state.fileList)
    return this.state.fileList.map(item => {
      return {
        name:item.name,
        url: item.url
      }
    })
  }

  handleCancel = (e) => {
    this.setState({ 
      previewVisible: false
    })
  }

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({ file, fileList }) => {
    if (file.status === 'done') {
      let data = file.response.data
      file = fileList[fileList.length - 1]
      file.name = data.name
      file.url = data.url

    } else if (file.status === "removed") {

      let res = await reqDelImg(file.name)

      if (res.status !== 0) {
        message.error('图片删除失败！')
      } else {
        let index = fileList.findIndex(item => item.name === file.name)
        fileList.splice(index, 0)
        message.success('图片删除成功')
      }

      this.props.changeImgs(fileList)
    }

    console.log(fileList)
    this.setState({
      fileList
    })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div>
        <Upload
          action="/manage/img/upload"
          name="image"
          accept="image/*"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          rowKey={record => record.name}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="PicturesWall" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall