import {Row} from 'antd'
import { useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router'

const Jumper = styled.span`
    display: inline;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    width: 50px;
    text-align: center;
    margin: 5px;
    background-color: yellow`

export default function Pagination({iterPages}){
    const navigate = useNavigate()
    return (
        <Row>
            {  iterPages.map((item, index) =>{
                
                return <Jumper key={index} onClick={()=>navigate('/home', {state: {page: item}})}>{item}</Jumper>
            })}
            
            
        </Row>
    )

}