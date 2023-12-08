import React from 'react'
import { Button } from './ui/button'
import { generatePortalLink } from '@/actions/generatePortalLink'

function ManageAccountButton({ variant }: { variant: "button" | "text"}) {
  return (
    <form action={generatePortalLink}>
        <Button type='submit' variant={variant == "button" ? "primary" : "ghost"} className='w-full'>
            Manage billing
        </Button>
    </form>
  )
}

export default ManageAccountButton