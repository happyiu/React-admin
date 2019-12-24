import React, { Component } from 'react'
import { Card, Button, Form, Icon, Input } from 'antd'

@Form.create()
class Edit extends Component {

  handleSubmit = (e) => {
    console.log(e)
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render() {
    const {
      getFieldDecorator
    } = this.props.form
    return (
      <Card title='编辑文章' bordered={false} style={{ width: '100%' }} extra={<Button>取消</Button>}>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入Title!' },
              {min: 4,message: 'Title必须大于4位'}
            ],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />,
            )}
          </Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </Form>
      </Card>
    )
  }
}

export default Edit
