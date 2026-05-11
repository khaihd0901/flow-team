import { useEffect, useState } from "react";
import { cn } from "@/libs/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import { AlertCircle } from "lucide-react";

import { useFormik } from "formik";
import * as Yup from "yup";

import { useUserStore } from "@/stores/userStore";
import OTPInput from "./OTPInput";
import { useNavigate } from "react-router";

export function ForgotPasswordForm({ className, ...props }) {
  const { userForgotPassword, userVerifyOTP, userResetPassword, loading } =
    useUserStore();

  // step:
  // 1 => email
  // 2 => otp
  // 3 => reset password
  const [step, setStep] = useState(1);

  // save email + otp for next steps
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpError, setOtpError] = useState(false);

  const RESEND_TIME = 90;

  const [countdown, setCountdown] = useState(RESEND_TIME);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    let timer;

    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (countdown === 0) {
      setCanResend(true);
    }

    return () => clearInterval(timer);
  }, [countdown, step]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleResendOTP = async () => {
    try {
      const res = await userForgotPassword({ email });

      if (res.success) {
        setCountdown(RESEND_TIME);
        setCanResend(false);

        setOtpError(false);
        setOtpSuccess(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // =========================
  // STEP 1 - SEND EMAIL
  // =========================
  const emailFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),

    validateOnChange: false,
    validateOnBlur: true,

    onSubmit: async (values) => {
      try {
        const res = await userForgotPassword(values);
        console.log(res.success);
        if (res.success == true) {
          setEmail(values.email);
          setStep(2);
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  // =========================
  // STEP 2 - VERIFY OTP
  // =========================

  const handleVerifyOTP = async (otp) => {
    try {
      setOtpError(false);

      const res = await userVerifyOTP({
        email,
        otp,
      });
      if (res.success === true) {
        
        setOtpSuccess(true);
        setTimeout(() =>{
          setOTP(otp);
        setStep(3);
        },2000)
      }
    } catch (error) {
      console.log(error);
      setOtpError(true);
      setOtpSuccess(false);
    }
  };
  // =========================
  // STEP 3 - RESET PASSWORD
  // =========================
  const resetFormik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Confirm password is required"),
    }),

    validateOnChange: false,
    validateOnBlur: true,

    onSubmit: async (values) => {
      try {
        const res = await userResetPassword({
          email,
          otp,
          confirmPassword: values.confirmPassword,
          password: values.password,
        });

        if (res.success === true) {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        console.error(error);
      }
    },
  });


  // =========================
  // RENDER ERROR
  // =========================
  const renderError = (formik, fieldName) => {
    const hasError = formik.touched[fieldName] && formik.errors[fieldName];

    if (!hasError) return null;

    return (
      <>
        {/* Desktop Tooltip */}
        <div className="group absolute right-3 top-1/2 hidden -translate-y-1/2 md:block">
          <AlertCircle className="h-5 w-5 cursor-pointer text-destructive" />

          <div
            className="
              absolute right-0 top-7 z-50
              hidden whitespace-nowrap
              rounded-md bg-black
              px-2 py-1 text-xs
              text-white shadow-lg
              group-hover:block
            "
          >
            {formik.errors[fieldName]}
          </div>
        </div>

        {/* Mobile Error */}
        <p className="mt-1 text-xs text-destructive md:hidden">
          {formik.errors[fieldName]}
        </p>
      </>
    );
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <FieldGroup>
              {/* Header */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  {step === 1 && "Find Your Account"}
                  {step === 2 && "Verify OTP"}
                  {step === 3 && "Reset Password"}
                </h1>

                <p className="text-balance text-muted-foreground">
                  {step === 1 && "Enter your email to receive OTP"}

                  {step === 2 && `Enter OTP sent to ${email}`}

                  {step === 3 && "Create your new password"}
                </p>
              </div>

              {/* ========================= */}
              {/* STEP 1 */}
              {/* ========================= */}
              {step === 1 && (
                <form onSubmit={emailFormik.handleSubmit} className="space-y-6">
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>

                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        onBlur={emailFormik.handleBlur("email")}
                        onChange={emailFormik.handleChange("email")}
                        value={emailFormik.values.email}
                        aria-invalid={
                          emailFormik.touched.email &&
                          !!emailFormik.errors.email
                        }
                        className="pr-10"
                      />

                      {renderError(emailFormik, "email")}
                    </div>
                  </Field>

                  <Field>
                    <Button
                      size="lg"
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </Button>
                  </Field>
                </form>
              )}

              {/* ========================= */}
              {/* STEP 2 */}
              {/* ========================= */}
              {step === 2 && (
                <div className="space-y-6">
                  <OTPInput
                    loading={loading}
                    success={otpSuccess}
                    error={otpError}
                    clearError={() => setOtpError(false)}
                    onVerify={handleVerifyOTP}
                  />

                  <Field>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={!canResend || loading}
                      onClick={handleResendOTP}
                    >
                      {loading
                        ? "Sending..."
                        : canResend
                          ? "Resend OTP"
                          : `Resend OTP in ${formatTime(countdown)}`}
                    </Button>
                  </Field>
                </div>
              )}

              {/* ========================= */}
              {/* STEP 3 */}
              {/* ========================= */}
              {step === 3 && (
                <form onSubmit={resetFormik.handleSubmit} className="space-y-6">
                  {/* Password */}
                  <Field>
                    <FieldLabel htmlFor="password">New Password</FieldLabel>

                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter new password"
                        onBlur={resetFormik.handleBlur("password")}
                        onChange={resetFormik.handleChange("password")}
                        value={resetFormik.values.password}
                        aria-invalid={
                          resetFormik.touched.password &&
                          !!resetFormik.errors.password
                        }
                        className="pr-10"
                      />

                      {renderError(resetFormik, "password")}
                    </div>
                  </Field>

                  {/* Confirm Password */}
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>

                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        onBlur={resetFormik.handleBlur("confirmPassword")}
                        onChange={resetFormik.handleChange("confirmPassword")}
                        value={resetFormik.values.confirmPassword}
                        aria-invalid={
                          resetFormik.touched.confirmPassword &&
                          !!resetFormik.errors.confirmPassword
                        }
                        className="pr-10"
                      />

                      {renderError(resetFormik, "confirmPassword")}
                    </div>
                  </Field>

                  <Field>
                    <Button
                      size="lg"
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </Field>
                </form>
              )}
            </FieldGroup>
          </div>

          {/* Right Image */}
          <div className="relative hidden p-6 bg-muted md:block">
            <img
              src="/forgot.png"
              alt="Forgot Password"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
