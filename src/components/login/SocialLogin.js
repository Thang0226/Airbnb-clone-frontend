import { LoginSocialGoogle } from 'reactjs-social-login';

import { CCard, CCardBody, CContainer, CRow, CCol, CButton } from '@coreui/react';
import { FcGoogle } from "react-icons/fc";
import { toast } from 'react-toastify'
import axios from 'axios'
import { BASE_URL_USER } from '../../constants/api'
import { deletePassword, setRole, setToken, setUsername } from '../../redux/slices/accountSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ROLE_ADMIN } from '../../constants/roles'
import "./login_styles.css"

const SocialLoginComponent = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onLoginSuccess = async (response) => {
    // console.log('Login Success:', response)
    let data = response.data;
    let ggData = {
      email: data.email,
      username: data.name,
      fullName: data.name
    }
    await axios.post(`${BASE_URL_USER}/login-gg`, ggData)
      .then(res => {
        // console.log(res);
        toast.success("Login successful", {hideProgressBar: true});
        const user = res.data;
        const role = user.authorities[0].authority;
        dispatch(setToken(user.token))
        dispatch(setUsername(user.username))
        dispatch(setRole(role))
        dispatch(deletePassword())
        localStorage.setItem('userId', user.id)
        localStorage.setItem('username', user.username)
        localStorage.setItem('role', role)
        localStorage.setItem('token', user.token)
        localStorage.setItem('loggedIn', JSON.stringify(true))
        if (role === ROLE_ADMIN) {
          return navigate('/admin');
        }
        navigate('/')
      }).catch(err => toast.error(err.response.data, { hideProgressBar: true }))
  };

  const onLoginFailure = (error) => {
    console.error('Login Failed:', error);
  };

  return (
    <CContainer>
      <CRow className="justify-content-center my-0">
        <CCol md={6}>
          <CCard className="border-0">
            <CCardBody className="py-0">
              {/* Google Login */}
              <LoginSocialGoogle
                client_id="475971060076-mpnvdf9jjj60ciku491an66j8ue9rl47.apps.googleusercontent.com"
                scope="openid profile email"
                onResolve={onLoginSuccess}
                onReject={onLoginFailure}
                className="d-flex justify-content-center"
              >
                <CButton
                  color="danger"
                  className="d-flex align-items-center justify-content-center gg-button"
                >
                  <FcGoogle size={25} className="me-2"/>
                  Login with Google
                </CButton>
              </LoginSocialGoogle>

              {/*/!* Facebook Login *!/*/}
              {/*<LoginSocialFacebook*/}
              {/*  appId="YOUR_FACEBOOK_APP_ID"*/}
              {/*  onResolve={onLoginSuccess}*/}
              {/*  onReject={onLoginFailure}*/}
              {/*  className="d-flex justify-content-center"*/}
              {/*>*/}
              {/*  <CButton*/}
              {/*    color="light"*/}
              {/*    className="d-flex align-items-center"*/}
              {/*    style={{width: '100%'}}*/}
              {/*  >*/}
              {/*    <FaFacebookSquare size={25} color="#335AA6" className="me-2"/>*/}
              {/*    Sign in with Facebook*/}
              {/*  </CButton>*/}
              {/*</LoginSocialFacebook>*/}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default SocialLoginComponent;