import { message, Layout, Col, Row, Dropdown, Menu } from "antd"
import axios from "../http";
import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import NewPost from "../components/Post/newPost";
import Pagination from "../components/Pagation";
import styled from "styled-components";
import { useSelector } from "react-redux";
import PostCard from "../components/Post/postCard";
import { PaginationFooter, PaginationHeader } from "../components/Pagation";

const PanelBody = styled.div``


const { Content } = Layout;
export default function Home() {
    const [posts, setPosts] = useState('')
    const isAuthed = useSelector(state => state.user.isAuthed)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        getPosts();
        if(!isAuthed){
            message.info("请先登陆")
            //navigate('/login')
        }
    }, [location])
   


    const getPosts = () => {
        let page = 1;
        let perPage = 5;
        
        if (location.state && location.state.page) {
            page = location.state.page;
        }
        if (location.state && location.state.perPage) {
            perPage = location.state.perPage;
        }

        const path = `posts?page=${page}&per_page=${perPage}`;
        axios.get(path)
            .then(response => {
                setPosts({ ...response.data })

            })
            .catch(error => {
                console.log(error)
            })

    }
    return (
        <Content>
            <NewPost ></NewPost>
            {posts 
            ? <PaginationHeader 
                total_items={posts._meta.total_items}
                total_pages={posts._meta.total_pages}
                type="post"
            ></PaginationHeader> : null}
            <PanelBody>
                {posts ? posts.items.map((post, index) => <PostCard post={post} key={index} />) : null}
            </PanelBody>

            <PaginationFooter posts={posts}></PaginationFooter>

        </Content>
    )
}