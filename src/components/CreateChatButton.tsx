"use client"

import { MessageSquarePlus } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useSubscription } from "@/store/store";
import LoadingSpinner from "./LoadingSpinner";
import { getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { addChatRef, chatMembersCollectionGroupRef, chatMembersRef } from "@/lib/converters/ChatMembers";
import { v4 as uuidv4 } from 'uuid';
import { ToastAction } from "./ui/toast";

export default function CreateChatButton({isLarge}: {isLarge?: boolean}) {
    const router = useRouter()
    const { data: session } = useSession()
    const [loading, setloading] = useState(false);
    const { toast } = useToast();
    const subscription = useSubscription(state => state.subscription);
    const createNewChat = async () => {
        if (!session?.user.id) return;
        setloading(true);
        toast({
            title: "Createing new chat...",
            description: "Hold tight while we create your new chat...",
            duration: 3000,
        });

        const chatsNbr = (await getDocs(chatMembersCollectionGroupRef(session.user.id))).docs.map(doc => doc.data()).length
        const isPro = subscription?.role == "pro" && subscription.status == "active";

        if (!isPro && chatsNbr >= 3) {
            toast({
                title: "Free plan limit exceeded",
                description: "You've exceeded the FREE plan limit of 20 messages per chat, upgrade to PRO for unlimited chat messages!",
                variant: "destructive",
                action: (<ToastAction altText="Upgrade" onClick={() =>router.push("/register")}>
                    Upgrade to PRO
                </ToastAction>)
            })
            setloading(false);
            return;
        }
    
        const chatId = uuidv4()

        await setDoc(addChatRef(chatId, session.user.id), {
            userId: session.user.id,
            email: session.user.email!,
            timestamp: serverTimestamp(),
            isAdmin: true,
            chatId: chatId,
            image: session.user.image || ""
        }).then(() => {
            toast({
                title: "Success",
                description: "Your chat has been created!.",
                className: "bg-green-600 text-white",
                duration: 2000,
            });
            router.push(`/chat/${chatId}`)
        }).catch((error) => {
            console.error(error);
            toast({
                title: "Error",
                description: "There was an error creating your chat!",
                variant: "destructive",
            });
        }).finally(() => setloading(false))
    }
    if (isLarge)
    return <Button variant="primary" onClick={createNewChat}>{loading ? <LoadingSpinner /> : "Create a new Chat"}</Button>
    return <Button variant="ghost" onClick={createNewChat}>{loading ? <LoadingSpinner /> : "Create a new Chat"}</Button>
}
