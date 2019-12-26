import React, { Component } from 'react'

import { Card, Upload, Spin } from 'antd'

import { changeAvatar } from '../../actions/user'

import axios from 'axios'

import { connect } from 'react-redux'

const mapState = state => ({
  avatarUrl: state.user.avatar
})

@connect(mapState, {changeAvatar})
class Profile extends Component {
  state = {
    isUploading: false
  }
  handleUploadAvatar = ({file}) => {
    const data = new FormData()
    data.append('Token','9fee36479c5213f9791df67313303d8a26e7dd28:q2WbopJ4FAzZmZugtOadl009V9g=:eyJkZWFkbGluZSI6MTU3NzM3NDE4NywiYWN0aW9uIjoiZ2V0IiwidWlkIjoiNzA2NzYxIiwiYWlkIjoiMTY1NjEwNCIsImZyb20iOiJmaWxlIn0=')
    data.append('file',file)
    this.setState({
      isUploading: true
    })
    axios.post('http://up.imgapi.com/',data)
      .then(resp => {
        if(resp.status === 200){
          this.setState({
            isUploading: false
          })
          this.props.changeAvatar(resp.data.linkurl)
        }
      })
      .catch(err => {
        // 处理错误
      })
  }
  render() {
    return (
      <Card title="个人设置" bordered={false}>
        <Upload showUploadList={false} customRequest={this.handleUploadAvatar}>
          
          <Spin spinning={this.state.isUploading}>
            {
              this.props.avatarUrl ? <img src={this.props.avatarUrl} style={{height: 80,width: 80}}/> : <span>点击上传</span>
            }
          </Spin>
        </Upload>
      </Card>
    )
  }
}

export default Profile
