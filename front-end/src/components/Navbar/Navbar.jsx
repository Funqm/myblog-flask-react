import { useEffect, useState } from 'react'
import { HomeFilled, FireFilled, CompassFilled, MailFilled, MessageFilled, LoginOutlined, LogoutOutlined, RadarChartOutlined } from "@ant-design/icons"
import { useLocation, useNavigate, Link, NavLink } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { login, logout } from "../../store/userSlice"
import { Menu, Layout, Input, Row, Col, Avatar, Dropdown } from 'antd'
import styled from 'styled-components'
import axios from '../../http'


const SearchContainer = styled.div`
    height: 100%;
    display: flex;
    align-items: center`

const iconStlye1 = {
    fontSize: "30px",
    color: "#884077"
}

const iconStlye2 = {
    fontSize: "20px",
    color: "#884077"
}

const { Header } = Layout
const { Search } = Input


export default function Navbar(props) {
    const navigate = useNavigate();
    const [authedUser, setAuthedUser] = useState(); 
    const userId = useSelector(state => state.user.userId)
    const isAuthed = useSelector(state => state.user.isAuthed)
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(()=>{
        getAuthedUser();
    },[location])
    

    function getAuthedUser(){
        const path=`/users/${userId}`;
        axios.get(path)
        .then(response => {
            console.log(response.data)
            setAuthedUser(response.data);
        })
        .catch(error => {
            console.log(error);
        })

    }

    const menu = (
        <Menu style={{ width: "150px",  }} >
            <Menu.Item key="1" >
                <Link to={`/profile/${userId}`} style={{fontSize: "16px"}}><RadarChartOutlined style={iconStlye2}></RadarChartOutlined>  Profile</Link>
            </Menu.Item>
            {!isAuthed
                ?
                <Menu.Item key="2">
                    <Link to="/login" style={{fontSize: "16px"}}><LoginOutlined style={iconStlye2}></LoginOutlined> Login</Link>
                </Menu.Item>
                :
                <Menu.Item key="3" onClick={() => {
                    dispatch(logout());
                    navigate('/login')
                }}
                style={{fontSize: "16px"}}>
                    <LogoutOutlined style={iconStlye2}></LogoutOutlined> Logout
                </Menu.Item>
            }
        </Menu>
        )
    return (
        <Row className="navbar" >
            <Col span="4" style={{ textAlign: "center", lineHeight: '64px' }}>
                <FireFilled style={{ fontSize: "30px" }}></FireFilled>
            </Col>
            <Col span="8" >
                <SearchContainer>
                    <Search

                        placeholder={isAuthed.toString()}
                        allowClear
                        enterButton="Search"
                        size="large"
                    />
                </SearchContainer>

            </Col>
            <Col span="10" offset="2">
                <Row >
                    <Col span="4" style={iconStlye1}><HomeFilled onClick={() => navigate("/")}></HomeFilled></Col>
                    <Col span="4" style={iconStlye1}><CompassFilled></CompassFilled></Col>
                    <Col span="4" style={iconStlye1}><MailFilled></MailFilled></Col>
                    <Col span="4" style={iconStlye1}><MessageFilled></MessageFilled></Col>
                    <Col span="4" style={iconStlye1}>
                        <Dropdown overlay={menu} arrow style={{fontSize: "30px"}}>
                            <Avatar src={authedUser ? authedUser._links.avatar : null}></Avatar>
                        </Dropdown>
                    </Col>
                </Row>

            </Col>
        </Row>
    )
}

