import { Row, Col } from "antd";
import axios from "../../http";
import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import PostCard from "./postCard";
import { useForm } from "antd/lib/form/Form";

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const location = useLocation();
    const { userId } = useOutletContext()


    useEffect(() => {
        getUserPosts(userId);

    }, [location])

    function getUserPosts(id) {
        let page = 1, perPage = 5;
        if (location.state && location.state.page != 'undefine') {
            page = location.state.page;
        }
        if (location.state && location.state.perPage != 'undefine') {
            perPage = location.state.page;
        }

        const path = `/users/${id}/posts/?page=${page}&per_page=${perPage}`;
        axios.get(path)
            .then(response => {
                setPosts(response.data)
                console.log(response.data)
            })
            .catch(error => {
                console.error(error)
            })
    }
    return (
        <Col>
            {posts.items
                ? posts.items.map(post =>
                    <PostCard key={post.id} post={post} />)
                : null}
        </Col>
    )
}
