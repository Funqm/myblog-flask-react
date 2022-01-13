import "./Navbar.css"
import { useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom"
import {useSelector, useDispatch } from 'react-redux'
import { login, logout } from "../../store/userSlice"
import { Menu, Layout, Input } from 'antd'



const { SubMenu } = Menu
const { Header } = Layout
const { Search } = Input

export default function Navbar(props) {
    const navigate = useNavigate();
    const userId = useSelector(state => state.user.userId)
    const isAuthed = useSelector(state => state.user.isAuthed)
    const dispatch  = useDispatch();
    const location = useLocation();
    
    return (
        <div className="navbar">
            <div className="navbar-left">
                <Menu mode="horizontal">
                    <Menu.Item key="icon">
                        Icon
                    </Menu.Item>
                    <Menu.Item key="home">
                        Home
                    </Menu.Item>
                    <Menu.Item key="explore">
                        Explore
                    </Menu.Item>
                </Menu>
            </div>
            <form className="navbar-search">
                <Search
                    placeholder={userId}
                    allowClear
                    enterButton="Search"
                    size="large"
                onSearch={()=>{
                    console.log(location)
                }}
                />
            </form>
            <div className="navbar-right">
                <Menu className="navbar-right" mode="horizontal">
                    {!isAuthed ?
                        <Menu.Item key="Login" onClick={() => {
                            navigate("/login")
                        }}>
                            Login
                        </Menu.Item> :
                        <Menu.Item key="Logout" onClick={() => {
                            dispatch(logout())
                            navigate("/login")
                        }}>
                            Logout
                        </Menu.Item>}


                    <Menu.Item key="message">
                        Message
                    </Menu.Item>
                    <Menu.Item key="profile" onClick={()=>{
                        navigate('/profile/' + userId)
                    }}>
                        Profile
                    </Menu.Item>

                </Menu>
            </div>
        </div>
    )
}

