import { useState } from "react"

export default function Alert(props){

    return (
        <div className={"alert alert-" + props.variant} >
        {props.message}
        </div>
    )
}