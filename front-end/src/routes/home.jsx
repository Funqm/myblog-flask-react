import { message, Layout, Col, Row, Dropdown, Menu } from "antd"
import axios from "../http";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import NewPost from "../components/Post/newPost";
import Pagination from "../components/Pagation";
import styled from "styled-components";
import { useSelector } from "react-redux";
import PostCard from "../components/Post/postCard";
import { EllipsisOutlined } from '@ant-design/icons'

const PanelHeader = styled.div`
    background-color: skyblue;
    height: 50px;
    line-height: 50px`
const PanelBody = styled.div`
    background-color: hotpink;`

const paginationMenu = (
    <Menu>
        <Menu.Item key="5">
            <Link to="/home" state={{ perPage: 5 }}>每页5篇</Link>
        </Menu.Item>
        <Menu.Item key="10">
            <Link to="/home" state={{ perPage: 10 }}>每页10篇</Link>
        </Menu.Item>
        <Menu.Item key="20">
            <Link to="/home" state={{ perPage: 20 }}>每页20篇</Link>
        </Menu.Item>
    </Menu>

);
const { Content } = Layout;
export default function Home() {
    const location = useLocation()
    const [posts, setPosts] = useState('')
    const [iterPages, setIterPages] = useState([])
    const isAuthed = useSelector(state => state.user.isAuthed)

    useEffect(() => {
        getPosts();
    }, [location])

    useEffect(() => {
        if (!posts) {
            return;
        }
        let arr = [1, 2, posts._meta.page - 2, posts._meta.page - 1, posts._meta.page, posts._meta.page + 1, posts._meta.page + 2, posts._meta.total_pages - 1, posts._meta.total_pages];
        arr = arr.filter(item => item > 0 && item <= posts._meta.total_pages)
        arr = [...new Set(arr)];
        if (posts._meta.page + 2 < posts._meta.total_pages - 2) {
            arr.splice(-2, 0, 'NaN')
        }
        if (posts._meta.page - 3 > 2) {
            arr.splice(2, 0, 'NaN')
        }
        setIterPages([...arr])
        
    }, [posts])


    const getPosts = () => {
        let page = 1;
        let perPage = 3;

        if (location.state && location.state.page != 'undefine') {
            page = location.state.page;
        }
        if (location.state && location.state.perPage != 'undefine') {
            
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
            <NewPost></NewPost>
            <PanelHeader >
                {posts ? <Row justify="space-between">
                    <Col span="12">All Posts(共{posts._meta.total_items}篇， {posts._meta.total_pages}页）</Col>
                    <Col span="1">
                        <Dropdown overlay={paginationMenu} trigger={['click']}>
                            <EllipsisOutlined />
                        </Dropdown>
                    </Col>
                </Row> : null}
            </PanelHeader>
            <PanelBody>
                {posts ? posts.items.map((post, index) => <PostCard post={post} key={index} />) : null}
            </PanelBody>

            <Pagination iterPages={iterPages}></Pagination>

        </Content>
    )
}