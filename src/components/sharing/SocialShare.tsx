import { useState } from 'react'
import Image from 'next/image'
import { Share2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'
import { ShareData, SocialPlatform } from '@/types/sharing'

interface SocialShareProps {
  data: ShareData
  platforms?: SocialPlatform[]
  className?: string
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function SocialShare({
  data,
  platforms = ['facebook', 'twitter', 'whatsapp', 'telegram', 'instagram', 'tiktok', 'linkedin', 'email'],
  className = '',
  variant = 'default',
  size = 'default',
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const getPlatformIcon = (platform: SocialPlatform) => {
    const iconProps = { 
      className: "h-4 w-4", 
      width: 16, 
      height: 16,
      priority: true,
      loading: "eager",
    }
    
    switch (platform) {
      case 'facebook':
        return <Image src="/icons/facebook.svg" alt="Facebook" {...iconProps} />
      case 'twitter':
        return <Image src="/icons/twitter.svg" alt="Twitter" {...iconProps} />
      case 'whatsapp':
        return <Image src="/icons/whatsapp.svg" alt="WhatsApp" {...iconProps} />
      case 'telegram':
        return <Image src="/icons/telegram.svg" alt="Telegram" {...iconProps} />
      case 'instagram':
        return <Image src="/icons/instagram.svg" alt="Instagram" {...iconProps} />
      case 'tiktok':
        return <Share2 className="h-4 w-4" />
      case 'linkedin':
        return <Image src="/icons/linkedin.svg" alt="LinkedIn" {...iconProps} />
      case 'email':
        return <Share2 className="h-4 w-4" />
      default:
        return <Share2 className="h-4 w-4" />
    }
  }

  const getPlatformName = (platform: SocialPlatform) => {
    switch (platform) {
      case 'facebook':
        return 'Facebook'
      case 'twitter':
        return 'Twitter'
      case 'whatsapp':
        return 'WhatsApp'
      case 'telegram':
        return 'Telegram'
      case 'linkedin':
        return 'LinkedIn'
      case 'instagram':
        return 'Instagram'
      case 'tiktok':
        return 'TikTok'
      case 'email':
        return 'Email'
      default:
        return 'Compartilhar'
    }
  }

  const getShareUrl = (platform: SocialPlatform) => {
    const encodedUrl = encodeURIComponent(data.url)
    const encodedTitle = encodeURIComponent(data.title)
    const encodedDescription = encodeURIComponent(data.description)

    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
      case 'whatsapp':
        return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
      case 'telegram':
        return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
      case 'linkedin':
        return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`
      case 'instagram':
        // Instagram não tem API de compartilhamento direta, retornamos o perfil
        return 'https://instagram.com'
      case 'tiktok':
        // TikTok não tem API de compartilhamento direta, retornamos o perfil
        return 'https://tiktok.com'
      case 'email':
        return `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
      default:
        return data.url
    }
  }

  const handleShare = (platform: SocialPlatform) => {
    const url = getShareUrl(platform)

    if (platform === 'email') {
      window.location.href = url
    } else if (platform === 'instagram' || platform === 'tiktok') {
      // Para Instagram e TikTok, mostramos uma mensagem explicativa
      toast({
        title: `Compartilhar no ${getPlatformName(platform)}`,
        description: `Para compartilhar no ${getPlatformName(platform)}, copie o link e compartilhe através do aplicativo.`,
      })
      copyToClipboard()
    } else {
      window.open(
        url,
        'share-dialog',
        'width=800,height=600,toolbar=no,location=no'
      )
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data.url)
      setCopied(true)
      toast({
        title: 'Link copiado!',
        description: 'O link foi copiado para sua área de transferência.',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o link.',
        variant: 'destructive',
      })
    }
  }

  if (size === 'icon') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size="icon"
            className={className}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {platforms.map((platform) => (
            <DropdownMenuItem
              key={platform}
              onClick={() => handleShare(platform)}
            >
              <span className="mr-2">{getPlatformIcon(platform)}</span>
              {getPlatformName(platform)}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={copyToClipboard}>
            {copied ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            Copiar link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {platforms.map((platform) => (
        <Button
          key={platform}
          variant={variant}
          size={size}
          onClick={() => handleShare(platform)}
        >
          {getPlatformIcon(platform)}
          {size !== 'sm' && (
            <span className="ml-2">{getPlatformName(platform)}</span>
          )}
        </Button>
      ))}
      <Button
        variant={variant}
        size={size}
        onClick={copyToClipboard}
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        {size !== 'sm' && (
          <span className="ml-2">Copiar link</span>
        )}
      </Button>
    </div>
  )
}
