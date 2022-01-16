import React from "react";
import MDEditor from '@uiw/react-md-editor';
import { Form, Input, Button, message } from 'antd';
import axios from "../../http";


export default function NewPost() {
  const [body, setBody] = React.useState('');
  const [form] = Form.useForm();

  const submitNewPost = ({title, summary, body})=>{
    const path = "/posts"
    const payload = {
      title,
      summary,
      body
    }

    axios.post(path, payload)
    .then(response => {
      //get posts
      message.info("Success add a new post!")
      form.resetFields()
      setBody('');

    })
    .catch(error => {
      console.log(error.response);
    })
  }

  const onFinish = (values) => {
    if(body === ''){
      onFinishFailed('body is required')
      return;

    }
    console.log(values);
    
    submitNewPost({...values, body})
  };

  const onFinishFailed = (errorInfo) => {
    message.info('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      form={form}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        name="title"
        rules={[{ required: true, message: 'Please input title' }]}
      >
        <Input placeholder="标题" />
      </Form.Item>

      <Form.Item
        name="summary"
        rules={[{ required: true, message: 'Please input summary' }]}
      >
        <Input placeholder="摘要" />
      </Form.Item>

      <Form.Item >
        <MDEditor
          value={body}
          onChange={setBody}
          preview="edit"
         height='100'
        />
      </Form.Item>



      <Form.Item wrapperCol={{ span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );

}
