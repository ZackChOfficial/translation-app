import { authOptions } from '@/auth'
import AdminControls from '@/components/AdminControls'
import ChatInput from '@/components/ChatInput'
import ChatMembersBadges from '@/components/ChatMembersBadges'
import ChatMessages from '@/components/ChatMessages'
import { chatMembersRef } from '@/lib/converters/ChatMembers'
import { sortedMessagesRef } from '@/lib/converters/Message'
import { getDocs } from 'firebase/firestore'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: {
    chatId: string;
  }
}

async function ChatPage({params: { chatId }}: Props) {
  const session = await getServerSession(authOptions)
  const initialMessages = (await getDocs(sortedMessagesRef(chatId))).docs.map(doc => ({...doc.data(), timestamp: null}));
  
  const hasAccess = (await getDocs(chatMembersRef(chatId))).docs.map(doc => doc.id).includes(session?.user.id!);

  if (!hasAccess)
    redirect("/chat?error=permission");
  return (
    <>
      <AdminControls chatId={chatId} />
    <ChatMembersBadges chatId={chatId} />
    <div className='flex-1'>
    {/* 
    // @ts-ignore */}
    <ChatMessages initialMessages={initialMessages} session={session} chatId={chatId} />
    </div>
    <ChatInput chatId={chatId} />
    </>
  )
}

export default ChatPage