import { LoginSocialGoogle, LoginSocialFacebook } from 'reactjs-social-login';

import { CCard, CCardBody, CContainer, CRow, CCol, CButton, CImage } from '@coreui/react';

const SocialLoginComponent = () => {
  const onLoginSuccess = (response) => {
    console.log('Login Success:', response);
  };

  const onLoginFailure = (error) => {
    console.error('Login Failed:', error);
  };

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard>
            <CCardBody>
              {/* Google Login */}
              <LoginSocialGoogle
                client_id="YOUR_GOOGLE_CLIENT_ID"
                scope="openid profile email"
                onResolve={onLoginSuccess}
                onReject={onLoginFailure}
              >
                <CButton
                  color="light"
                  className="mb-3 w-100 d-flex align-items-center justify-content-center"
                >
                  <CImage
                    src="google-icon.png"
                    className="me-2"
                    width={20}
                    height={20}
                  />
                  Sign in with Google
                </CButton>
              </LoginSocialGoogle>

              {/* Facebook Login */}
              <LoginSocialFacebook
                appId="YOUR_FACEBOOK_APP_ID"
                onResolve={onLoginSuccess}
                onReject={onLoginFailure}
              >
                <CButton
                  color="facebook"
                  className="w-100 d-flex align-items-center justify-content-center"
                >
                  <CImage
                    src="facebook-icon.png"
                    className="me-2"
                    width={20}
                    height={20}
                  />
                  Sign in with Facebook
                </CButton>
              </LoginSocialFacebook>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default SocialLoginComponent;