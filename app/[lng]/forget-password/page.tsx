"use client";
import Swal from "sweetalert2";
import basicRequest from "../../apis/api";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import TextBox from "../components/TextBox";
import { useTranslation } from "@/app/i18n/client";
import { useState } from "react";

export default function Page({ params: { lng } }: any) {
  const { t } = useTranslation(lng, "forget-password");
  const router = useRouter();
  // const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const validate = (values: any) => {
    const errors: any = {};

    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    return errors;
  };
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
    onSubmit: (values) => {
      forgetPassword(values);
    },
  });
  async function forgetPassword(values: any) {
    setSubmitButtonDisabled(true);
    try {
      const url = "/auth/forgot-password";
      const req = await basicRequest.post(url, values);
      const title = t(req.status.toString());
      const msg = t("Success");
      await Swal.fire(title, msg, "success");
    } catch (error: any) {
      const title = error.response?.status.toString();
      let msg = error.response?.data?.detail;
      Swal.fire(title, msg, "error");
      console.error(error);
    } finally {
      setTimeout(() => {
        // setSubmitButtonDisabled(false);
        setSubmitButtonDisabled(true);
      }, 3000);
    }
  }
  return (
    <div className="RequestResetPassword h-full w-full py-12 text-center md:px-5">
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <p>{t("resetLinkWillSendToEmail")}</p>
        <div className="form-group mx-auto mb-14">
          <TextBox
            name="email"
            extraClass={`text-box mx-auto my-0 h-10 w-1/3 min-w-[250px] rounded-3xl border border-whisper p-5 leading-10`}
            isInvalid={"email" in formik.errors}
            placeholder={t("Email")}
            onChange={formik.handleChange}
            value={formik.values.email}
          />
        </div>
        <div className="button-box">
          <Button onClick={() => router.back()} color="pink">
            {t("Back")}
          </Button>
          &nbsp;
          <Button
            type="submit"
            disabled={!formik.isValid || submitButtonDisabled}
          >
            {t("Submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
