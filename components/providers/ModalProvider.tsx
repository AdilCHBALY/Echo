"use client"

import { useEffect, useState } from "react"
import { CreateServerModal } from "../modals/CreateServerModal"
import { InviteModal } from "../modals/InviteModal"
import { EditServerModal } from "../modals/EditServerModal"
import { MembersModal } from "../modals/MembersModal"
import { CreateChannelModal } from "../modals/CreateChannelModal"
import { LeaveModal } from "../modals/LeaveModal"
import { DeleteServerModal } from "../modals/DeleteServerModal"
import { DeleteChannelModal } from "../modals/DeleteChannelModal"
import { EditChannelModal } from "../modals/EditChannelModal"
import { MessageFileModal } from "../modals/MessageFileModal"
import { DeleteMessageModal } from "../modals/DeleteMessageModal"



const ModalProvider = () => {

    const [mounted,setMounted]=useState(false)

    useEffect(()=>{
        setMounted(true)
    },[])

    if(!mounted) return null

    return (
        <>
            <MessageFileModal />
            <DeleteMessageModal />
            <CreateServerModal />
            <EditChannelModal />
            <EditServerModal />
            <MembersModal />
            <CreateChannelModal />
            <LeaveModal />
            <DeleteServerModal />
            <DeleteChannelModal />
            <InviteModal />
        </>
    )
}

export default ModalProvider