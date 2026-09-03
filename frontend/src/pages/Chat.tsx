import React from 'react'
import { useParams } from 'react-router-dom'
import { ChatArea } from '@/components/chat/ChatArea'

export default function Chat() {
  const { chatId } = useParams()
  
  return (
    <div className="flex-1 h-full flex flex-col">
      <ChatArea chatId={chatId} />
    </div>
  )
}
