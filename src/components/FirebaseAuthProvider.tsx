"use client"

import { auth } from "@/firebase"
import { signInWithCustomToken } from "firebase/auth"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

const syncFirebaseAuth =async (session: Session) => {
        if (!session || !session.firebaseToken) return;
        try {
            await signInWithCustomToken(auth, session.firebaseToken)
        }catch(error) {
            console.error("Error signing in with custom token")
        }
}

function FirebaseAuthProvider({children}: Readonly<{children: React.ReactNode}>) {
    const { data: session } = useSession()
  
    useEffect(() => {
        if (!session) return;
        syncFirebaseAuth(session);
    }, [session])

    return (
    <>{children}</>
  )
}

export default FirebaseAuthProvider