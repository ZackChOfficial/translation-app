'use client'

import { db } from "@/firebase"
import { addDoc, collection, onSnapshot } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { useState } from "react"
import LoadingSpinner from "./LoadingSpinner"
import { Button } from "./ui/button"
import { useSubscription } from "@/store/store"
import ManageAccountButton from "./ManageAccountButton"

function CheckoutButton() {
    const {data: session } = useSession()
    const [loading, setLoading] = useState(false);
    const subscription = useSubscription(state => state.subscription)

    const isLoadingSubscription = subscription === undefined;

    const isSubscribed = subscription?.status === "active" && subscription?.role == "pro";

    const createCheckoutSession = async () => {
        if (!session?.user.id) return;
        setLoading(true);

        const docRef = await addDoc(collection(db, 'customers', session.user.id, 'checkout_sessions'), {
            price: "price_1OBMlQJT4MqLyK9vVPvcWKsY",
            success_url: window.location.origin,
            cancel_url: window.location.origin
        })

        return onSnapshot(docRef, (snap) => {
          const data = snap.data();
          const url = data?.url
          const error = data?.error
          if (error) {
            // Show an error to your customer and
            // inspect your Cloud Function logs in the Firebase console.
            alert(`An error occured: ${error.message}`);
          }
          if (url) {
            // We have a Stripe Checkout URL, let's redirect.
            window.location.assign(url);
          }
          setLoading(false)
        });
    }
  return (
    <div className='flex flex-col space-y-2'>
      {isSubscribed ? <ManageAccountButton variant="button" /> : (
        <Button disabled={loading}
        onClick={() => createCheckoutSession()}
        variant="primary">
        { loading || isLoadingSubscription ? <LoadingSpinner /> : "Sign Up"}
        </Button>)
    }
    </div>
  )
}

export default CheckoutButton