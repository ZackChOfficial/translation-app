import { adminDb } from "@/firebase-admin";
import { NextResponse } from "next/server";

export async function DELETE(req: Request){
    const { chatId } = await req.json();
    const ref = adminDb.collection("chats").doc(chatId);

    const bulkWriter = adminDb.bulkWriter();
    const MAX_RETRY_ATTEMPTS = 3;
    bulkWriter.onWriteError((error) => {
        if (error.failedAttempts < MAX_RETRY_ATTEMPTS ) {
            return true;
        } else return false
    })
    
    try {
        await adminDb.recursiveDelete(ref, bulkWriter);
        return NextResponse.json(
            {
                success: true,
            },
            {
                status: 200
            }
        )
    }catch(error) {
        return  NextResponse.json(
            {
                success: false,
            },
            {
                status: 500
            }
        )
    }
}