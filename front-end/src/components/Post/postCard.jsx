import { Row, Col, Avatar } from "antd"
import { useEffect } from "react"
import moment from "moment"

export default function PostCard({post}){
   
    return (
        <Row style={{height: '200px'}}>
            <Col span="3" offset="1">
                <Avatar src={post.author._links.avatar} size={50}></Avatar>
            </Col>
            <Col span="20">
                <Row>{post.title}</Row>
                <Row>{moment(post.time_samp).format('LLL')}</Row>
                <Row>{post.author.username}</Row>
                <Row>{post.summary}</Row>
                <Row>
                    <Col>views:{post.views}</Col>
                    <Col>like{}</Col>
                    <Col>message</Col>
                    <Col>阅读全文</Col>
                </Row>
            </Col>
        </Row>
    )
}