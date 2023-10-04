"use client"

import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import axios from "axios"

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"

import{
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import { useForm } from 'react-hook-form'
import { useParams, useRouter } from "next/navigation"
import { useStoreModal } from "@/hooks/use-modal"
import { ChannelType } from "@prisma/client"
import { MailQuestionIcon } from "lucide-react"
import qs from "query-string"
import { useEffect } from "react"

const formSchema = z.object({
    name: z.string().min(1,{
        message:"Channel name is required"
    }).refine(
        name=>name!=="general",{
            message:"Channel name cannot be 'general'"
        }
    ),
    type: z.nativeEnum(ChannelType)
})


export const EditChannelModal = () => {

    const {isOpen,onClose,type,data}=useStoreModal()

    const isModalOpen = isOpen && type === "editChannel"

    const {channelType}=data
    
    const router = useRouter()
    const params = useParams()

    const form = useForm({
        resolver:zodResolver(formSchema),
        defaultValues: {
            name:'',
            type: data.channel?.type || ChannelType.TEXT
        }
    })

    useEffect(()=>{
        if(data.channel) {
            form.setValue("name",data.channel.name)
            form.setValue("type",data.channel.type)
        }
    },[data.channel, form])

    const isLoading = form.formState.isSubmitting

    const onSubmit = async(values:z.infer<typeof formSchema>)=>{
        try {
            const  url = qs.stringifyUrl({
                url:`/api/channels/${data.channel?.id}`,
                query:{
                    serverId:data.server?.id
                }
            })
            await axios.patch(url,values)
            form.reset()
            router.refresh()
            onClose()
        } catch (error) {
            console.log(error);
        }
    }

    const handleCLose=()=>{
        form.reset()
        onClose()
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleCLose}>
            <DialogContent className='bg-primary-foreground text-primary p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Edit Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-primary">
                                            Channel Name <span className="text-rose-500 text-sm">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter channel Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="type"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Channel Type</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                    <SelectValue placeholder="Select a Channel Type" />
                                                    <SelectContent>
                                                        {Object.values(ChannelType).map((type)=>(
                                                            <SelectItem key={type} value={type} className="capitalize">
                                                                {type.toLowerCase()}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </SelectTrigger>
                                            </FormControl>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 dark:bg-zinc-700/50 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
