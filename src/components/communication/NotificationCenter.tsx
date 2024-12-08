import { useState } from 'react'
import { Bell, Settings, X } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Notification,
  NotificationPreferences,
  NotificationType,
} from '@/types/communication'

interface NotificationCenterProps {
  notifications: Notification[]
  preferences: NotificationPreferences
  onMarkAsRead: (notificationId: string) => void
  onMarkAllAsRead: () => void
  onUpdatePreferences: (preferences: NotificationPreferences) => void
  onLoadMore?: () => void
  isLoading?: boolean
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'mission_update':
      return '📢'
    case 'donation':
      return '💝'
    case 'message':
      return '💬'
    case 'system':
      return '⚙️'
    default:
      return '📌'
  }
}

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'mission_update':
      return 'bg-blue-500'
    case 'donation':
      return 'bg-green-500'
    case 'message':
      return 'bg-purple-500'
    case 'system':
      return 'bg-orange-500'
    default:
      return 'bg-gray-500'
  }
}

export function NotificationCenter({
  notifications,
  preferences,
  onMarkAsRead,
  onMarkAllAsRead,
  onUpdatePreferences,
  onLoadMore,
  isLoading,
}: NotificationCenterProps) {
  const [showPreferences, setShowPreferences] = useState(false)
  const unreadCount = notifications.filter((n) => !n.readAt).length

  const renderNotification = (notification: Notification) => {
    return (
      <div
        key={notification.id}
        className={`p-4 border-b ${
          !notification.readAt ? 'bg-muted/50' : ''
        } hover:bg-muted/30 transition-colors`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-full ${getNotificationColor(
                notification.type
              )} text-white flex items-center justify-center`}
            >
              {getNotificationIcon(notification.type)}
            </div>
            <div>
              <h4 className="font-medium">{notification.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {notification.message}
              </p>
              <span className="text-xs text-muted-foreground mt-2 block">
                {format(notification.createdAt, "dd 'de' MMMM 'às' HH:mm", {
                  locale: ptBR,
                })}
              </span>
            </div>
          </div>
          {!notification.readAt && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  const renderPreferences = () => {
    return (
      <div className="space-y-6 p-4">
        <div className="space-y-4">
          <h3 className="font-medium">Notificações por Email</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="email-notifications">
                Receber notificações por email
              </label>
              <Switch
                id="email-notifications"
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) =>
                  onUpdatePreferences({
                    ...preferences,
                    emailNotifications: checked,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Notificações Push</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="push-notifications">
                Receber notificações push
              </label>
              <Switch
                id="push-notifications"
                checked={preferences.pushNotifications}
                onCheckedChange={(checked) =>
                  onUpdatePreferences({
                    ...preferences,
                    pushNotifications: checked,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Tipos de Notificação</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="mission-updates">Atualizações de missão</label>
              <Switch
                id="mission-updates"
                checked={preferences.missionUpdates}
                onCheckedChange={(checked) =>
                  onUpdatePreferences({
                    ...preferences,
                    missionUpdates: checked,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="new-messages">Novas mensagens</label>
              <Switch
                id="new-messages"
                checked={preferences.newMessages}
                onCheckedChange={(checked) =>
                  onUpdatePreferences({
                    ...preferences,
                    newMessages: checked,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="donation-alerts">Alertas de doação</label>
              <Switch
                id="donation-alerts"
                checked={preferences.donationAlerts}
                onCheckedChange={(checked) =>
                  onUpdatePreferences({
                    ...preferences,
                    donationAlerts: checked,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="system-alerts">Alertas do sistema</label>
              <Switch
                id="system-alerts"
                checked={preferences.systemAlerts}
                onCheckedChange={(checked) =>
                  onUpdatePreferences({
                    ...preferences,
                    systemAlerts: checked,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Notificações</SheetTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreferences(!showPreferences)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        {showPreferences ? (
          renderPreferences()
        ) : (
          <ScrollArea
            className="flex-1 h-[calc(100vh-8rem)]"
            onScrollCapture={(e) => {
              const target = e.currentTarget
              if (
                target.scrollHeight - target.scrollTop === target.clientHeight &&
                onLoadMore &&
                !isLoading
              ) {
                onLoadMore()
              }
            }}
          >
            {notifications.length > 0 ? (
              notifications.map(renderNotification)
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">
                  Nenhuma notificação no momento
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Você será notificado quando houver novidades
                </p>
              </div>
            )}
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  )
}
