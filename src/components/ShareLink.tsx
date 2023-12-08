import React from 'react'
import { useToast } from './ui/use-toast'
import { Dialog } from '@radix-ui/react-dialog';
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';

type Props = {
    chatId: string,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
function ShareLink({chatId, isOpen, setIsOpen}: Props) {
    const { toast } =useToast();
    const host = window.location.host;
    const linkToChat = process.env.NODE_ENV === "development" ? `http://${host}/chat/${chatId}` : `https://${host}/chat/${chatId}`;


    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(linkToChat);
            toast({
                title: "Copied successfully!",
                description: "share this to the person you want to chat with (Note: they must be added to the chat to access it!)",
                className: "bg-green-600 text-white",
            })
        }catch(err) {
            console.error(err);
        }
    }
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen} defaultOpen={isOpen} >
        <DialogTrigger asChild>
            <Button variant="outline">
                <Copy className="mr-2" />
                Share Link
            </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
            <DialogHeader>
                <DialogTitle>Share Link</DialogTitle>
                <DialogDescription>
                    Any user who has been
                    <span className='text-indigo-600 font-bold'> granted access </span>
                    can use this link
                </DialogDescription>
            </DialogHeader>
            <div className='flex items-center space-x-2'>
                <div className='grid flex-1 gap-2'>
                    <Label htmlFor="link" className='sr-only'>Link</Label>
                    <Input id="link" defaultValue={linkToChat} readOnly/>
                </div>
                <Button type='submit' onClick={() => copyToClipboard()} size="sm" className='px-3'>
                    <span className='sr-only'>Copy</span>
                    <Copy className='h-4 w-4'/>
                </Button>
            </div>
            <DialogFooter className='sm:justify-start'>
                <DialogClose asChild>
                    <Button type='button' variant="secondary">Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default ShareLink