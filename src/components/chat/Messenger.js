import React , { useRef , useEffect } from 'react'
import Talk from 'talkjs'
import { CContainer } from '@coreui/react'
import { useSelector } from 'react-redux'

export default function Messenger() {
  const currentUser = useSelector(state => state.chat.currentUser);
  const inboxRef = useRef ( null )
  console.log ( currentUser )

  useEffect ( () => {
    // Check if user has valid information
    if (!currentUser || !currentUser.id || !currentUser.username) {
      console.error ( 'Invalid user information for TalkJS' )
      return
    }

    let talkInbox = null
    let talkSession = null

    const initializeTalkJS = async () => {
      try {
        await Talk.ready

        // Create TalkJS user
        const me = new Talk.User ( {
          id: localStorage.getItem("userId").toString () ,
          name: localStorage.getItem("username") ,
          role: localStorage.getItem("role") || 'unknown' ,
        } )

        // Create TalkJS session
        const session = new Talk.Session ( {
          appId: 'ts0p04FE' ,
          me: me ,
        } )
        talkSession = session

        // Create inbox
        const inbox = session.createInbox ( {
          theme: 'theme' ,
        } )
        talkInbox = inbox

        // Mount inbox if ref exists
        if (inboxRef.current) {
          inbox.mount ( inboxRef.current )
        }

      } catch (error) {
        console.error ( 'Error initializing TalkJS Messenger:' , error )
      }

      // Return cleanup function
      return () => {
        if (talkInbox) {
          talkInbox.destroy ()
        }
        if (talkSession) {
          talkSession.destroy ()
        }
      }
    }

    const cleanupPromise = initializeTalkJS ()

    // Cleanup function
    return () => {
      cleanupPromise.then ( cleanup => cleanup () )
    }
  } , [currentUser] )

  // Render only if user exists
  if (!currentUser || !currentUser.id) {
    return (
      <CContainer className="my-4">
        <div>Please log in to access messenger</div>
      </CContainer>
    )
  }

  return (
    <CContainer className="my-4">
      <div
        ref={inboxRef}
        style={{
          height: '500px' ,
          width: '100%' ,
          minHeight: '300px' ,
        }}
      />
    </CContainer>
  )
}