import { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL_USER } from '../../constants/api'
import { toast } from 'react-toastify'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell, CTableHead, CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

export default function AdminHostRequests(){
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchHostRequests();
  }, []);

  const fetchHostRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL_USER}/host-requests`);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load host requests');
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await axios.post(`${BASE_URL_USER}/host-requests/${requestId}/approve`);
      toast.success('Host request approved!');
      // Refresh the list
      fetchHostRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  return (
    <CCard>
      <CCardHeader>
        <h4>Host Requests</h4>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Username</CTableHeaderCell>
              <CTableHeaderCell>Phone</CTableHeaderCell>
              <CTableHeaderCell>Request Date</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {requests.map((request) => (
              <CTableRow key={request.id}>
                <CTableDataCell>{request.user.username}</CTableDataCell>
                <CTableDataCell>{request.user.phone}</CTableDataCell>
                <CTableDataCell>
                  {new Date(request.requestDate).toLocaleDateString()}
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge color="warning">{request.status}</CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="success"
                    size="sm"
                    onClick={() => handleApprove(request.id)}
                  >
                    Approve
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