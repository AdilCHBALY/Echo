"use client"

import { Plus } from "lucide-react"
import ActionTip from "../ActionTip"
import { useStoreModal } from "@/hooks/use-modal"

const NavigationAction = () => {
    const {onOpen} = useStoreModal()
    return (
        <div> 
            <ActionTip side="right" align="center" title="Add a Server">
                <button
                    onClick={()=>onOpen("createServer")}
                    className="group flex items-center">
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center group-hover:bg-primary bg-primary-foreground border-primary border-[1px]">
                        <Plus size={25} className="group-hover:text-white transition text-primary" />
                    </div>
                </button>
            </ActionTip>
        </div>
    )
}

export default NavigationAction