import { Row, Col } from "antd"
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import UserCard from "./userCard";


export default function Followeds({ }) {
    const { userId } = useOutletContext();
    const [followeds, setFolloweds] = useState([]);
    const location = useLocation()

    useEffect(() => {
        getFolloweds(userId);
        //console.log(followers)

    }, [location])
    const getFolloweds= (id) => {
        let page = 1, perPage = 5
        if (location.stat && location.state.page != 'undefine') {
            page = location.state.page;
        }
        if (location.state && location.state.perPage != 'undefine') {
            perPage = location.state.perPage;
        }

        const path = `/users/${id}/followeds/?page=${page}&per_page=${perPage}`
        axios.get(path)
            .then(response => {
                setFolloweds(response.data)
    
            })
            .catch(error => {
                console.error(error);
            })
    }
    return (
        <Col>
            {followeds.items
                ? followeds.items.map(followed => {
                    return <UserCard user={followed} key={followed.id}></UserCard>
                })
                : null}

        </Col>
    )
}