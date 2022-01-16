import { Avatar, Row, Col } from "antd"
import { useEffect } from "react"
export default function UserCard({ user }) {
    useEffect(() => [
        console.log(user)
    ])
    return (
        <Row span="24" gutter="10" style={{ margin: "10px" }}>
            <Col offset="2" span="4">
                <Avatar src={user._links.avatar}></Avatar>
            </Col>
            <Col span="18">
                <Row>{user.username}</Row>
            </Col>
        </Row>
    )
}