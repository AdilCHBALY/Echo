"use client"

import { useEffect, useState } from "react"
import { CreateServerModal } from "../modals/CreateServerModal"
import { InviteModal } from "../modals/InviteModal"



const ModalProvider = () => {

    const [mounted,setMounted]=useState(false)

    useEffect(()=>{
        setMounted(true)
    },[])

    if(!mounted) return null

    return (
        <>
            <CreateServerModal />
            <InviteModal />
        </>
    )
}

export default ModalProvider