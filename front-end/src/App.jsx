
import { Layout, Row ,Col } from "antd"
import { Route, Routes, Outlet, Link , useNavigate} from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"





const { Header, Sider, Content, Footer} = Layout;



export default function App(){
   const navigate = useNavigate();
   
    const otherNavigate = (path)=>{
       navigate(path);
   }
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