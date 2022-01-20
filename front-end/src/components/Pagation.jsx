import { Row, Col, Menu, Dropdown } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate, Link } from 'react-router-dom'
import { EllipsisOutlined } from '@ant-design/icons'

const Jumper = styled.span`
    display: inline;
    height: 50px;
    border-radius: 50px;
    line-height: 50px;
    font-size: 20px;
    width: 50px;
    text-align: center;
    margin: 5px;
    cursor: pointer;
    background-color: #e96960`

const PanelHeader = styled.div`
    border-radius: 5px;
    background-color: #923a7a;
    margin-bottom: 10px;
    padding-left: 10px;
    height: 50px;
    line-height: 50px;
    color: #f9f9f9
    `


let perPage = 5;

const paginationMenu =(
    <Menu onClick={(e) => perPage = e.key}>
        <Menu.Item key="5">
        {'post' == "post"
        ? <Link to="/home" state={{ perPage: 5 }}>每页5篇</Link>
        : null}
            
        </Menu.Item>
        <Menu.Item key="10">
            <Link to="/home" state={{ perPage: 10 }}>每页10篇</Link>
        </Menu.Item>
        <Menu.Item key="20">
            <Link to="/home" state={{ perPage: 20 }}>每页20篇</Link>
        </Menu.Item>
    </Menu>
);




export  function PaginationFooter({posts}) {
    const [iterPages, setIterPages] = useState([])

    const navigate = useNavigate()

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
        console.log(posts)
        
    }, [posts])
    return (
        <Row style={{margin: "20px 0"}}>
            {iterPages.map((item, index) => {
                return (   <Jumper key={index}
                        onClick={() => navigate('/home', { state: { page: item } })}>{item}
                    </Jumper>)
            })}
        </Row>
    )
}

export function PaginationHeader({ total_items, total_pages, type }) {
    return (
        <PanelHeader>
            {<Row justify="space-between">
                {type == "post" 
                ? <Col span="12">All Posts (共{total_items}篇, {total_pages}页）</Col>
                : <Col span="12">All Comments </Col>}
                <Col span="1">
                    <Dropdown overlay={paginationMenu} trigger={['click']}>
                        <EllipsisOutlined />
                    </Dropdown>
                </Col>
            </Row>}
        </PanelHeader>
    )
}