"use client"

import { Member, MemberRole, Profile } from "@prisma/client"
import UserAvatar from "../UserAvatar"
import ActionTip from "../ActionTip"
import { Edit, FileIcon, Shield, ShieldAlert, ShieldCheck, Trash } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form"
import * as z from "zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import qs from "query-string"
import { useStoreModal } from "@/hooks/use-modal"
import { useParams,useRouter } from "next/navigation"

interface ChatItemProps{
    id:string
    content:string
    member:Member & {
        profile:Profile
    }
    timestamp:string
    fileUrl:string | null
    deleted:boolean
    currentMember:Member
    isUpdated:boolean
    socketUrl:string
    socketQuery:Record<string,string>
}

const roleIconMap={
    [MemberRole.GUEST]:<Shield className="ml-2 h-4 w-4 text-emerald-500"/>,
    [MemberRole.MODERATOR]:<ShieldCheck className="ml-2 h-4 w-4 text-blue-500"/>,
    [MemberRole.ADMIN]:<ShieldAlert className="ml-2 h-4 w-4 text-rose-500"/>,
}

const formSchema = z.object({
    content:z.string().min(1)
})

const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketQuery,
    socketUrl,
}:ChatItemProps) => {
    const [isEditing,setIsEditing]= useState(false)
    const {onOpen} = useStoreModal()

    const params=useParams()
    const router = useRouter()

    const onMemberClick = ()=>{
        if(member.id===currentMember.id){
            return
        }

        router.push(`/servers/${params?.serverId}/conversation/${member?.id}`)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues:{
            content:content
        }
    })

    useEffect(()=>{
        const handleKeyDown = (event: any)=>{
            if(event.key==="Escape" || event.keyCode===27){
                setIsEditing(false)
            }
        }

        window.addEventListener("keydown", handleKeyDown)


        return ()=> window.removeEventListener("keydown", handleKeyDown)
    },[])

    useEffect(()=>{
        form.reset({
            content:content
        })
    },[content, form])

    const fileType = fileUrl?.split(".").pop()
    const isAdmin = currentMember.role === MemberRole.ADMIN
    const isModerator = currentMember.role === MemberRole.MODERATOR
    const isOwner = currentMember.id===member.id
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
    const canEditMessage = !deleted && isOwner
    const isPDF = fileType === "pdf" && fileUrl
    const isImage =!isPDF && fileUrl
    const isLoading = form.formState.isSubmitting

    const onSubmit=async (value:z.infer<typeof formSchema>)=>{
        try {
            const url = qs.stringifyUrl({
                url:`${socketUrl}/${id}`,
                query:socketQuery
            })

            await axios.patch(url,value)
            form.reset()
            setIsEditing(false)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div
                onClick={onMemberClick}
                className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p 
                            onClick={onMemberClick}
                            className="font-semibold text-sm hover:underline cursor-pointer">
                                {member.profile.name}
                            </p>
                            <ActionTip title={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a 
                        target="_blank"
                        className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                        rel="noopener noreferrer"
                        href={fileUrl}>
                            <Image 
                                src={fileUrl}
                                alt={content}
                                fill
                                className="object-cover"
                            />
                        </a>
                    )}
                    {isPDF && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                        <FileIcon className="h-10 w-10 fill-blue-200 stroke-blue-400" />
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-blue-500 dark:text-blue-400 hover:underline">
                                PDF File
                            </a>
                    </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <p className={cn('text-sm text-zinc-600 dark:text-zinc-300',
                        deleted && "italic text-zinc-500 text-xs mt-1 dark:text-zinc-400"
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            ) }
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}> 
                            <form 
                            className="flex items-center w-full gap-x-2 pt-2"
                            onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField 
                                    control={form.control}
                                    name="content"
                                    render = {({field})=>(
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input
                                                        disabled={isLoading}
                                                        className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                        placeholder="Edited Message"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button disabled={isLoading} size="sm" variant="primary">
                                    Save
                                </Button>
                            </form>
                            <span className="text-[10px] mt-1 text-zinc-500">
                                Press Escape to cancel , enter to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {canEditMessage && (
                        <ActionTip title="Edit" >
                            <Edit 
                            onClick={()=>setIsEditing(true)}
                            className="w-4 h-4 ml-auto cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
                        </ActionTip>
                    )}
                        <ActionTip title="Delete" >
                            <Trash 
                            onClick={()=>onOpen("deleteMessage",{
                                apiUrl:`${socketUrl}/${id}`,
                                query:socketQuery
                            })}
                            className="w-4 h-4 ml-auto cursor-pointer text-rose-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
                        </ActionTip>
                </div>
            )}
        </div>
    )
}

export default ChatItem