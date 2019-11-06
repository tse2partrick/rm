import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


class RichTextEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty()
    }
  }

  getEditorState = () => {
    let ret = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))

    return ret
  }

  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };

  initDetail = () => {
    let content = this.props.detail

    if (!content) {
      return
    }

    const blocksFromHTML = htmlToDraft(content);
    if (!blocksFromHTML.contentBlocks) {
      this.setState({
        editorState: EditorState.createEmpty()
      })
      return
    }
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    )

    this.setState({
      editorState: EditorState.createWithContent(state),
    })
  }

  uploadCallback = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/manage/img/upload')
      const data = new FormData()
      data.append('image', file)
      xhr.send(data)
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText)
        const url = response.data.url
        resolve({
          data: {
            link: url
          }
        })
      })
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText)
        reject(error)
      })
    })
  }

  componentDidMount() {
    this.initDetail()
  }
  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        editorStyle={{border: '1px solid #000', minHeight: 200}}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: { uploadCallback: this.uploadCallback, alt: { present: true, mandatory: true } },
        }}
      />
    );
  }
}

export default RichTextEditor