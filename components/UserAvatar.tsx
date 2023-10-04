"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "./ui/avatar"

interface UserAvatarProps{
    src?:string,
    className?:string
}

const UserAvatar = ({src,className}:UserAvatarProps) => {
    return (
        <Avatar className={cn("h-7 w-7 md:w-10 md:h-10",className)}>
            <AvatarImage src={src} />
        </Avatar>
    )
}

export default UserAvatar