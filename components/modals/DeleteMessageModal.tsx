"use client"



import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

import { useStoreModal } from "@/hooks/use-modal"
import { Button } from '../ui/button'
import { useState } from 'react'
import axios from 'axios'
import qs from 'query-string'

export const DeleteMessageModal = () => {

    const {isOpen,onClose,type,data}=useStoreModal()
    const isModalOpen = isOpen && type === "deleteMessage"
    const [isLoading,setIsLoading]=useState(false)
    

    const onConfirm=async()=>{
        try {
            setIsLoading(true)
            const url = qs.stringifyUrl({
                url:data.apiUrl || "",
                query:data.query
            })
            await axios.delete(url)
            onClose()

        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false)
        }
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Delete Message 
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Are you sure you want to do this ? <br />
                        Message will be permanently deleted
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='bg-gray-100 px-6 py-4'>
                    <div className='flex items-center justify-between w-full'>
                        <Button disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                        disabled={isLoading}
                        onClick={onConfirm}
                        variant="destructive">
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
