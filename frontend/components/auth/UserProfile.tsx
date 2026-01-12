import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getAvatarById } from '@/lib/avatars'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Crown, Star, Trophy } from 'lucide-react'

export const UserProfile: React.FC = () => {
  const { user, isPremium, premiumUntil } = useAuth()

  if (!user) return null

  const avatar = getAvatarById(user.user_metadata?.avatar_id)
  const username = user.user_metadata?.username || user.email?.split('@')[0]
  const xp = user.user_metadata?.xp || 0
  const level = user.user_metadata?.level || 1

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar?.image} alt={username} />
          <AvatarFallback>
            {username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isPremium && (
          <div className="absolute -top-1 -right-1">
            <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center">
              <Crown className="h-3 w-3 text-yellow-500" />
            </Badge>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-foreground truncate">
            {username}
          </p>
          {isPremium && (
            <Badge variant="secondary" className="text-xs">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
          <span className="flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Level {level}
          </span>
          <span className="flex items-center">
            <Trophy className="w-3 h-3 mr-1" />
            {xp} XP
          </span>
        </div>
      </div>
    </div>
  )
}