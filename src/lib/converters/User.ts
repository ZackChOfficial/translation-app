import { db } from "@/firebase"
import { Subscription } from "@/types/Subscription"
import { FirebaseAdapterConfig } from "@auth/firebase-adapter";
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, collection, collectionGroup, doc, query, where } from "firebase/firestore"
import { User }from 'next-auth';

const userConverter: FirestoreDataConverter<User> = {
    toFirestore: function (customer: User): DocumentData {
        return {
            email: customer.email,
            name: customer.name,
            image: customer.image
        }
    },
    fromFirestore: function (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): User {
        const data: Omit<User, 'id'> = snapshot.data(options);
        return {
            id: snapshot.id,
            name: data.name,
            image: data.image,
            email: data.email
        }
    }
}


export const getUserByEmailRef = (email: string) => query(collection(db, 'users'), where("email", "==", email)).withConverter(userConverter);

