"use client"



import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

import { useStoreModal } from "@/hooks/use-modal"
import { useState } from 'react'
import axios from 'axios'
import { ServerWithMembersWithProfiles } from '@/types'
import { ScrollArea } from '../ui/scroll-area'
import UserAvatar from '../UserAvatar'
import { Check, Crown, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion, Sword } from 'lucide-react'
import qs from 'query-string'
import{
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { MemberRole } from '@prisma/client'
import { useRouter } from 'next/navigation'

const roleIconMap={
    [MemberRole.GUEST]:<Shield className="ml-2 h-4 w-4 text-emerald-500"/>,
    [MemberRole.MODERATOR]:<Sword className="ml-2 h-4 w-4 text-blue-500"/>,
    [MemberRole.ADMIN]:<Crown className="ml-2 h-4 w-4 text-rose-500"/>,
}

export const MembersModal = () => {

    const {isOpen,onOpen,onClose,type,data}=useStoreModal()
    const router = useRouter()

    const {server}=data as { server : ServerWithMembersWithProfiles }
    
    const isModalOpen = isOpen && type === "members"

    const [loadingId,setLoadingId]=useState("")

    const onRoleChange = async(memberId:string,role:MemberRole)=>{
        try {
            setLoadingId(memberId)
            const url = qs.stringifyUrl({
                url:`/api/members/${memberId}`,
                query:{
                    serverId:server?.id
                }
            })

            const res = await axios.patch(url,{role})

            router.refresh()
            onOpen("members",{server: res.data}) 

        } catch (error) {
            console.log(error);
        }finally{
            setLoadingId("")
        }
    }

    const onKick=async(memberId:string)=>{
        try {
            setLoadingId(memberId) 
            const url = qs.stringifyUrl({
                url:`/api/members/${memberId}`,
                query:{
                    serverId:server?.id
                }
            })

            const res =  await axios.delete(url)
            router.refresh()
            onOpen("members",{server:res.data})
        } catch (error) {
            console.log(error);
        }finally{
            setLoadingId("")
        }
    }
    

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-primary-foreground text-primary overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        {server?.members.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className='mt-8 max-h-[420px] pr-6'>
                    {server?.members.map((member)=>(
                        <div key={member.id} className='flex items-center gap-x-2 mb-6'>
                            <UserAvatar src={member.profile.imageUrl} />
                            <div className='flex flex-col gap-y-1'>
                                <div className='text-xs font-semibold flex items-center'>
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className='text-xs text-zinc-500'>
                                    {member.profile.email}
                                </p>
                            </div>
                            {server.profileId != member.profileId && loadingId !== member.id && (
                                <div className='ml-auto'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className='h-4 w-4 text-zinc-500' />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side='left'>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger
                                                    className='flex items-center'
                                                >
                                                    <ShieldQuestion className='w-4 h-4 mr-2' />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem 
                                                            onClick={()=>onRoleChange(member.id,"GUEST")}
                                                        >
                                                            <Shield className='h-4 w-4 mr-2 text-emerald-500' />
                                                            Guest
                                                            {member.role==="GUEST" && (
                                                                <Check className='h-4 w-4 ml-auto' />
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={()=>onRoleChange(member.id,"MODERATOR")}
                                                        >
                                                            <Sword className='h-4 w-4 mr-2 text-blue-500' />
                                                            Moderator
                                                            {member.role==="MODERATOR" && (
                                                                <Check className='h-4 w-4 ml-auto' />
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                            onClick={()=>onKick(member.id)}
                                            className='text-rose-500'>
                                                <Gavel className='h-4 w-4 mr-2' />
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2 className='animate-spin text-zinc-500 ml-auto w-4 h-4' />
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
