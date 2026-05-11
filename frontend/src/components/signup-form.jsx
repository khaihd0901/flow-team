import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";

import { Eye, EyeOff, AlertCircle } from "lucide-react";

export function SignupForm({ className, ...props }) {
  const { authRegister } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("First name is required")
        .min(2, "Too short"),

      lastName: Yup.string()
        .required("Last name is required")
        .min(2, "Too short"),

      username: Yup.string()
        .required("User name is required")
        .min(5, "Too short"),

      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),

      confirmPassword: Yup.string()
        .required("Confirm your password")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),

    validateOnChange: false,
    validateOnBlur: true,

    onSubmit: async (values, { resetForm }) => {
      try {
        await authRegister(values);
        resetForm();
      } catch (err) {
        console.error(err);
      }
    },
  });

  const renderError = (fieldName) => {
    const hasError = formik.touched[fieldName] && formik.errors[fieldName];

    if (!hasError) return null;

    return (
      <>
        {/* Desktop Tooltip */}
        <div className="group absolute right-3 top-1/2 -translate-y-1/2 hidden md:block">
          <AlertCircle className="h-5 w-5 text-destructive cursor-pointer" />

          <div
            className="
              absolute right-0 top-7 z-50
              hidden whitespace-nowrap
              rounded-md bg-black
              px-2 py-1
              text-xs text-white
              shadow-lg
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
          <form className="p-6 md:p-8" onSubmit={formik.handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
              </div>

              {/* First + Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>

                  <div className="relative">
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Your First Name"
                      onBlur={formik.handleBlur("firstName")}
                      onChange={formik.handleChange("firstName")}
                      value={formik.values.firstName}
                      aria-invalid={
                        formik.touched.firstName && !!formik.errors.firstName
                      }
                      className="pr-10 transition-all duration-200"
                    />

                    {renderError("firstName")}
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>

                  <div className="relative">
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Your Last Name"
                      onBlur={formik.handleBlur("lastName")}
                      onChange={formik.handleChange("lastName")}
                      value={formik.values.lastName}
                      aria-invalid={
                        formik.touched.lastName && !!formik.errors.lastName
                      }
                      className="pr-10 transition-all duration-200"
                    />

                    {renderError("lastName")}
                  </div>
                </Field>
              </div>

              {/* Username */}
              <Field>
                <FieldLabel htmlFor="username">User Name</FieldLabel>

                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="Your User Name"
                    onBlur={formik.handleBlur("username")}
                    onChange={formik.handleChange("username")}
                    value={formik.values.username}
                    aria-invalid={
                      formik.touched.username && !!formik.errors.username
                    }
                    className="pr-10 transition-all duration-200"
                  />

                  {renderError("username")}
                </div>
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>

                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    onBlur={formik.handleBlur("email")}
                    onChange={formik.handleChange("email")}
                    value={formik.values.email}
                    aria-invalid={formik.touched.email && !!formik.errors.email}
                    className="pr-10 transition-all duration-200"
                  />

                  {renderError("email")}
                </div>
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your Password"
                    onBlur={formik.handleBlur("password")}
                    onChange={formik.handleChange("password")}
                    value={formik.values.password}
                    aria-invalid={
                      formik.touched.password && !!formik.errors.password
                    }
                    className="pr-20 transition-all duration-200"
                  />

                  <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-muted-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {formik.touched.password && formik.errors.password && (
                      <div className="group relative hidden md:block">
                        <AlertCircle className="h-5 w-5 text-destructive" />

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
                          {formik.errors.password}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-xs text-destructive md:hidden">
                    {formik.errors.password}
                  </p>
                )}
              </Field>

              {/* Confirm Password */}
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Your Password"
                    onBlur={formik.handleBlur("confirmPassword")}
                    onChange={formik.handleChange("confirmPassword")}
                    value={formik.values.confirmPassword}
                    aria-invalid={
                      formik.touched.confirmPassword &&
                      !!formik.errors.confirmPassword
                    }
                    className="pr-20 transition-all duration-200"
                  />

                  <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="text-muted-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword && (
                        <div className="group relative hidden md:block">
                          <AlertCircle className="h-5 w-5 text-destructive" />

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
                            {formik.errors.confirmPassword}
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="mt-1 text-xs text-destructive md:hidden">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </Field>

              {/* Submit */}
              <Field>
                <Button size="lg" type="submit" className="w-full">
                  Register
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              {/* Social Login */}
              <Field className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() =>
                    (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`)
                  }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Google
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  onClick={() =>
                    (window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`)
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M12 .5C5.73.5.75 5.62.75 12.1c0 5.18 3.44 9.57 8.2 11.13.6.12.82-.27.82-.58v-2.1c-3.34.75-4.04-1.65-4.04-1.65-.55-1.44-1.35-1.82-1.35-1.82-1.1-.77.08-.75.08-.75 1.22.09 1.86 1.3 1.86 1.3 1.08 1.9 2.82 1.35 3.5 1.03.1-.8.42-1.35.76-1.66-2.66-.31-5.46-1.37-5.46-6.08 0-1.34.46-2.44 1.23-3.3-.12-.31-.54-1.56.12-3.25 0 0 1-.33 3.3 1.26a11.2 11.2 0 0 1 3-.42c1.02 0 2.04.14 3 .42 2.3-1.59 3.3-1.26 3.3-1.26.66 1.69.24 2.94.12 3.25.77.86 1.23 1.96 1.23 3.3 0 4.72-2.8 5.76-5.47 6.07.43.38.82 1.12.82 2.26v3.35c0 .31.22.7.83.58 4.76-1.56 8.2-5.95 8.2-11.13C23.25 5.62 18.27.5 12 .5z" />
                  </svg>
                  GitHub
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Log in
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* Right Image */}
          <div className="relative hidden bg-muted md:block">
            <img
              src="/register.png"
              alt="Register"
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
