import React from "react";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from "@coreui/react";

export const ConfirmModal = ({ visible, onClose, onConfirm, user }) => {
  if (!user) return null;

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader closeButton>
        <CModalTitle>Confirm</CModalTitle>
      </CModalHeader>
      <CModalBody>
        Are you sure you want to {user.status === "ACTIVE" ? "lock" : "unlock"} user <strong>{user.username}</strong>?
      </CModalBody>
      <CModalFooter>
        <CButton
          color={user.status === "ACTIVE" ? "warning" : "success"}
          onClick={onConfirm}
          className="text-white"
        >
          {user.status === "ACTIVE" ? "Lock" : "Unlock"}
        </CButton>
        <CButton color="secondary" onClick={onClose}>Cancel</CButton>
      </CModalFooter>
    </CModal>
  );
};
