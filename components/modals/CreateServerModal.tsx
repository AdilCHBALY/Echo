"use client"

import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import axios from "axios"

import {
    Dialog,
    DialogContent,
    DialogDescription,
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

import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import { useForm } from 'react-hook-form'
import FileUpload from "../FileUpload"
import { useRouter } from "next/navigation"
import { useStoreModal } from "@/hooks/use-modal"

const formSchema = z.object({
    name: z.string().min(1,{
        message:"Server name is required"
    }),
    imageUrl : z.string().min(1,{
        message:"Image is required"
    })
})


export const CreateServerModal = () => {

    const {isOpen,onClose,type}=useStoreModal()

    const isModalOpen = isOpen && type === "createServer"
    
    const router = useRouter()

    const form = useForm({
        resolver:zodResolver(formSchema),
        defaultValues: {
            name:'',
            imageUrl:''
        }
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async(values:z.infer<typeof formSchema>)=>{
        try {
            await axios.post("/api/servers",values)

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
                        Create your Server
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500 dark:text-zinc-400'>
                        Give your server a name and image . you can change it later if you want 
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    name="imageUrl"
                                    control={form.control}
                                    render={({field})=>(
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload 
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-primary">
                                            Server Name <span className="text-rose-500 text-sm">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter server Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 dark:bg-zinc-700/50 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
