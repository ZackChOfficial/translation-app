"use client"

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import useAdminId from "@/hooks/useAdminId";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

function DeleteChatButton({chatId}: {chatId: string;}) {
    const { data: session} = useSession()
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast()
    const router = useRouter();
    const adminId = useAdminId({ chatId });

    const handleDelete = async () => {
        toast({
            title: "Deleting chat",
            description: "Please while we delete the chat...",
        });

        await fetch("/api/chat/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({chatId})
        }).then((res) => {
            toast({
                title: "Success",
                description: "Your chat has been deleted!",
                className: "bg-green-600 text-white",
                duration: 3000,
            });
            router.replace("/chat");
    
        }).catch((error) => {
            toast({
                title: "Error",
                description: "There was an error deleting your chat!",
                variant: "destructive"
            });
        }).finally(() => setIsOpen(false))
    }
    if (adminId !== session?.user.id) return <></>;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button variant="destructive">Delete chat</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                    This will delete the chat for all user.
                </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 space-x-2">
                <Button variant="destructive" onClick={handleDelete}>
                    Delete
                </Button>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                </Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteChatButton