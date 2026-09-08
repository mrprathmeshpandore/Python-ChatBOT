import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export function useChats() {
  const token = useAuthStore((state) => state.token)
  return useQuery({
    queryKey: ['chats', token],
    queryFn: async () => {
      if (!token) return []
      const { data } = await api.get('/chats')
      return data
    },
    enabled: !!token
  })
}

export function useChat(chatId?: string) {
  const token = useAuthStore((state) => state.token)
  return useQuery({
    queryKey: ['chat', chatId, token],
    queryFn: async () => {
      const { data } = await api.get(`/chats/${chatId}`)
      return data
    },
    enabled: !!chatId && chatId !== 'new'
  })
}

export function useMessages(chatId?: string) {
  const token = useAuthStore((state) => state.token)
  return useQuery({
    queryKey: ['messages', chatId, token],
    queryFn: async () => {
      const { data } = await api.get(`/messages/${chatId}`)
      return data
    },
    enabled: !!chatId && chatId !== 'new'
  })
}

export function useCreateChat() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (title: string) => {
      const { data } = await api.post('/chats', { title })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    }
  })
}

