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
        <Layout>
        <Header className="header" style={{backgroundColor: "white"}}>
            <Navbar 
                 />
        </Header>

        <Content>
        <Row><Col span="20" offset="2"><Outlet /></Col></Row>
        </Content>
        </Layout>
    )
}