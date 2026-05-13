
import { useChatStore } from '@/stores/chatStore'
import GroupChatCard from './GroupChatCard'
const GroupChatList = () => {
  const { conversations } = useChatStore()

  if(!conversations) return

  const groupChats = conversations.filter(c => c.type === 'group')
  return (
    <div className='flex-1 overflow-y-auto p-2 space-y-2'>
      {
        groupChats.map((conversation) =>(
          <GroupChatCard
          key={conversation._id}
          conversation={conversation}
          />
        ))
      }
    </div>
  )
}

export default GroupChatList