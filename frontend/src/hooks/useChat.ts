import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useChats() {
  return useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const { data } = await api.get('/chats')
      return data
    }
  })
}

export function useChat(chatId?: string) {
  return useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const { data } = await api.get(`/chats/${chatId}`)
      return data
    },
    enabled: !!chatId && chatId !== 'new'
  })
}

export function useMessages(chatId?: string) {
  return useQuery({
    queryKey: ['messages', chatId],
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
