import axios from "../../http";
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import CommentCard from "./commentCard";

const CommentsContainer = styled.div`

`

export default function Comments({comments, depth}){    
    const location = useLocation();

   
    return (
        <CommentsContainer style={{paddingLeft: depth + '0px'}}>
            {comments
            ? comments.map(item => 
                    <CommentCard key={item.id} comment={item} depth={depth + 3} ></CommentCard>
                    )
            : null}
        </CommentsContainer>
    )
}