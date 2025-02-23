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

export default function HostRequests(){
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    document.title = 'Admin | Host Requests';
    fetchHostRequests();
  }, []);

  const token = localStorage.getItem('token');

  const fetchHostRequests = async () => {
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
  };

  const handleApprove = async (requestId) => {
    let response;
    try {
      response = await axios.post(`${BASE_URL_USER}/host-requests/${requestId}/approve`,
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
            from_name: "Airbnb-clone App",
            to_email: "thang.nd0226@gmail.com",
            to_name: "Admin",
            message: "Accepted new host registration: \n\tUsername: " + response.data,
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

      await fetchHostRequests(); // Refresh the list

    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  const handleDecline = async (requestId) => {
    let response;
    try {
      response = await axios.post(`${BASE_URL_USER}/host-requests/${requestId}/decline`,
        {}, // empty body
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
          "template_piwv2fk",
          {
            from_name: "Airbnb-clone App",
            to_email: "thang.nd0226@gmail.com",
            to_name: "Admin",
            message: "Declined new host registration. \n\tUsername: " + response.data + "\nUser account is still created.",
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

      await fetchHostRequests();

    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  return (
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
                  {new Intl.DateTimeFormat("en-GB").format(new Date(request.requestDate))}
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CButton
                    color="success"
                    className="fs-5 cursor-pointer text-white me-3"
                    onClick={() => handleApprove(request.id)}
                  >
                    Approve
                  </CButton>
                  <CButton
                    color="secondary"
                    className="fs-5 cursor-pointer text-white"
                    onClick={() => handleDecline(request.id)}
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
  );
}