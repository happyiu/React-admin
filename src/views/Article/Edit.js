import React, { Component, createRef } from 'react'
import { Card, Button, Form, Icon, Input, DatePicker, Spin, message  } from 'antd'
import { formatTimeStr } from 'antd/lib/statistic/utils'
import E from 'wangeditor'
import './editor.less'
import { getArticle, updateArticle } from '../../requests'
import moment from 'moment'

const formItemLayout =  {
  labelCol: {span:4},
  wrapperCol: {span:16}
}

@Form.create()
class Edit extends Component {
  constructor(){
    super()
    this.editorRef = createRef()
    this.state = {
      isLoading: false
    }
  }
  initEditor = () => {
    this.editor = new E(this.editorRef.current)
    this.editor.customConfig.onchange = (html) => {
      this.props.form.setFieldsValue({
        content: html
      })
    }
    this.editor.create()
  }
  componentDidMount(){
    this.setState({
      isLoading: true
    })
    this.initEditor()
    getArticle(this.props.match.params.id)
      .then(resp => {
        const {id, ...data} = resp
        data.createAt = moment(data.createAt)
        this.props.form.setFieldsValue(data)
        this.editor.txt.html(data.content)
        this.setState({
          isLoading: false
        })
      })
  }

  handleSubmit = (e) => {
    this.setState({
      isLoading: true
    })
    // console.log(e)
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values)
        // console.log(values.createAt.valueOf())
        const data = Object.assign({},values,{
          createAt: values.createAt.valueOf()
        })
        // console.log(data)
        // console.log(this.props.match.params.id)
        updateArticle(this.props.match.params.id,data)
          .then( resp => {
            message.success(resp.msg)
            this.props.history.push('/admin/article')
          })
          .finally(() => {
            this.setState({
              isLoading: false
            })
          })

      }
    })
  }

  render() {
    const {
      getFieldDecorator
    } = this.props.form
    return (
      <Card onClick={this.props.history.goBack} title='编辑文章' bordered={false} style={{ width: '100%' }} extra={<Button>取消</Button>}>
        <Spin spinning={this.state.isLoading}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
          <Form.Item label="标题">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入Title!' },],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="title"
              />,
            )}
          </Form.Item>
          <Form.Item label="作者">
            {getFieldDecorator('author', {
              rules: [{ required: true, message: '请输入作者!' },],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="author"
              />,
            )}
          </Form.Item>
          <Form.Item label="阅读量">
            {getFieldDecorator('amount', {
              rules: [{ required: true, message: '阅读量是必须的!' },],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="0"
              />,
            )}
          </Form.Item>
          <Form.Item label="创建时间">
            {getFieldDecorator('createAt', {
              rules: [{ required: true, message: '创建时间是必须的!' },],
            })(
              <DatePicker 
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              placeholder={['选择时间']}
               />

            )}
          </Form.Item>
          <Form.Item label="内容">
            {getFieldDecorator('content', {
              rules: [{ required: true, message: '内容是必须的!' },],
            })(

              <div className="qf-editor" ref={this.editorRef}></div>
            )}
          </Form.Item>
          
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Button type="primary" htmlType="submit">
              保存修改
            </Button>
          </Form.Item>

        </Form>
        </Spin>
      </Card>
    )
  }
}

export default Edit
