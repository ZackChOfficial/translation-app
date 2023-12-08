'use client'

import { useSession } from "next-auth/react";
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { addDoc, getDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { User, limitedMessagesRef, messagesRef } from "@/lib/converters/Message";
import { useSubscription } from "@/store/store";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    input: z.string().max(1000)
})

function ChatInput({chatId}: {chatId: string;}) {
    const {data: session } = useSession();
    const subscription = useSubscription(state => state.subscription);
    const isPro = subscription?.role == "pro" && subscription.status == "active";
    const {toast} = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            input: ""
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.input.length == 0) return;
        if (!session?.user) return;
        const value = values.input;
        const messagesNbr = (await getDocs(limitedMessagesRef(chatId))).docs.map((doc) => doc.data()).length

        if (!isPro && messagesNbr > 20) 
            toast({
                title: "Free plan limit exceeded",
                description: "You've exceeded the FREE plan limit of 20 messages per chat, upgrade to PRO for unlimited chat messages!",
                variant: "destructive",
                action: (<ToastAction altText="Upgrade" onClick={() =>router.push("/register")}>
                    Upgrade to PRO
                </ToastAction>)
            })
        
            form.reset();
        const userToStore: User = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.name!,
            image: session.user.image || ""
        }

        addDoc(messagesRef(chatId), {
            input: value,
            timestamp: serverTimestamp(),
            user: userToStore
        })
      }
  return (
    <div className="sticky bottom-0">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
            className="flex space-x-2 p-2 rounded-t-xl max-w-4xl mx-auto bg-white border dark:bg-slate-800"
            >
            <FormField
                control={form.control}
                name="input"
                render={({ field }) => (
                    <FormItem className="flex-1">
                    <FormControl>
                        <Input className="border-none bg-transparent dark:placeholder:text-white/70" placeholder="Enter message in ANY language..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="bg-violet-600 text-white">Send</Button>
            </form>
        </Form>
    </div>
  )
}

export default ChatInput