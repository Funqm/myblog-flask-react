import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { EyeOutlined, MessageOutlined, ClockCircleOutlined, MessageFilled } from "@ant-design/icons"
import MDEditor from "@uiw/react-md-editor"
import styled from "styled-components"
import axios from "../http"
import moment from "moment"
import NewComment from "../components/Comment/newComment"
import { PaginationHeader, PaginationFooter } from "../components/Pagation"
import Comments from "../components/Comment/comments"

const PostContainer = styled.div`
    height: 100%;
    background-color: #ebae56;
    margin-top:20px;
    border-radius: 5px;
    padding: 5px;
`
const Title = styled.h1`
    font-size: 40px;11
    margin: 10px;
`
const Info = styled.p`
    border-bottom: solid 1px #fff;
    font-size: 16px;
    margin-bottom: 50px;
`
const ViewsAndComment = styled.span`
    float: right;
    margin-left: 30px
`

const CommentsContainer = styled.div`
    margin-top:20px;
`



export default function Post() {
    const [post, setPost] = useState();
    const [comments, setComments] = useState();
    const params = useParams();
    useEffect(() => {
        if (!params.postId) {
            return;
        }
        getPost(params.postId);
        getComments(params.postId);
    }, [params])

    function getPost(postId) {
        const path = `/posts/${postId}`;

        axios.get(path)
            .then(response => {
                console.log(response.data);
                setPost(response.data);
            })
            .catch(error => {
                console.error(error);
            })
    }

    function getComments(postId){
        const path=`/posts/${postId}/comments/`
        axios.get(path)
        .then(response => {
            setComments(response.data.items)
            console.log(response.data.items);
        })
        .catch(error => {
            console.error(error);
        })
    }
    return (
        post ? (
            <div>
                <PostContainer>
                    <Title>{post.title}</Title>
                    <Info>
                        <span >{post.author.username}  / </span>
                        <span> <ClockCircleOutlined /> {moment(post.time_samp).format('LLL')}</span>
                        <ViewsAndComment><EyeOutlined /> {post.views}</ViewsAndComment>
                        <ViewsAndComment><MessageOutlined /></ViewsAndComment>

                    </Info>
                    <MDEditor.Markdown source={post.body}></MDEditor.Markdown>
                    
                </PostContainer>
               <CommentsContainer>
               <PaginationHeader type="comment"></PaginationHeader>
               <NewComment postId={post.id}></NewComment>
               </CommentsContainer>
               <Comments comments={comments} depth={0}></Comments>
            </div>
        ) : null
    )
}