import { db } from "@/firebase"
import { Subscription } from "@/types/Subscription"
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, collection } from "firebase/firestore"

const subscriptionConverter: FirestoreDataConverter<Subscription>  = {
    toFirestore: function (subscription: Subscription): DocumentData {
        return {
            ...subscription
        }
    },
    fromFirestore: function (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Subscription {
        const data = snapshot.data(options) as Subscription;
        return {...data, id: snapshot.id};
    }
}

export const subscriptionRef = (userId: string) => collection(db, "customers", userId, "subscriptions").withConverter(subscriptionConverter);