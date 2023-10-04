import { currentProfile } from "@/lib/current-profile"
import db from "@/lib/db"
import { ChannelType, MemberRole } from "@prisma/client"
import { redirect } from "next/navigation"
import ServerHeader from "./ServerHeader"
import { ScrollArea } from "../ui/scroll-area"
import ServerSearch from "./ServerSearch"
import { Crown, Hash, Mic, Shield, ShieldAlert, ShieldCheck, Sword, Video } from "lucide-react"
import { Separator } from "../ui/separator"
import ServerSection from "./ServerSection"
import ServerChannel from "./ServerChannel"
import ServerMember from "./ServerMember"



interface ServerSidebarProps{
    serverId:string
}

const iconMap = {
    [ChannelType.TEXT]:<Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]:<Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]:<Video className="mr-2 h-4 w-4" />
}

const roleIconMap={
    [MemberRole.GUEST]:<Shield className="mr-2 h-4 w-4 text-emerald-500"/>,
    [MemberRole.MODERATOR]:<Sword className="mr-2 h-4 w-4 text-blue-500"/>,
    [MemberRole.ADMIN]:<Crown className="mr-2 h-4 w-4 text-rose-500"/>,
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
        <div className="flex flex-col h-full text-primary w-full bg-primary/70 dark:bg-primary-foreground">
            <ServerHeader
                server={server}
                role={role}
            />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch 
                        data={[
                            {
                                label:"Text Channels",
                                type:"channel",
                                metadata:textChannel?.map((channel)=>({
                                    id:channel.id,
                                    name:channel.name,
                                    icon:iconMap[channel.type]
                                }))
                            },
                            {
                                label:"Voice Channels",
                                type:"channel",
                                metadata:audioChannel?.map((channel)=>({
                                    id:channel.id,
                                    name:channel.name,
                                    icon:iconMap[channel.type]
                                }))
                            },
                            {
                                label:"Video Channels",
                                type:"channel",
                                metadata:videoChannel?.map((channel)=>({
                                    id:channel.id,
                                    name:channel.name,
                                    icon:iconMap[channel.type]
                                }))
                            },
                            {
                                label:"Members",
                                type:"member",
                                metadata:members?.map((channel)=>({
                                    id:channel.id,
                                    name:channel.profile.name,
                                    icon:roleIconMap[channel.role]
                                }))
                            },
                        ]}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                {!!textChannel?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Text Channels"
                        />
                    </div>
                )}
                {textChannel?.map((channel)=>(
                    <ServerChannel 
                    channel={channel}
                    role={role}
                    server={server}
                    key={channel.id} />
                ))}
                {!!audioChannel?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.AUDIO}
                            role={role}
                            label="Voice Channels"
                        />
                    </div>
                )}
                {audioChannel?.map((channel)=>(
                    <ServerChannel 
                    channel={channel}
                    role={role}
                    server={server}
                    key={channel.id} />
                ))}
                {!!videoChannel?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.VIDEO}
                            role={role}
                            label="Video Channels"
                        />
                    </div>
                )}
                {videoChannel?.map((channel)=>(
                    <ServerChannel 
                    channel={channel}
                    role={role}
                    server={server}
                    key={channel.id} />
                ))}
                {!!members?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="members"
                            server={server}
                            role={role}
                            label="Server Members"
                        />
                    </div>
                )}
                {members?.map((member)=>(
                    <ServerMember
                    member={member}
                    server={server}
                    key={member.id} />
                ))}
            </ScrollArea>
        </div>
    )
}

export default ServerSidebar