import React from 'react'
import {useAuthStore} from "../store/useAuthStore"
function ChatPage() {
  const {logout} = useAuthStore();
  return (
    <div className="z-0">
      chatpage
      <button onClick={logout}> logout</button>
    </div>
  )
}

export default ChatPage
