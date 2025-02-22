import { useEffect, useState } from 'react'
import axios from 'axios'
import emailjs from '@emailjs/browser'
import { BASE_URL_USER } from '../../constants/api'
import { toast } from 'react-toastify'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell, CTableHead, CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import ConfirmWindow from '../ConfirmWindow'

export default function HostRequests(){
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approveVisible, setApproveVisible] = useState(false);
  const [declineVisible, setDeclineVisible] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    document.title = 'Admin | Host Requests';
    const getRequests = async () => {
      try {
        const response = await axios.get(`${BASE_URL_USER}/host-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Failed to load host requests');
      }
    }
    getRequests();
  }, [approveVisible, declineVisible]);

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setApproveVisible(true);
  };

  const handleAfterConfirmApprove = async () => {
    try {
      await axios.post(`${BASE_URL_USER}/host-requests/${selectedRequest.id}/approve`,
        {}, // empty body
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success('Host request approved');

      emailjs
        .send(
          "service_p6wbmae", // Service ID
          "template_piwv2fk", // Template ID
          {
            from_name: "Admin",
            to_email: selectedRequest.user.email,
            to_name: selectedRequest.user.fullName
          },
          "1N9KYwqlDUuHvGQMW" // Public Key
        )
        .then(
          (response) => {
            console.log("Email sent successfully:", response);
          },
          (error) => {
            console.error("Failed to send email:", error);
          }
        );

      setApproveVisible(false);
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  }

  const handleDecline = (request) => {
    setSelectedRequest(request);
    setDeclineVisible(true);
  };

  const handleAfterConfirmDecline = async (message) => {
    try {
      await axios.post(`${BASE_URL_USER}/host-requests/${selectedRequest.id}/decline`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success('Host request declined');

      emailjs
        .send(
          "service_p6wbmae",
          "template_4082lmo",
          {
            from_name: "Admin",
            to_email: selectedRequest.user.email,
            to_name: selectedRequest.user.fullName,
            message: message,
          },
          "1N9KYwqlDUuHvGQMW"
        )
        .then(
          (response) => {
            console.log("Email sent successfully:", response);
          },
          (error) => {
            console.error("Failed to send email:", error);
          }
        );

      setDeclineVisible(false);
    } catch (error) {
      console.error('Error declining request:', error);
      toast.error('Failed to decline request');
    }
  };

  return (
    <>
      <CCard>
        <CCardHeader className="text-center p-4">
          <h3>Host Requests</h3>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead className="fs-5">
              <CTableRow>
                <CTableHeaderCell>Username</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Phone</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Request Date</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {requests.map((request) => (
                <CTableRow key={request.id} className="align-middle fs-5">
                  <CTableDataCell>{request.user.username}</CTableDataCell>
                  <CTableDataCell className="text-center">{request.user.phone}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    {new Date(request.requestDate).toLocaleDateString()}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton
                      color="success"
                      className="fs-5 cursor-pointer text-white me-3"
                      onClick={() => handleApprove(request)}
                    >
                      Approve
                    </CButton>
                    <CButton
                      color="secondary"
                      className="fs-5 cursor-pointer text-white"
                      onClick={() => handleDecline(request)}
                    >
                      Decline
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
      <ConfirmWindow
        title={`Confirm Approve host registration from ${selectedRequest && (selectedRequest.user.username || '')}`}
        label="Message:"
        visible={approveVisible}
        setVisible={setApproveVisible}
        handleAfterConfirm={handleAfterConfirmApprove}
      />
      <ConfirmWindow
        title={`Confirm Decline host registration from ${selectedRequest && (selectedRequest.user.username || '')}`}
        label="Reason:"
        visible={declineVisible}
        setVisible={setDeclineVisible}
        handleAfterConfirm={(message) => handleAfterConfirmDecline(message)}
      />
    </>
  );
}