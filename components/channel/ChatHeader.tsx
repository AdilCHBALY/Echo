

import { Hash, Menu } from "lucide-react"
import MobileToggle from "../MobileToggle"
import UserAvatar from "../UserAvatar"
import SocketIndicator from "../SocketIndicator"
import ChatVideoButton from "./ChatVideoButton"

interface ChatHeaderProps{
    serverId:string
    name:string
    type:"channel" | "conversation"
    imageUrl?:string
}

const ChatHeader = ({
    serverId,
    name,
    type,
    imageUrl
}:ChatHeaderProps) => {
    return (
        <div className="text-md font-semibold px-3 bg-primary/70 dark:bg-primary-foreground  flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            <MobileToggle serverId={serverId} />
            {type==="channel" && (
                <Hash className="w-5 h-5 text-gray-200 dark:text-zinc-400 mr-2" />
            )}
            {type==="conversation" && (
                <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
            )}
            <p className="font-semibold text-md text-white">
                {name}
            </p>
            <div className="ml-auto flex items-center">
                {type==="conversation" && (
                    <ChatVideoButton />
                )}
                <SocketIndicator />
            </div>
        </div>
    )
}

export default ChatHeader