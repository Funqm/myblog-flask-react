import React from "react";
import { useHi  } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import MDEditor from '@uiw/react-md-editor';
import { Form, Input, Button, message, Row } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import axios from "../../http";
import { MailFilled } from "@ant-design/icons";






export default function NewPost() {
  const [body, setBody] = React.useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate()

  const submitNewPost = ({ title, summary, body }) => {
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
        navigate('/')
        

      })
      .catch(error => {
        console.log(error.response);
      })
  }

  const onFinish = (values) => {
    if (body === '') {
      onFinishFailed('body is required')
      return;

    }
    console.log(values);

    submitNewPost({ ...values, body })
  };

  const onFinishFailed = (errorInfo) => {
    message.info('Failed:', errorInfo);
  };

  return (
    <div>

      <Form
        name="basic"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{ backgroundColor: "white", marginTop: "10px", borderRadius: "5px" }}
      >
        <Button type="primary" htmlType="submit" size="large" shape="circle" style={{ backgroundColor: "white", border: "0px", position: "absolute", left: "-50px" }}>
          <UploadOutlined style={{ color: "#cc366b" }}></UploadOutlined>
        </Button>
        <Form.Item
          name="title"
          rules={[{ required: true, message: 'Please input title' }]}
          style={{ borderBottom: "solid 1px #753a77 " }}
        >
          <Input placeholder="标题" size="large" bordered={false} />

        </Form.Item>

        <Form.Item
          name="summary"
          rules={[{ required: true, message: 'Please input summary' }]}
        >
          <Input placeholder="摘要" bordered={false} />
        </Form.Item>

        <Form.Item >
          <MDEditor
            value={body}
            onChange={setBody}
            preview="edit"
            height='100'
          />
        </Form.Item>
      </Form>

    </div>
  );

}
