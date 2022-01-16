import { Row, Col, Avatar, message, Button, Input } from "antd";
import axios from "../http";
import { useState, useEffect } from "react";
import { NavLink,useOutletContext, useLocation, useNavigate, useParams, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import moment from "moment";
import { configureStore } from "@reduxjs/toolkit";





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
        is_following: '',
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
        if (authedUserId !== 0 && params.userId === 0) {
            navigate(`/profile/${authedUserId}`)
        }
        const userId = params.userId;
        getUser(userId);
        if (params.userId != authedUserId) {
            setCanEdit(false);
        } else {
            setCanEdit(true);
        }
    }, [params])

    function getUser(id) {

        const path = `/users/${id}`

        axios.get(path)
            .then((response) => {
                setUser({ ...response.data })
            })
            .catch(error => {
                console.error(error)
                message.info(id)
            })
    }

    function submitEdit() {
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

    function follow(){
        const path = `/follow/${params.userId}`

        axios.get(path)
        .then(response => {
            message.info('success follow');
            navigate(`/profile/${params.userId}`)
            //console.log(response);
        })
        .catch(error => {
           // console.log(error);
        })
    }

    function unfollow(){
        const path = `/unfollow/${params.userId}`;

        axios.get(path)
        .then(response => {
            message.info("succes unfollow");
            navigate(`/profile/${params.userId}`);
        })
        .catch(error => {

        })
    }
    return (
        <Row justify="center">
            <Col span="20" style={{ backgroundColor: "hotpink", fontSize: '20px' }}>
               <Row>
                   <Col> {canEdit ? editState ?
                    (<div>
                        <Button type='primary' onClick={() => submitEdit()}>保存</Button>
                        <Button type='primary'>取消</Button>
                    </div>)
                    : <Button type='primary' onClick={() => setEditState(true)}>编辑</Button> : null}
                    </Col>
                    {params.userId != authedUserId ?
                    <Col>
                        {user.is_following ? 
                        <Button type="primary" onClick={unfollow}>unfollow</Button>
                        :<Button type="primary" onClick={follow}>follow</Button>
                        }
                    </Col> : null}
               </Row>
                <Row justify="center" style={{ padding: "20px 0 10px", borderBottom: "1px solid gray" }}>
                    <Avatar size={128} shape="square" src={user._links.avatar}></Avatar>
                </Row>
                <Row justify="space-around">
                    <Col>
                        <NavLink to="">overview</NavLink>
                    </Col>
                    <Col>
                        <NavLink to="followers">followers</NavLink>
                    </Col>
                    <Col>
                        <NavLink to="followeds">followeds</NavLink>
                    </Col>
                    <Col>
                        <NavLink to="posts">posts</NavLink>
                    </Col>

                </Row>
               
                <Outlet context={{user, setUser, editState, userId: params.userId}}/>
            </Col>
            <Col></Col>

        </Row>
    )
}