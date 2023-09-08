import { currentProfile } from "@/lib/current-profile"
import db from "@/lib/db"
import { ChannelType } from "@prisma/client"
import { redirect } from "next/navigation"
import ServerHeader from "./ServerHeader"



interface ServerSidebarProps{
    serverId:string
}

const ServerSidebar:React.FC<ServerSidebarProps> = async({serverId}) => {

    const profile = await currentProfile()

    if(!profile) return redirect("/")

    const server = await db.server.findUnique({
        where:{
            id:serverId
        },
        include:{
            channels:{
                orderBy:{
                    createdAt:"asc"
                }
            },
            members:{
                include:{
                    profile:true
                },
                orderBy:{
                    role:"desc"
                }
            }
        }
    })

    // ?  Check for Text,Audio,Video Channels

    const textChannel = server?.channels.filter((channel)=>channel.type===ChannelType.TEXT)

    const audioChannel = server?.channels.filter((channel)=>channel.type===ChannelType.AUDIO)

    const videoChannel = server?.channels.filter((channel)=>channel.type===ChannelType.VIDEO)

    //? Check for Members and remove the current Profile from the List

    const members = server?.members.filter((member)=>member.profileId !== profile.id)

    if(!server) return redirect("/")

    // ? Get the Role of this server

    const role = server?.members.find((member)=>member.profileId === profile.id)?.role


    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
            <ServerHeader
                server={server}
                role={role}
            />
        </div>
    )
}

export default ServerSidebar