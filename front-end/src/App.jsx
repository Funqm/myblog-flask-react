import { useState } from "react"
import { Layout, Row ,Col } from "antd"
import { Route, Routes, Outlet, Link , useNavigate} from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import Register from "./routes/Register"
import Login from "./routes/Login"
import styled from "styled-components"




const { Header, Sider, Content, Footer} = Layout;



export default function App(){
   
    return (
        <Layout style={{backgroundColor: "#9c3878", height: '100%'}}>
        <Header  className="header" style={{backgroundColor: "white", padding: "0"}}>
            <Navbar 
                 />
        </Header>

        <Content style={{height: "100%"}}>
        <Row style={{height: "100%"}}><Col span="16" offset="4"><Outlet /></Col></Row>
        </Content>
        </Layout>
    )
}