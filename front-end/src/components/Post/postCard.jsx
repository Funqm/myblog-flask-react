import { Row, Col, Avatar, Button, Popconfirm, message } from "antd"
import { EyeOutlined, LikeOutlined, MessageOutlined } from "@ant-design/icons"
import { useEffect } from "react"
import axios from '../../http'
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import moment from "moment"
import styled from "styled-components"
import { func } from "prop-types"

const PostTitle = styled.div`
    font-size: 30px;
    height: 40px;
    font-weight: 500;
`
const PostDateInfo = styled.div`
    font-size: 12px;
    color: grey;
    `
const PostSummary = styled.p`
    font-size:16px;
    height: 100px;
    background-color: #efe9ea;
    border-radius: 5px;
    `
const DeleteButton = styled.button`
`



export default function PostCard({ post }) {
    const userId = useSelector(state => state.user.userId)
    const navigate = useNavigate();

    function deletePost(postId){
        const path = `/posts/${postId}`;
    
        axios.delete(path)
        .then(response => {
            message.info("删除成功")
            navigate('/');
    
        })
        .catch(error => {
            console.error(error)
        })
        
    }

    return (
        <Row style={{ height: '200px', margin: "10px 0", backgroundColor: "white", borderRadius: "5px", padding: "0 10px" }}>
            <Col span="3" offset="0" style={{ textAlign: "center" }}>
                <Avatar src={post.author._links.avatar} size={60} style={{ margin: "10px 0" }} shape="square"></Avatar>
                <h4>{post.author.username} </h4>
            </Col>
            <Col span="21">
                <PostTitle>{post.title}
                    {post.author.id === userId
                        ?<Popconfirm title="确定删除这篇博文？" onConfirm={() =>deletePost(post.id)} placement="rightTop">
                        <Button danger size="small" style={{ float: 'right', marginTop: '5px' }} >删除</Button>
                        </Popconfirm> 
                        : null}
                </PostTitle>
                <PostDateInfo> {moment(post.time_samp).format('LLL')}</PostDateInfo>
                <PostSummary>{post.summary}</PostSummary>
                <Row justify="end" gutter="20" style={{ fontSize: '18px', color: "#773a7b" }}>
                    <Col><EyeOutlined></EyeOutlined> {post.views}</Col>
                    <Col><LikeOutlined></LikeOutlined>{ }</Col>
                    <Col><MessageOutlined></MessageOutlined></Col>
                    <Col
                     style={{ cursor: "pointer" , fontSize: "17px"}}
                     onClick={()=>navigate(`/posts/${post.id}`)}
                    >阅读全文</Col>
                </Row>
            </Col>
        </Row>

    )
}