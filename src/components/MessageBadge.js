import { useEffect , useState } from 'react'
import { CBadge , CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cibMessenger , cilX } from '@coreui/icons'
import Talk from 'talkjs'
import ChatBox from './chat/ChatBox'

export default function MessageBadge({ currentUser , host , houseId , houseName }) {
  const [unreadCount , setUnreadCount] = useState ( 0 )
  const [isHovered , setIsHovered] = useState ( false )
  const [isChatOpen , setIsChatOpen] = useState ( false ) // toggle

  useEffect ( () => {
    if (!currentUser?.id) {
      console.log ( 'No currentUser or ID, skipping TalkJS init' )
      return
    }

    let session

    const initializeTalkJS = async () => {
      try {
        await Talk.ready

        const me = new Talk.User ( {
          id: currentUser.id.toString () ,
          name: currentUser.username ,
          role: currentUser.role || 'unknown' ,
        } )

        session = new Talk.Session ( {
          appId: 'ts0p04FE' ,
          me ,
        } )

        console.log ( 'Session created for:' , currentUser.username , 'Role:' , currentUser.role )

        session.unreads.onChange ( unreadConversations => {
          const count = unreadConversations.reduce ( (sum , convo) => sum + convo.unreadMessageCount , 0 )
          console.log ( 'Unread conversations updated:' , count , 'for' , currentUser.username )
          setUnreadCount ( count )
        } )
      } catch (error) {
        console.error ( 'TalkJS initialization error:' , error )
      }
    }

    initializeTalkJS ()

    return () => {
      if (session) {
        console.log ( 'Destroying session for:' , currentUser.username )
        session.destroy ()
      }
    }
  } , [currentUser] )
  const toggleChat = () => setIsChatOpen ( prev => !prev )

  return (
    <>
      <CButton
        className={`position-fixed rounded-circle d-flex align-items-center justify-content-center me-2 ${isHovered ? 'bg-primary' : ''}`}
        style={{
          width: '48px' ,
          height: '48px' ,
          border: 'solid 1px' ,
          bottom: '20px' ,
          right: '20px' ,
          zIndex: 1000 ,
        }}
        onMouseEnter={() => setIsHovered ( true )}
        onMouseLeave={() => setIsHovered ( false )}
        onClick={toggleChat}
      >
        <CIcon
          icon={isChatOpen ? cilX : cibMessenger} // Toggle icon
          size="xl"
          className={`${isHovered ? 'text-white' : 'text-primary'}`}
        />

        {unreadCount > 0 &&
          <CBadge className="rounded-circle bg-info d-flex align-items-center justify-content-center position-absolute"
                  style={{
                    width: '18px' ,
                    height: '18px' ,
                    bottom: '-4px' ,
                    right: '-4px' ,
                    fontSize: '12px' ,
                  }}>{unreadCount}
          </CBadge>}
      </CButton>

      {isChatOpen && (
        <div
          style={{
            position: 'fixed' ,
            bottom: '70px' ,
            right: '20px' ,
            zIndex: 1000 ,
          }}
        >
          <ChatBox
            currentUser={currentUser}
            host={host}
            houseId={houseId}
            houseName={houseName}
          />
        </div>
      )}
    </>
  )
}