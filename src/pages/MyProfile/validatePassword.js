
import React, { useEffect } from "react";
import { setIn, getIn } from "formik";

export const ValidatePassword = (props, condition) => {
  
    // console.log(props);
    // console.log(condition);

    if (props && props.touched && props.errors.password && condition) {
        if (
            Object.keys(props.errors).length > 0 &&
            props.errors.password.includes(condition)
        ) {
            return "Active";
        } else if (props && props.touched &&
            Object.keys(props.errors).length === 0 &&
            props.values.password.length > 0) {
            return "Inactive";
        } else if (props && props.touched && Object.keys(props.errors).length > 0 &&
            !props.errors.password.includes(condition) && props.values.password.length > 0) {
            return "Inactive";
        }
    } else {
        if (props.values.password.length > 0) {
            return "Inactive";
        } else {
            return "Active";
        }
    }

};
