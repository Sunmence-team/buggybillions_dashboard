import * as Yup from "yup";

export const LoginValidationSchema = Yup.object({
    bug_id: Yup.string()
        .required("Bug ID is required!."),
    password: Yup.string()
        .required("Password is required"),
})