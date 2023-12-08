'use client'

import { subscriptionRef } from '@/lib/converters/Subscription';
import { useSubscription } from '@/store/store';
import { onSnapshot } from 'firebase/firestore';
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

function SubscriptionProvider({children}: Readonly<{children: React.ReactNode}>) {
    const { data: session } = useSession()
    const setSubscription = useSubscription((state) => state.setSubscription);
    useEffect(() => {
        if (!session) return;
        return onSnapshot(subscriptionRef(session?.user.id), (snapshot) => {
            if (snapshot.empty) setSubscription(null); // user has no subscription
            else setSubscription(snapshot.docs[0].data())
        }, (error) => {console.error(error)})
    }, [session, setSubscription]);

  return (
    <>{children}</>
  )
}

export default SubscriptionProvider