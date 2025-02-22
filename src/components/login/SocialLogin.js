import { LoginSocialGoogle, LoginSocialFacebook } from 'reactjs-social-login';

import { CCard, CCardBody, CContainer, CRow, CCol, CButton, CImage } from '@coreui/react';
import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const SocialLoginComponent = () => {
  const onLoginSuccess = (response) => {
    console.log('Login Success:', response);
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
                  color="light"
                  className="d-flex align-items-center"
                  style={{width: '90%'}}
                >
                  <FcGoogle size={25} className="me-2"/>
                  Sign in with Google
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