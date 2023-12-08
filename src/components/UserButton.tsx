"use client"

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import UserAvatar from './UserAvatar'
import { Session } from 'next-auth'
import { Button } from './ui/button'
import { signIn, signOut } from 'next-auth/react'
import LoadingSpinner from './LoadingSpinner'
import { useSubscription } from '@/store/store'
import { ROLE_PRO } from '@/lib/utils'
import { StarIcon } from 'lucide-react'
import ManageAccountButton from './ManageAccountButton'
  

export default function UserButton({ session }: Readonly<{ session: Session | null}>){
    const subscription = useSubscription((state) => state.subscription);
    
    if (!session)
        return <Button variant="outline" onClick={() => signIn()}>Sign in</Button>

    return <DropdownMenu>
    <DropdownMenuTrigger className='outline-none'><UserAvatar image={session.user?.image} name={session.user?.name || ""}/></DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel className="text-center justify-center">{session.user?.name}</DropdownMenuLabel>
      <DropdownMenuSeparator />

      {subscription === undefined && (
        <DropdownMenuItem>
          <LoadingSpinner />
        </DropdownMenuItem>
      )}
      {subscription?.role === ROLE_PRO && (
        <>
        <DropdownMenuLabel className="text-xs flex items-center justify-center space-x-1 text-[#E935c1] animate-pulse">
          <StarIcon width={14} fill="#E935c1" />
          <p>PRO</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center">
          <ManageAccountButton variant='text'/>
        </DropdownMenuItem>
        </>
      )}
      <DropdownMenuItem className="justify-center" onClick={() => signOut()}>Sign out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  
}