'use client'
import { useSession } from 'next-auth/react';
import React, { use, useState } from 'react'
import * as z from 'zod';
import { useToast } from './ui/use-toast';
import useAdminId from '@/hooks/useAdminId';
import { useSubscription } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Input } from './ui/input';
import { addChatRef, chatMembersRef } from '@/lib/converters/ChatMembers';
import { ToastAction } from './ui/toast';
import { getUserByEmailRef } from '@/lib/converters/User';
import { serverTimestamp, setDoc, getDocs } from 'firebase/firestore';
import ShareLink from './ShareLink';

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address")
})

function InviteUser({chatId}: {chatId: string;}) {
    const { data: session} = useSession();
    const {toast} = useToast();
    const adminId = useAdminId({ chatId});
    const subscription = useSubscription(state => state.subscription);
    const router = useRouter();


    const [open, setOpen] = useState(false);
    const [openInviteLink, setOpenInviteLink] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!session?.user.id) return;
        toast({
            title: 'Sending Invite',
            description: "Please wait while we send the invite..."
        })

        const nbOfUsersInChat = ((await getDocs(chatMembersRef(chatId))).docs.map((doc) => doc.data())).length

        // check if user exceeded the Free Plan
        const isPro = subscription?.role == 'pro' && subscription.status == 'active';
        if (!isPro && nbOfUsersInChat >= 2) {
            toast({
                title: "Free plan limit exceeded",
                description: "You have exceeded the limit of users in a single chat for FREE PLAN, please upgrade to continue adding users to chats.",
                variant: "destructive",
                action: (<ToastAction altText="Upgrade" onClick={() =>router.push("/register")}>
                Upgrade to PRO
                </ToastAction>)
            })

            return;
        }
        const querySnapchot = await getDocs(getUserByEmailRef(values.email));

        if (querySnapchot.empty) {
            toast({
                title: "User not found",
                description: "Please enter an email address of a registered user OR resend the invite once they signed up!",
                variant: "destructive",
            })

            return;
        }
        const user = querySnapchot.docs[0].data();
        await setDoc(addChatRef(chatId, user.id), {
            userId: user.id,
            email: user.email!,
            timestamp: serverTimestamp(),
            chatId: chatId,
            isAdmin: false,
            image: user.image || "",
        }).then(() => {
            setOpen(false);

            toast({
                title: "Added to chat",
                description: "The user has been added to the chat successfully!",
                className: "bg-green-600 text-white",
            });

            setOpenInviteLink(true);
        })

        form.reset()
    }
    if (adminId !== session?.user.id) return <></>;
  return (
     <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircleIcon className='mr-1'/>
                    Add user to chat
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Add user to chat</DialogTitle>
                    <DialogDescription>
                        simply enter another user email address to invite them to this chat!
                        <span className='text-indigo-600'>(Note: they must be registered)</span>
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-2'>
                        <FormField name='email' control={form.control} render={({ field }) => {
                            return <FormItem>
                                <FormControl>
                                    <Input placeholder='example@email.com' {...field} /> 
                                </FormControl>
                            </FormItem>
                        }}/>
                        <Button className='ml-auto sm:w-fit w-full' type='submit'>
                            Add to chat
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
        <ShareLink chatId={chatId} isOpen={openInviteLink} setIsOpen={setOpenInviteLink}/>
     </>
  )
}

export default InviteUser