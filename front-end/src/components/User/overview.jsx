import { Row, Col , Input} from "antd"
import moment from "moment";
import { useEffect } from "react";
import { useOutletContext } from "react-router"

const infoContainerStyle = {
    margin: "10px 0",
    backgroundColor:  "grey",
    padding: "0 20px"
}
export default function Overview() {
    const {user, setUser, editState} = useOutletContext();
    
    return (
        <div>{
            user ?
                <div style={{padding: "0 40px"}}>

                    <Row gutter={10} style={infoContainerStyle} >
                        <Col span={8} offset={2}>USER: </Col>
                        <Col span={12}>{user.username}</Col>
                    </Row>
                    <Row gutter={10} style={infoContainerStyle} >
                        <Col span={8} offset={2}>Name: </Col>
                        <Col span={12}>{editState ? <Input placeholder={user.name} size="large" onInput={(event) => setUser({ ...user, name: event.target.value })}></Input> : user.name}</Col>
                    </Row>
                    <Row gutter={10} style={infoContainerStyle}>
                        <Col span={8} offset={2}>Email: </Col>
                        <Col span={12}>{editState ? <Input placeholder={user.email} onInput={(event) => setUser({ ...user, email: event.target.value })}></Input> : user.email}</Col>
                    </Row>
                    <Row gutter={10} style={infoContainerStyle}>
                        <Col span={8} offset={2}>Location: </Col>
                        <Col span={12}>{editState ? <Input placeholder={user.location} onInput={(event) => setUser({ ...user, location: event.target.value })}></Input> : user.location}</Col>
                    </Row>
                    <Row gutter={10} style={infoContainerStyle}>
                        <Col span={8} offset={2}>About Me: </Col>
                        <Col span={12}>{editState ? <Input style={{ backgroundColor: "" }} placeholder={user.about_me} onInput={(event) => setUser({ ...user, about_me: event.target.value })}></Input> : user.about_me}</Col>
                    </Row>

                    <Row gutter={10} style={infoContainerStyle}>
                        <Col span={8} offset={2}>Member Since: </Col>
                        <Col span={12}>{moment(user.member_since).format('LLL')}</Col>
                    </Row>
                    <Row gutter={10} style={infoContainerStyle}>
                        <Col span={8} offset={2}>Last Since: </Col>
                        <Col span={12}>{moment(user.last_seen).fromNow()}</Col>
                    </Row>

                </div> : null}
        </div>
    )
}