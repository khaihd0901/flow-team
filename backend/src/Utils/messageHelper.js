

export const updateConversationAfterCreateMessage = (conversation, message, senderId) =>{
    conversation.set({
        seenBy: [],
        lastMessageAt: message.createdAt,
        lastMessage: {
            _id: message._id,
            content: message.content,
            senderId: senderId,
            createdAt: message.createdAt,
        }
    });

    conversation.participants.forEach((p) =>{
        const memberId = p.userId.toString();
        const isSender = memberId === senderId.toString();
        const prevCount = conversation.unReadCounts.get(memberId) || 0;

        conversation.unReadCounts.set(memberId, isSender ? 0 : prevCount + 1);
    })
}
export const emitMessage = (io,conversation,message) =>{
    io.to(conversation._id.toString()).emit("new-message", {
        message,
        conversation: {
            _id: conversation._id,
            lastMessage: conversation.lastMessage,
            lastMessageAt: conversation.lastMessageAt,
        },
        unReadCounts: conversation.unReadCounts
    })
}