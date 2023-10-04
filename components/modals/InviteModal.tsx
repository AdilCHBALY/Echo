"use client"



import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

import { useStoreModal } from "@/hooks/use-modal"
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useOrigin } from '@/hooks/use-origin'
import { useState } from 'react'
import axios from 'axios'


export const InviteModal = () => {

    const {isOpen,onOpen,onClose,type,data}=useStoreModal()
    const origin = useOrigin()

    const inviteUrl = `${origin}/invite/${data.server?.inviteCode}`
    
    const isModalOpen = isOpen && type === "invite"

    const [copied,setCopied]=useState(false)
    const [isLoading,setIsLoading]=useState(false)
    

    const onCopy = ()=>{
        navigator.clipboard.writeText(inviteUrl)

        setCopied(true)

        setTimeout(()=>{
            setCopied(false)
        },1000)
    }

    const onGenerate=async()=>{
        try {
            setIsLoading(true)
            const res = await axios.patch(`/api/servers/${data.server?.id}/invite-code`)

            onOpen("invite",{server:res.data})

        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-primary-foreground text-primary p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Invite Friends to {data.server?.name}
                    </DialogTitle>
                </DialogHeader>
                <div className='p-6'>
                    <Label className='uppercase text-sm font-bold text-primary'>
                        SEND A SERVER INVITE LINK TO A FRIEND
                    </Label>
                    <div className='flex items-center mt-2 gap-x-2'>
                        <Input 
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"  value={inviteUrl} />
                        <Button
                        disabled={isLoading}
                        onClick={onCopy} size="icon">
                            {copied ? <Check className='h-5 w-5 text-emerald-500' /> : <Copy className='h-5 w-5' /> }
                        </Button>
                    </div>  
                    <Button 
                    onClick={onGenerate}
                    disabled={isLoading}
                    variant="link" size="sm" className='text-xs text-zinc-500 dark:text-zinc-400 mt-4' >
                        Generate a new Link
                        <RefreshCw className='h-4 w-4 ml-2 hover:text-zinc-700 dark:hover:text-zinc-600' />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
