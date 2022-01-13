
import { Form, Input, Button, Checkbox, message } from 'antd';
import { Navigate, Link, useOutletContext, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/userSlice';
import axios from '../http'
import styled from 'styled-components'
import { useEffect } from 'react';

const Container = styled.div`
    height: 100vh;
    background-color: pink;
    text-align: center;
    `
const Title = styled.h1`
    font-size: 5rem
    `


export default function Login() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userId = useSelector(state => state.user.userId)

    useEffect(()=>{
        if(userId !== 0){
            navigate(`/profile/${userId}`)
        }
    },[userId])
    
    const onFinish = (values) => {
        const path = '/tokens'


        axios.post(path, {}, {
            auth: { ...form.getFieldsValue(true) }
        })
            .then((response) => {
                //登陆成功
                window.localStorage.setItem('myblog-token', response.data.token);
                //redux
                dispatch(login())
                message.info("登陆成功 !")
                //重定向到主页或原来计划的
                navigate(`/`)

            })
            .catch((error) => {
                //弹出错误信息
                if (error.response.status === 401) {
                    message.info("Invalid username or password")
                } else {
                    console.log(error.response)
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
                <Title>Login</Title>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: "" }]}
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

                <Form.Item wrapperCol={{ offset: 8,span: 8 }}>
                    <Button type="primary" htmlType="submit" block="true">
                        Login
                    </Button>
                </Form.Item>
                <br />
                <p>New User?<Link to="/register">Click to Register</Link></p>
                <p>
                    Forgot Your Password?
                    <a href="#">Click to Reset It</a>
                </p>
            </Form>

        </Container>
    );
};
