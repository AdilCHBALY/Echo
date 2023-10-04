import MediaRoom from "@/components/MediaRoom"
import ChatHeader from "@/components/channel/ChatHeader"
import ChatInput from "@/components/channel/ChatInput"
import ChatMessages from "@/components/channel/ChatMessages"
import { currentProfile } from "@/lib/current-profile"
import db from "@/lib/db"
import { redirectToSignIn } from "@clerk/nextjs"
import { ChannelType } from "@prisma/client"
import { redirect } from "next/navigation"

interface pageProps{
    params:{
        serverId:string,
        channelId:string
    }
}

const page = async ({params}:pageProps) => {
    const profile = await currentProfile()

    if(!profile) return redirectToSignIn()

    const channel = await db.channel.findUnique({
        where:{
            id:params.channelId
        }
    })

    const member = await db.member.findFirst({
        where:{
            serverId:params.serverId,
            profileId:profile.id
        }
    })

    if(!channel || !member) return redirect("/")

    return (
        <div className="flex flex-col h-full">
            <ChatHeader
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />
            {channel.type === ChannelType.TEXT && (
                <>
                    <ChatMessages
                        chatId={channel.id}
                        member={member}
                        name={channel.name}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId:channel.id,
                            serverId:channel.serverId
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />
                    <ChatInput 
                        name={channel.name}
                        type="channel"
                        apiUrl="/api/socket/messages"
                        query={{
                            channelId:channel.id,
                            serverId:channel.serverId
                        }}
                    />
                </>
            )}

            {channel.type === ChannelType.AUDIO && (
                <MediaRoom
                    chatId={channel.id}
                    video={false}
                    audio={true}
                />
            )}

            {channel.type === ChannelType.VIDEO && (
                <MediaRoom
                    chatId={channel.id}
                    video={true}
                    audio={true}
                />
            )}
            
        </div>
    )
}

export default page