
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

import styled from 'styled-components'

import axios from '../http';

const Container = styled.div`
    height: 100vh;
    background-color: pink;
    text-align: center;
    `
const Title = styled.h1`
    font-size: 5rem
    `


export default function Register() {
  const [form] = Form.useForm();
 
  const navigate = useNavigate();
  
  const onFinish = (values) => {
    const path = "/users"
    const payload = form.getFieldsValue(true);
    axios.post(path, payload)
      .then((response) => {
        //注册成功，重定向到登陆界面
        message.info("success！")

        navigate("/login")
        

      })
      .catch((error) => {
        //弹出错误信息
        for (const field in error.response.data.message) {
          if (field === "username") {
            message.info(error.response.data.message.username);
          } else if (field === "email") {
            message.info(error.response.data.message.email);
          } else if (field === "password") {
            message.info(error.response.data.message.password);
          }
        }
      })
  };

  const onFinishFailed = (errorInfo) => {
    message.info("Fuck u,Bitch")
  };

  return (
    <Container>
    <Form
      name="basic"
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      size="large"
    >
      <Title>Register</Title>
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: "email", message: "fuck u" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
        <Button type="primary" htmlType="submit" block="true">
          Register
        </Button>
      </Form.Item>
    </Form>
    </Container>
  );
};
