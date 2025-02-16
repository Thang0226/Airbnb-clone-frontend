import {CCol, CFormFeedback, CFormFloating, CFormInput, CFormLabel, CRow} from "@coreui/react";
import {ErrorMessage, Field} from "formik";

const UPTextInput = ({
                         label,
                         name,
                         required = false,
                         readOnly = false,
                         placeholder = ""
                     }) => (
    <CRow className="mb-3">
        <CCol md={12}>
            <CFormFloating>
                <Field
                    name={name}
                    as={CFormInput}
                    type="text"
                    id={name}
                    placeholder={placeholder}
                    className="form-control"
                    readOnly={readOnly}
                    style={readOnly ? {cursor: "not-allowed"} : {}}
                />
                <CFormLabel htmlFor={name}>
                    {label} {required && <span style={{color: 'red'}}>*</span>}
                </CFormLabel>
            </CFormFloating>
            <div style={{minHeight: "20px"}}>
                <ErrorMessage
                    name={name}
                    component={CFormFeedback}
                    className="d-block text-danger mt-1 ps-2"
                />
            </div>
        </CCol>
    </CRow>
);

export default UPTextInput;