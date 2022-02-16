import MDEditor from "@uiw/react-md-editor"
import { useEffect, useState } from "react"
import { Button, message } from "antd";
import { RocketFilled } from "@ant-design/icons";
import axios from "../../http";
import { useNavigate } from "react-router-dom";

export default function NewComment({ postId, parent, setShowEditor }) {
    const [comment, setComment] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{}, [comment])
    const submitComment = () => {
        if (comment == "") {
            message.info("评论不能为空");
            return;
        }
        const path = "/comments/"
        const payload = parent ? {
            body: `<a href=/user/${parent.author.id}>@${parent.author.username} </a>` + comment,
            post_id: postId,
            parent_id: parent.id
        } : {
            body: comment,
            post_id: postId,
        }

        axios.post(path, payload)
            .then(response => {
                console.log(response.data);
                setComment('')
                if(setShowEditor){
                    setShowEditor(false);
                }
                navigate(`/posts/${postId}`)

            })
            .catch(error => {
                console.log(error)
            })
    }


    return (
        <div>
            <RocketFilled style={{ position: "absolute", left: "-40px", fontSize: "50px" }}></RocketFilled>
            <MDEditor
                value={comment}
                onChange={setComment}
                preview="edit"
                height='150'>
            </MDEditor>

            <Button onClick={() => submitComment()}>Submit</Button>
            <Button onClick={()=>{
                if(setShowEditor){
                    setShowEditor(false);
                }
                setComment('');
            }}>Cancel</Button>
        </div>
    )
}