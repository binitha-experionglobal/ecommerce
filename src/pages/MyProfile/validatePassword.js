
// import React, { useEffect } from "react";
// import { setIn, getIn } from "formik";

// export const ValidatePassword = (props, condition) => {
  
//     // console.log(props);
//     // console.log(condition);

//     if (props && props.touched && props.errors.password && condition) {
//         if (
//             Object.keys(props.errors).length > 0 &&
//             props.errors.password.includes(condition)
//         ) {
//             return "Active";
//         } else if (props && props.touched &&
//             Object.keys(props.errors).length === 0 &&
//             props.values.password.length > 0) {
//             return "Inactive";
//         } else if (props && props.touched && Object.keys(props.errors).length > 0 &&
//             !props.errors.password.includes(condition) && props.values.password.length > 0) {
//             return "Inactive";
//         }
//     } else {
//         if (props.values.password.length > 0) {
//             return "Inactive";
//         } else {
//             return "Active";
//         }
//     }

// };


import { setIn, getIn } from "formik";

export const ValidatePassword = (props, condition) => {
;
console.log(props);
console.log(condition);

if(props && props.touched && props.errors.password && condition){
  if(
    Object.keys(props.errors).length > 0 &&
    props.errors.password.includes(condition)
  ){
    return "Active";
  }else if(props && props.touched && 
    Object.keys(props.errors).length === 0 && 
    props.values.password.length > 0){
    return "Inactive";
  }else if(props && props.touched && Object.keys(props.errors).length > 0 && 
  !props.errors.password.includes(condition) && props.values.password.length > 0){
    return "Inactive";
  }
}else {
  if(props.values.password.length > 0){
    return "Inactive";
  }else {
    return "Active";
  }
}
  
};



export const yupToFormErrors = (yupError, validationSchemaOptions) => {
  let errors = {};
  if (yupError.inner.length === 0) {
    return setIn(errors, yupError.path, yupError.message);
  }
  if (validationSchemaOptions.showMultipleFieldErrors) {
    for (const err of yupError.inner) {
      let fieldErrors = getIn(errors, err.path);
      if (!fieldErrors) {
        fieldErrors = [];
      }
      fieldErrors.push(err.message);
      errors = setIn(errors, err.path, fieldErrors);
    }
  } else {
    for (const err of yupError.inner) {
      if (!errors[err.path]) {
        errors = setIn(errors, err.path, err.message);
      }
    }
  }
  return errors;
};