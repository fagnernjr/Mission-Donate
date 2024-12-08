export type MessageType = 'text' | 'image' | 'file'
export type ChatParticipantType = 'donor' | 'missionary' | 'admin'
export type NotificationType = 'mission_update' | 'donation' | 'message' | 'system'
export type NotificationPriority = 'low' | 'medium' | 'high'

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderType: ChatParticipantType
  recipientId: string
  content: string
  type: MessageType
  attachmentUrl?: string
  createdAt: Date
  readAt?: Date
}

export interface ChatConversation {
  id: string
  participants: {
    id: string
    type: ChatParticipantType
    name: string
    avatarUrl?: string
  }[]
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt: Date
  updatedAt: Date
}

export interface MissionUpdate {
  id: string
  missionId: string
  title: string
  content: string
  mediaUrls?: string[]
  createdAt: Date
  author: {
    id: string
    name: string
    avatarUrl?: string
  }
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  data?: Record<string, any>
  createdAt: Date
  readAt?: Date
}

export interface ChatParticipant {
  id: string
  type: ChatParticipantType
  name: string
  avatarUrl?: string
  isOnline: boolean
  lastSeen?: Date
}

export interface MessageAttachment {
  id: string
  messageId: string
  type: 'image' | 'file'
  url: string
  name: string
  size: number
  mimeType: string
}

export interface NotificationPreferences {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  missionUpdates: boolean
  newMessages: boolean
  donationAlerts: boolean
  systemAlerts: boolean
}
