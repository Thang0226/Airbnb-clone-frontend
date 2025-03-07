import {CCol, CFormFeedback, CFormFloating, CFormInput, CFormLabel, CRow} from "@coreui/react";
import {ErrorMessage, Field} from "formik";

const FORMTextInput = ({
                         label = "",
                         name = "",
                         type = "text",
                         required = false,
                         readOnly = false,
                         disabled = false,
                         placeholder = ""
                     }) => (
    <CRow className="mb-3">
        <CCol md={12}>
            <CFormFloating>
                <Field
                    name={name}
                    as={CFormInput}
                    type={type}
                    id={name}
                    placeholder={placeholder}
                    className="form-control"
                    readOnly={readOnly}
                    disabled={disabled}
                    style={readOnly ? {cursor: "not-allowed"} : {}}
                />
                <CFormLabel htmlFor={name}>
                    {label} {required && <span style={{color: 'red'}}>*</span>}
                </CFormLabel>
            </CFormFloating>
            <div style={{minHeight: "20px"}} className="mt-1">
                <ErrorMessage
                    name={name}
                    component={CFormFeedback}
                    className="d-block text-warning ps-2"
                />
            </div>
        </CCol>
    </CRow>
);

export default FORMTextInput;