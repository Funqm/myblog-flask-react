import { Row, Col, Avatar, message, Button, Input } from "antd";
import axios from "../http";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";


const infoContainerStyle = {
    margin: "10px 0"
}
Input.size = "large"

export default function Profile() {
    const authedUserId = useSelector(state => state.user.userId);
    const [user, setUser] = useState({
        username: '',
        email: '',
        name: '',
        location: '',
        about_me: '',
        member_since: '',
        last_seen: '',
        _links: {
            self: '',
            avatar: ''
        }
    })
    let params = useParams();
    const navigate = useNavigate();

    const [editState, setEditState] = useState(false);
    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
        if(authedUserId !== 0 && params.userId === 0){
            navigate(`/profile/${authedUserId}`)
        }
        const userId = params.userId;
        getUser(userId);
        if(params.userId != authedUserId){
            setCanEdit(false);
        }else{
            setCanEdit(true);
        }
    }, [params])

    function getUser(id) {
    
        const path = `/users/${id}`
      
        axios.get(path)
            .then((response) => {
                setUser({...response.data})
            })
            .catch(error => {
                console.error(error)
                message.info(id)
            })
    }

    function submitEdit(){
        const path = `/users/${authedUserId}`
        const payload = {
            name: user.name,
            location: user.location,
            about_me: user.about_me
        }
        axios.put(path, payload)
        .then(response => {
            message.info("Succes modify your profile!")
            setEditState(false);
        })
        .catch(error => {
            console.log(error.response.data)
        })
    }
    return (
        <Row justify="center">
            <Col span="20" style={{ backgroundColor: "hotpink", fontSize: '20px' }}>
                {canEdit ? editState ?
                    (<div>
                        <Button type='primary' onClick={() => submitEdit()}>保存</Button>
                        <Button type='primary'>取消</Button>
                    </div>)
                    : <Button type='primary' onClick={() => setEditState(true)}>编辑</Button> : null}
                <Row justify="center" style={{ padding: "20px 0 10px", borderBottom: "1px solid gray" }}>
                    <Avatar size={128} shape="square" src={user._links.avatar}></Avatar>
                </Row>
                <Row gutter={10} style={infoContainerStyle} >
                    <Col span={6} offset={2}>USER: </Col>
                    <Col span={12}>{user.username}</Col>
                </Row>
                <Row gutter={10} style={infoContainerStyle} >
                    <Col span={6} offset={2}>Name: </Col>
                    <Col span={12}>{editState ? <Input placeholder={user.name} size="large" onInput={(event)=>setUser({...user, name: event.target.value})}></Input> : user.name}</Col>
                </Row>
                <Row gutter={10} style={infoContainerStyle}>
                    <Col span={6} offset={2}>Email: </Col>
                    <Col span={12}>{editState ? <Input placeholder={user.email} onInput={(event)=>setUser({...user, email: event.target.value})}></Input> : user.email}</Col>
                </Row>
                <Row gutter={10} style={infoContainerStyle}>
                    <Col span={6} offset={2}>Location: </Col>
                    <Col span={12}>{editState ? <Input placeholder={user.location} onInput={(event)=>setUser({...user, location: event.target.value})}></Input> : user.location}</Col>
                </Row>
                <Row gutter={10} style={infoContainerStyle}>
                    <Col span={6} offset={2}>About Me: </Col>
                    <Col span={12}>{editState ? <Input style={{ backgroundColor: "" }} placeholder={user.about_me} onInput={(event)=>setUser({...user, about_me: event.target.value})}></Input> : user.about_me}</Col>
                </Row>

                <Row gutter={10} style={infoContainerStyle}>
                    <Col span={6} offset={2}>Member Since: </Col>
                    <Col span={12}></Col>
                </Row>
                <Row gutter={10} style={infoContainerStyle}>
                <Col span={6} offset={2}>Last Since: </Col>
                    <Col span={12}></Col>
                </Row>
            </Col>
            <Col></Col>

        </Row>
    )
}