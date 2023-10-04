"use client"

import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput,CommandItem,CommandList } from "../ui/command"
import { useParams, useRouter } from "next/navigation"

interface ServerSearchProps{
    data:{
        label:string
        type:"channel" | "member"
        metadata:{
            icon:React.ReactNode
            name:string
            id:string
        }[] | undefined
    }[] | undefined
}

const ServerSearch = ({
    data
}:ServerSearchProps) => {
    const [open,setOpen]=useState(false);
    const router = useRouter()
    const params=useParams()
    useEffect(()=>{
        const down = (e:KeyboardEvent)=>{
            if(e.key==="k" && (e.metaKey || e.ctrlKey)){
                e.preventDefault()
                setOpen((open)=>!open)
            }
        }

        document.addEventListener("keydown",down)
        return ()=>document.removeEventListener("keydown",down)
    },[])


    const onClick =({id,type}:{id:string,type:"channel"|"member"})=>{
        setOpen(false)

        if(type==="member") return router.push(`/servers/${params?.serverId}/conversations/${id}`)

        if(type==="channel") return router.push(`/servers/${params?.serverId}/channels/${id}`)
    }

    return (
        <>
            <button 
            onClick={()=>setOpen(true)}
            className="group px-2 py-2 rounded-md flex items-center w-full gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                <Search  className="h-4 w-4 text-white dark:text-zinc-400"  />
                <p className="font-semibold text-sm text-white dark:text-zinc-400 group-hover:text-gray-200 dark:group-hover:text-zinc-300 transition">
                    Search
                </p>
                <kbd className="pointer-events-none inline-flex items-center h-5 select-none gap-1 rounded border text-[10px] font-mono font-medium bg-muted text-muted-foreground px-1.5 ml-auto">
                    <span className="text-xs">Ctrl</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="search All channels and members"/>
                <CommandList>
                    <CommandEmpty>
                        No Results found
                    </CommandEmpty>
                    {data?.map(({metadata,type,label})=>{
                        if(!metadata?.length) return null

                        return(
                            <CommandGroup key={label} heading={label}>
                                {metadata.map(({id,icon,name})=>(
                                    <CommandItem key={id} onSelect={()=>onClick({id,type})}>
                                        {icon}
                                        <span>{name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )
                    })}
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default ServerSearch