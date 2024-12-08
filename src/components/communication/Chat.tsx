import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Image as ImageIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  ChatMessage,
  ChatParticipant,
  MessageType,
  MessageAttachment,
} from '@/types/communication'

interface ChatProps {
  messages: ChatMessage[]
  currentUser: ChatParticipant
  otherParticipant: ChatParticipant
  onSendMessage: (content: string, type: MessageType, attachment?: File) => void
  onLoadMore?: () => void
  isLoading?: boolean
}

export function Chat({
  messages,
  currentUser,
  otherParticipant,
  onSendMessage,
  onLoadMore,
  isLoading,
}: ChatProps) {
  const [newMessage, setNewMessage] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (newMessage.trim() || attachment) {
      const messageType: MessageType = attachment
        ? attachment.type.startsWith('image/')
          ? 'image'
          : 'file'
        : 'text'
      onSendMessage(newMessage.trim(), messageType, attachment || undefined)
      setNewMessage('')
      setAttachment(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachment(file)
    }
  }

  const renderMessage = (message: ChatMessage) => {
    const isOwnMessage = message.senderId === currentUser.id
    const sender = isOwnMessage ? currentUser : otherParticipant

    return (
      <div
        key={message.id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`flex ${
            isOwnMessage ? 'flex-row-reverse' : 'flex-row'
          } items-start max-w-[70%]`}
        >
          <Avatar className="w-8 h-8 mx-2">
            <AvatarImage src={sender.avatarUrl} alt={sender.name} />
            <AvatarFallback>
              {sender.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <div
              className={`rounded-lg p-3 ${
                isOwnMessage
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.type === 'text' && <p>{message.content}</p>}
              {message.type === 'image' && message.attachmentUrl && (
                <img
                  src={message.attachmentUrl}
                  alt="Imagem anexada"
                  className="max-w-sm rounded"
                />
              )}
              {message.type === 'file' && message.attachmentUrl && (
                <a
                  href={message.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-500 hover:underline"
                >
                  <Paperclip className="w-4 h-4 mr-1" />
                  {message.content || 'Arquivo anexado'}
                </a>
              )}
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              {format(message.createdAt, "dd 'de' MMMM 'às' HH:mm", {
                locale: ptBR,
              })}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={otherParticipant.avatarUrl}
              alt={otherParticipant.name}
            />
            <AvatarFallback>
              {otherParticipant.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h3 className="font-semibold">{otherParticipant.name}</h3>
            <p className="text-sm text-muted-foreground">
              {otherParticipant.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 p-4"
        onScrollCapture={(e) => {
          const target = e.currentTarget
          if (target.scrollTop === 0 && onLoadMore && !isLoading) {
            onLoadMore()
          }
        }}
      >
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {attachment && (
        <div className="px-4 py-2 border-t">
          <div className="flex items-center justify-between bg-muted rounded p-2">
            <span className="text-sm truncate">{attachment.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAttachment(null)}
            >
              Remover
            </Button>
          </div>
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1"
            rows={1}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button size="icon" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
