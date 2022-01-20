import styled from "styled-components"
import { Row, Col, Avatar, Button, Popconfirm, message } from "antd"
import { MessageOutlined, LikeOutlined } from "@ant-design/icons"
import moment from "moment"
import NewComment from "./newComment"
import { useEffect, useState } from "react"
import Comments from "./comments"
import { useSelector } from "react-redux"
import axios from "../../http"
import { useNavigate } from "react-router-dom"


const Cards = styled.div``
const Card = styled.div`
    height: 150px;
    background-color: white;
    padding:15px;
    border-radius: 5px;
    margin-top: 10px
    `
const Username = styled.h1`
    font-size: 18px;
    margin-bottom: 0px`
const DateInfo = styled.p`
    color: grey;
    font-size:14px`
const Comment = styled.p`
    font-size: 16px`

const IconContainer = styled.span`
    margin-right: 20px;
    cursor: pointer;
    font-size: 20px;
    `
const Editor = styled.div`
    padding:20px;
`
const SubComments = styled.div``

export default function CommentCard({ comment, depth }) {
    const [showEditor, setShowEditor] = useState(false);
    const userId = useSelector(state => state.user.userId);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(comment)
    })

    function deleteComment(comment){
        const path= `/comments/${comment.id}`
        axios.delete(path)
        .then(response => {
            message.info("success delete ");
            navigate('/posts/' + comment.post.id);
        })
        .catch(error => {
            console.error(error);
        })
    }

    return (
        <Cards>
            <Card>
                <Row style={{ height: "100%" }} >
                {comment.author.id === userId
                        ?<Popconfirm title="Are you sure？" onConfirm={() =>deleteComment(comment)} placement="rightTop">
                        <Button style={{position: "absolute", right: "0"}} danger>delete</Button>
                        </Popconfirm> 
                        : null}
                   
                    <Col span="2" >
                        <Avatar size={50} shape="square"></Avatar>
                    </Col>
                    <Col>
                        <Username>{comment.author.username}</Username>
                        <DateInfo>{moment(comment.timestamp).format('LLL')}</DateInfo>
                        <Comment dangerouslySetInnerHTML={{__html:comment.body}}></Comment>

                        <IconContainer><LikeOutlined /></IconContainer>
                        <IconContainer><MessageOutlined onClick={() => setShowEditor(true)} /></IconContainer>
                    </Col>

                </Row>
            </Card>
            {showEditor
                ? <Editor>
                    <NewComment postId={comment.post.id} parent={comment} setShowEditor={setShowEditor} />
                </Editor>
                : null
            }

            <SubComments>
                {comment.descendants
                    ? <Comments comments={comment.descendants} depth={depth + 1}></Comments>
                    : null}
            </SubComments>


        </Cards>
    )
}