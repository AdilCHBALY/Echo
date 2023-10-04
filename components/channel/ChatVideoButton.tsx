"use client"

import qs from "query-string"
import { usePathname,useRouter,useSearchParams } from "next/navigation"
import { Video,VideoOff } from "lucide-react"
import ActionTip from "../ActionTip"


const ChatVideoButton = () => {

    const pathname = usePathname()
    const router=useRouter()
    const searchParams = useSearchParams()

    const isVideo = searchParams?.get("video")

    const oncClick = ()=>{
        const url = qs.stringifyUrl({
            url:pathname || "",
            query:{
                video:isVideo ? undefined : true
            }
        },{skipNull:true})

        router.push(url)
    }

    const Icon = isVideo ? VideoOff : Video
    const tooltipLabel = isVideo ? "End video call ": "Start video call"


    return (
        <ActionTip side="bottom" title={tooltipLabel}>
            <button onClick={oncClick} className="hover:opacity-75 transition mr-4">
                <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            </button>
        </ActionTip>
    )
}

export default ChatVideoButton