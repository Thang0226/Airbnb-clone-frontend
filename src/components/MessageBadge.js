import { useEffect , useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CBadge , CLink } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cibMessenger } from '@coreui/icons'
import Talk from 'talkjs'

export default function MessageBadge({ currentUser }) {
  const [unreadCount , setUnreadCount] = useState ( 0 )
  const [isHovered , setIsHovered] = useState ( false )
  const location = useLocation ()
  useEffect ( () => {
    if (!currentUser?.id) {
      console.log ( 'No currentUser or ID, skipping TalkJS init' )
      return
    }

    let session

    const initializeTalkJS = async () => {
      try {
        await Talk.ready
        console.log ( 'TalkJS ready for user:' , currentUser.username )

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
          const count = unreadConversations.length
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
  const messengerPath = currentUser?.role === 'ROLE_HOST' ? '/host/messenger' : '/messenger'

  return (
    <CLink href={`/#${messengerPath}`}
           className={`position-relative rounded-circle d-flex align-items-center justify-content-center me-2 ${isHovered ? 'bg-primary' : ''}`}
           style={{ width: '48px' , height: '48px' , border: 'solid 1px' }}
           onMouseEnter={() => setIsHovered ( true )}
           onMouseLeave={() => setIsHovered ( false )}>
      <CIcon icon={cibMessenger} size="xl" className={`${isHovered ? 'text-white' : 'text-primary'}`} />

      {location.pathname !== '/messenger' && unreadCount > 0 &&
        <CBadge className="rounded-circle bg-info d-flex align-items-center justify-content-center position-absolute"
                style={{
                  width: '18px' ,
                  height: '18px' ,
                  bottom: '-4px' ,
                  right: '-4px' ,
                  fontSize: '12px' ,
                }}>{unreadCount}
        </CBadge>}
    </CLink>
  )
}