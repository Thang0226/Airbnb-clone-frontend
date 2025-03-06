import React , { useRef , useEffect , useState } from 'react'
import Talk from 'talkjs'
import { useSelector } from 'react-redux'

export default function ChatBox() {
  const currentUser = useSelector ( state => state.chat.currentUser )
  const host = useSelector ( state => state.chat.chatHost )
  const houseId = useSelector ( state => state.houses.house.id )
  const houseName = useSelector ( state => state.houses.house.houseName )
  const chatboxRef = useRef ( null )

  useEffect ( () => {
    let talkSession = null
    let chatbox = null

    const initializeTalkJS = async () => {
      try {
        // Ensure TalkJS is ready
        await Talk.ready

        // Create TalkJS users
        const me = new Talk.User ( {
          id: currentUser.id.toString () ,
          name: currentUser.username ,
          role: currentUser.role ,
        } )

        const other = new Talk.User ( {
          id: host.id.toString () ,
          name: host.username ,
          role: 'ROLE_HOST' ,
        } )

        // Create TalkJS session
        talkSession = new Talk.Session ( {
          appId: 'ts0p04FE' ,
          me: me ,
        } )

        // Create a unique conversation ID for this specific user-host interaction
        const conversationId = `house-${houseId}-user-${currentUser.id}-host-${host.id}`

        // Create or get conversation
        const conversation = talkSession.getOrCreateConversation ( conversationId )

        // Add participants to the conversation
        conversation.setParticipant ( me )
        conversation.setParticipant ( other )

        // Set conversation attributes
        conversation.setAttributes ( {
          subject: `Chat about ${houseName}` ,
          custom: {
            houseId: houseId.toString () ,
            userIds: `${currentUser.id.toString ()},${host.id.toString ()}` ,
          } ,
        } )

        // Create and mount chatbox
        chatbox = talkSession.createChatbox ( {
          theme: 'theme' ,
        } )
        chatbox.select ( conversation )

        if (chatboxRef.current) {
          chatbox.mount ( chatboxRef.current )
          setTimeout ( () => {
            const welcomeMessage = `Hello! I'm interested in the house #${houseId}`
            conversation.sendMessage ( welcomeMessage ).catch ( error => {
              console.error ( 'Failed to send welcome message:' , error )
            } )
          } , 1000 )
        }
      } catch (error) {
        console.error ( 'Error initializing TalkJS:' , error )
      }

      // Cleanup function
      return () => {
        if (chatbox) chatbox.destroy ()
        if (talkSession) talkSession.destroy ()
      }
    }
    initializeTalkJS ().catch ( error => console.error ( 'Initialization failed:' , error ) )

    // Cleanup function for useEffect
    return () => {
      if (chatbox) chatbox.destroy ()
      if (talkSession) talkSession.destroy ()
    }
  } , [currentUser , host , houseId] )

  return (
    <div
      ref={chatboxRef}
      style={{
        height: '400px' ,
        width: '100%' ,
        maxWidth: '400px' ,
        margin: '0 auto' ,
      }}
    />
  )
}