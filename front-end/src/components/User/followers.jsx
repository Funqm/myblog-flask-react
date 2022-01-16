import { Row, Col } from "antd"
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import UserCard from "./userCard";


export default function Followers({ }) {
    const { userId } = useOutletContext();
    const [followers, setFollowers] = useState([]);
    const location = useLocation()

    useEffect(() => {
        getFollowers(userId);
        //console.log(followers)

    }, [location])
    const getFollowers = (id) => {
        let page = 1, perPage = 5
        if (location.stat && location.state.page != 'undefine') {
            page = location.state.page;
        }
        if (location.state && location.state.perPage != 'undefine') {
            perPage = location.state.perPage;
        }

        const path = `/users/${id}/followers/?page=${page}&per_page=${perPage}`
        axios.get(path)
            .then(response => {
                setFollowers(response.data)
    
            })
            .catch(error => {
                console.error(error);
            })
    }
    return (
        <Col>
            {followers.items
                ? followers.items.map(follower => {
                    return <UserCard user={follower} key={follower.id}></UserCard>
                })
                : null}

        </Col>
    )
}