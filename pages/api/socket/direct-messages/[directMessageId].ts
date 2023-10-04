import { currentProfilePages } from "@/lib/CurrentProfilePages";
import db from "@/lib/db";
import { NextApiResponseServerIO } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler (
    req:NextApiRequest,
    res:NextApiResponseServerIO
){
    if(req.method !== "PATCH" && req.method !== "DELETE") return res.status(405).json({error:"Method not allowed"})

    try {

        const profile = await currentProfilePages(req)
        const {content} = req.body
        const {directMessageId,conversationId}=req.query

        if(!profile) return res.status(401).json({error:"unauthorized"})
        if(!conversationId) return res.status(400).json({error:"Conversation ID Missing"})
        if(!directMessageId) return res.status(400).json({error:"Direct Message ID Missing"})

        const conversation = await db.conversation.findFirst({
            where:{
                id:conversationId as string,
                OR:[
                    {
                        memberOne:{
                            profileId:profile.id
                        }
                    },{
                        memberTwo:{
                            profileId:profile.id
                        }
                    }
                ]
            },
            include:{
                memberOne:{
                    include:{
                        profile:true
                    }
                },
                memberTwo:{
                    include:{
                        profile:true
                    }
                }
            }
        })

        if(!conversation) return res.status(404).json({message:"Conversation Not Found"})

        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo

        if(!member) return res.status(404).json({message:"Member Not Found"})

        let message = await db.directMessage.findFirst({
            where:{
                id:directMessageId as string,
                conversationId:conversationId as string
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        })

        if(!message || message.deleted) return res.status(404).json({message:"Message Not Found"})

        const isMessageOwner = message.memberId === member.id
        const isAdmin = member.role === MemberRole.ADMIN
        const isModerator = member.role === MemberRole.MODERATOR
        const canModify = isMessageOwner || isAdmin || isModerator

        if(!canModify) return res.status(400).json({error:"Unauthorized"})
        
        if(req.method==="DELETE"){
            message= await db.directMessage.update({
                where:{
                    id:directMessageId as string,
                },
                data:{
                    fileUrl:null,
                    content:"This message has been deleted",
                    deleted:true,
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                }
            })
        }

        if(req.method==="PATCH"){
            if(!isMessageOwner) return res.status(400).json({error:"Unauthorized"})

            message= await db.directMessage.update({
                where:{
                    id:directMessageId as string,
                },
                data:{
                    content
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                }
            })
        }

        
        const updateKey = `chat:${conversationId}:messages:update`

        res?.socket?.server?.io.emit(updateKey, message)

        return res.status(200).json(message)

    } catch (error) {
        console.log("MESSAGES_ID",error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}