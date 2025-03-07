import { useState, useEffect } from 'react'
import { CDropdown, CDropdownDivider, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { BASE_URL } from '../constants/api'
import { useSelector, useDispatch } from 'react-redux'
import { resetAccount } from '../redux/slices/accountSlice'
import { fetchUserProfile } from '../redux/slices/userProfileSlice'
import { logoutAPI } from '../services/authService'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function UserDropdown() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')

  const { userProfile } = useSelector((state) => state.userProfile)
  const {role} = useSelector((state) => state.account)
  const [avatarUrl, setAvatarUrl] = useState(`${BASE_URL}/images/default.jpg`)

  useEffect(() => {
    if (username) {
      dispatch(fetchUserProfile(username))
    }
  }, [dispatch, username])

  useEffect(() => {
    if (token && userProfile?.avatar) {
      setAvatarUrl(`${BASE_URL}/images/${userProfile.avatar}`)
    } else {
      setAvatarUrl(`${BASE_URL}/images/default.jpg`)
    }
  }, [userProfile, token])

  const handleLogout = async () => {
    try {
      await logoutAPI()
      toast.info("Logged out successfully", { hideProgressBar: true })
      dispatch(resetAccount())
      setAvatarUrl(`${BASE_URL}/images/default.jpg`)
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data || err.message, { hideProgressBar: true })
    }
  }

  const handleChangePassword = () => {
    navigate('/user/change-password')
  }

  return (
    <CDropdown variant="dropdown" popper={true} className="bg-gradient rounded">
      <CDropdownToggle
        caret={false}
        color="primary"
        variant="outline"
        className="d-flex align-items-center gap-2"
        style={{
          borderRadius: '50px',
          height: '48px',
        }}
      >
        <i className="bi bi-list" style={{ fontSize: '1.2rem' }}></i>
        <img
          src={avatarUrl}
          alt="avatar"
          className="border border-white rounded-pill"
          style={{
            width: '32px',
            height: '32px',
            objectFit: 'cover',
          }}
          onError={() => setAvatarUrl(`${BASE_URL}/images/default.jpg`)}
        />
      </CDropdownToggle>
      <CDropdownMenu>
        {token ? (
          <>
            <CDropdownItem  href={role === "ROLE_ADMIN"?("/#/admin/profile") : ("/#/profile")}>
              {username}
            </CDropdownItem>
            <CDropdownDivider />
            <CDropdownItem onClick={handleChangePassword} style={{ cursor: 'pointer' }}>
              Change Password
            </CDropdownItem>
            <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
              Logout
            </CDropdownItem>
          </>
        ) : (
          <>
            <CDropdownItem href="/#/register">Register</CDropdownItem>
            <CDropdownItem href="/#/login">Login</CDropdownItem>
          </>
        )}
      </CDropdownMenu>
    </CDropdown>
  )
}