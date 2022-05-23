
import { setIn, getIn } from "formik";

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
    }
    else {
        for (const err of yupError.inner) {
            if (!errors[err.path]) {
                errors = setIn(errors, err.path, err.message);
            }
        }
    }
    return errors;
};
