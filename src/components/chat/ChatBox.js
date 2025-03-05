import React , { useRef , useEffect , useState } from 'react'
import Talk from 'talkjs'

export default function ChatBox({ currentUser , host , houseId }) {
  const chatboxRef = useRef ( null )
  const [session , setSession] = useState ( null )
  const [conversation , setConversation] = useState ( null )

  useEffect ( () => {
    let talkSession = null
    let talkConversation = null
    let chatbox = null

    const initializeTalkJS = async () => {
      try {
        // Ensure TalkJS is ready
        await Talk.ready

        // Create TalkJS users
        const me = new Talk.User ( {
          id: currentUser.id ,
          name: currentUser.username ,
          role: currentUser.role ,
        } )

        const other = new Talk.User ( {
          id: host.id ,
          name: host.username ,
          role: 'ROLE_HOST' ,
        } )

        // Create TalkJS session
        talkSession = new Talk.Session ( {
          appId: 'ts0p04FE' ,
          me: me ,
        } )
        setSession ( talkSession )

        // Create or get conversation
        const conversationId = `house-${houseId}-chat`
        talkConversation = talkSession.getOrCreateConversation ( conversationId )

        // Ensure both participants are added
        talkConversation.setParticipant ( me )
        talkConversation.setParticipant ( other )

        // Set conversation attributes
        talkConversation.setAttributes ( {
          subject: `Chat about House ${houseId}` ,
          // You can add more custom attributes if needed
        } )
        setConversation ( talkConversation )

        // Create and mount chatbox
        chatbox = talkSession.createChatbox ()
        chatbox.select ( talkConversation )

        if (chatboxRef.current) {
          chatbox.mount ( chatboxRef.current )
        }

        // Optional: Send a first message to ensure chat is active
        const welcomeMessage = `Hello! I'm interested in the house #${houseId}`
        talkConversation.sendMessage ( welcomeMessage )

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