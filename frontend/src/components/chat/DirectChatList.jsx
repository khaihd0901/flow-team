
import { useChatStore } from '@/stores/chatStore'
import DirectChatCard from './DirectChatCard'
const DirectChatList = ({setOpen}) => {
  const { conversations } = useChatStore()
  if(!conversations) return

  const directChats = conversations.filter((c) => c.type === 'direct')

  return (
    <div className='flex-1 overflow-y-auto p-2 space-y-2'>
      {
        directChats.map((conversation) =>(
          <DirectChatCard
          setOpen={setOpen}
          key={conversation._id}
          conversation={conversation}
          />
        ))
      }
    </div>
  )
}

export default DirectChatList