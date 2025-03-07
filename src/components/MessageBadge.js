import { useEffect , useState } from 'react'
import { CBadge , CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cibMessenger , cilChatBubble , cilX } from '@coreui/icons'
import Talk from 'talkjs'
import ChatBox from './chat/ChatBox'
import { useSelector } from 'react-redux'

export default function MessageBadge() {
  const currentUser = useSelector ( state => state.chat.currentUser )
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
        className={`position-fixed rounded-circle d-flex align-items-center justify-content-center me-2 ${isHovered ? 'bg-primary' : 'bg-white'}`}
        style={{
          width: '60px' ,
          height: '60px' ,
          border: 'solid red 1px' ,
          bottom: '60px' ,
          right: '80px' ,
          zIndex: 1000 ,
        }}
        onMouseEnter={() => setIsHovered ( true )}
        onMouseLeave={() => setIsHovered ( false )}
        onClick={toggleChat}
      >
        <CIcon
          icon={isChatOpen ? cilX : cilChatBubble}
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
            bottom: '140px' ,
            right: '80px' ,
            zIndex: 1000 ,
          }}
        >
          <ChatBox />
        </div>
      )}
    </>
  )
}