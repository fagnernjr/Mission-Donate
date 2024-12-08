import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MessageSquare, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { MissionUpdate } from '@/types/communication'

interface MissionUpdatesProps {
  updates: MissionUpdate[]
  onLoadMore?: () => void
  isLoading?: boolean
  onShare?: (update: MissionUpdate) => void
  onComment?: (update: MissionUpdate) => void
}

export function MissionUpdates({
  updates,
  onLoadMore,
  isLoading,
  onShare,
  onComment,
}: MissionUpdatesProps) {
  const renderMediaGallery = (mediaUrls: string[]) => {
    if (mediaUrls.length === 0) return null

    if (mediaUrls.length === 1) {
      return (
        <img
          src={mediaUrls[0]}
          alt="Mídia da atualização"
          className="w-full h-auto rounded-lg object-cover"
        />
      )
    }

    return (
      <Carousel className="w-full">
        <CarouselContent>
          {mediaUrls.map((url, index) => (
            <CarouselItem key={index}>
              <img
                src={url}
                alt={`Mídia ${index + 1} da atualização`}
                className="w-full h-auto rounded-lg object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
  }

  const renderUpdate = (update: MissionUpdate) => {
    return (
      <Card key={update.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={update.author.avatarUrl}
                  alt={update.author.name}
                />
                <AvatarFallback>
                  {update.author.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{update.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {update.author.name} •{' '}
                  {format(update.createdAt, "dd 'de' MMMM 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {onComment && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onComment(update)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              )}
              {onShare && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShare(update)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm whitespace-pre-wrap">{update.content}</p>
            {update.mediaUrls && update.mediaUrls.length > 0 && (
              <div className="mt-4">{renderMediaGallery(update.mediaUrls)}</div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <ScrollArea
      className="h-[calc(100vh-16rem)]"
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
      <div className="space-y-4 p-4">
        {updates.length > 0 ? (
          updates.map(renderUpdate)
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium">
              Nenhuma atualização disponível
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              As atualizações da missão aparecerão aqui
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
