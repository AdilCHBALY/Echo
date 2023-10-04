"use client"

import ActionTip from "../ActionTip"
import { cn } from "@/lib/utils"
import { useParams,useRouter } from "next/navigation"
import Image from "next/image"

interface NavigationItemProps{
    id:string
    imageUrl:string
    name:string
}

const NavigationItem:React.FC<NavigationItemProps> = ({
    id,
    imageUrl,
    name
}) => {
    const params = useParams()
    const router = useRouter()

    const onClick=()=>{
        router.push(`/servers/${id}`)
    }


    return (
        <ActionTip side="right" align="center" title={name}>
            <button
                onClick={onClick}
                className="group relative flex items-center"
            >
                <div className={cn("absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                params?.serverId !== id && "group-hover:h-[20px]",
                params?.serverId === id ? "h-[36px]" : "h-[8px]"
                )} />

                <div className={cn("relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] overflow-hidden transition-all" ,params.serverId === id && "bg-primary/10 text-primary rounded-[16px]" 
                    )}>
                    <Image
                        fill
                        alt="Image"
                        src={imageUrl}
                        className="object-cover"
                    />
                </div>
            </button>
        </ActionTip>

    )
}

export default NavigationItem