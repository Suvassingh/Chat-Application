import React from 'react'
import {useChatStore} from "../store/useChatStore"
import {useAuthStore} from "../store/useAuthStore"
import {useEffect} from "react" 
function ChatContainer() {
  const { selectedUser, getMessagesByUserId, messages } = useChatStore();
  const {authUser} = useAuthStore();
  useEffect(
    () => {
      getMessagesByUserId(selectedUser._id);
    },
    selectedUser,
    getMessagesByUserId
  );
  return (
    <div>
      ChatContainer
    </div>
  )
}

export default ChatContainer
