import React from "react";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from "@coreui/react";

export const CheckInAndCheckOut = ({ visible, onClose, onConfirm, booking, action }) => {
  if (!booking) return null;

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader closeButton>
        <CModalTitle>
          {action === "check-in" ? "Confirm Check-in" : "Confirm Check-out"}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>
          Are you sure you want to <strong>{action}</strong> for the {" "}
          <strong>{booking.houseName}</strong>?
        </p>
        <p>
          {action === "check-in"
            ? "Once checked in, the booking status will be updated, and the house will be marked as rented."
            : "Once checked out, the booking will be completed, and the house will be available for new reservations."}
        </p>
      </CModalBody>
      <CModalFooter>
        <CButton
          color={action === "check-in" ? "primary" : "secondary"}
          onClick={onConfirm}
          className="text-white"
        >
          {action === "check-in" ? "Check-in " : "Check-out"}
        </CButton>
        <CButton
          color="warning"
          className="text-white"
          onClick={onClose}
        >
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  );
};
