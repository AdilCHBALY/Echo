"use client"

import { ServerWithMembersWithProfiles } from "@/types"
import { ChannelType, MemberRole } from "@prisma/client"
import ActionTip from "../ActionTip"
import { Plus, Settings } from "lucide-react"
import { useStoreModal } from "@/hooks/use-modal"

interface ServerSectionProps{
    label:string
    role:MemberRole | undefined
    sectionType:"channels"|"members"
    channelType?:ChannelType
    server?:ServerWithMembersWithProfiles
}

const ServerSection = ({
    label,
    role,
    sectionType,
    channelType,
    server
}:ServerSectionProps) => {

    const {onOpen}=useStoreModal()

    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-white dark:text-zinc-400">
                {label}  
            </p>
            {role !== MemberRole.GUEST && sectionType === 'channels' && (
                <ActionTip title="Create Channel" side="top">
                    <button 
                    onClick={()=>onOpen("createChannel",{channelType})}
                    className="text-white hover:text-gray-200 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                        <Plus className="h-4 w-4" />
                    </button>
                </ActionTip>
            )}
            {role === MemberRole.ADMIN && sectionType === 'members' && (
                <ActionTip title="Manage Members" side="top">
                    <button 
                    onClick={()=>onOpen("members",{server})}
                    className="text-white hover:text-gray-200 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                        <Settings className="h-4 w-4" />
                    </button>
            </ActionTip>                
            )}
        </div>
    )
}

export default ServerSection