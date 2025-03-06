import React , { useRef , useEffect , useState } from 'react'
import Talk from 'talkjs'

export default function ChatBox({ currentUser , host , houseId , houseName }) {
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
            houseId: houseId ,
            userIds: `${currentUser.id.toString ()},${host.id.toString ()}` ,
          } ,
        } )

        // Create and mount chatbox
        chatbox = talkSession.createChatbox ( {
          theme: 'theme',
        } )
        chatbox.select ( conversation )

        if (chatboxRef.current) {
          chatbox.mount ( chatboxRef.current )
        }

        // Optional: Send a first message to ensure chat is active
        const welcomeMessage = `Hello! I'm interested in the house ${houseName}`
        conversation.sendMessage ( welcomeMessage )

      } catch (error) {
        console.error ( 'Error initializing TalkJS:' , error )
      }

      // Cleanup function
      return () => {
        if (chatbox) {
          chatbox.destroy ()
        }
        if (talkSession) {
          talkSession.destroy ()
        }
      }
    }

    const cleanupPromise = initializeTalkJS ()

    // Cleanup function for useEffect
    return () => {
      cleanupPromise.then ( cleanup => cleanup () )
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