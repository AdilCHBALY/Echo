"use client"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Children } from "react"


interface ActionTipProps{
    title:string
    children:React.ReactNode
    side?:"top"|"right"|"bottom"|"left"
    align?:"start"|"end"|"center"
}

const ActionTip :React.FC<ActionTipProps>= ({
    title,
    children,
    side,
    align
}) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger>{children}</TooltipTrigger>
                <TooltipContent side={side} align={align}>
                <p className="font-semibold text-sm capitalize">{title.toLowerCase()}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default ActionTip