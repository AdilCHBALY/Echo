"use client"

import { cn } from "@/lib/utils"
import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { Crown, Shield, ShieldAlert, ShieldCheck, Sword } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import UserAvatar from "../UserAvatar"


interface ServerMemberProps{
    member:Member & {profile:Profile}
    server:Server
}

const roleIconMap={
    [MemberRole.GUEST]:<Shield className="mr-2 h-4 w-4 text-emerald-500"/>,
    [MemberRole.MODERATOR]:<Sword className="mr-2 h-4 w-4 text-blue-800"/>,
    [MemberRole.ADMIN]:<Crown className="mr-2 h-4 w-4 text-rose-500"/>,
}

const ServerMember = ({
    member,
    server
}:ServerMemberProps) => {
    const params = useParams()
    const router= useRouter()

    const icon = roleIconMap[member.role]


    const onClick = () => {
        router.push(`/servers/${params?.serverId}/conversation/${member.id}`)
    }

    return (
        <button 
        onClick={onClick}
        className={cn('group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
        )}>
            <UserAvatar src={member.profile.imageUrl} 
                className="h-8 w-8 md:w-8 md:h-8"
            />
            <p className={cn('font-semibold text-sm text-white group-hover:text-gray-200 dark:group-hover:text-zinc-300 transition',
            params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-zinc-400"
            )}>
            {member.profile.name}
            </p>
            {icon}
        </button>
    )
}

export default ServerMember