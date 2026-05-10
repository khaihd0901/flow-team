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

import { Eye, EyeOff, AlertCircle } from "lucide-react";

import { useAuthStore } from "@/stores/authStore";
import { Link, useNavigate } from "react-router";

import { useFormik } from "formik";
import * as Yup from "yup";

import { useState } from "react";

export function LoginForm({ className, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const { authLogin } = useAuthStore();

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    identifier: Yup.string().required("Email or username is required"),

    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },

    validationSchema,

    validateOnChange: false,
    validateOnBlur: true,

    onSubmit: async (values) => {
      try {
        await authLogin(values);
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    },
  });

  const renderError = (fieldName) => {
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
          <form className="p-6 md:p-8" onSubmit={formik.handleSubmit}>
            <FieldGroup>
              {/* Header */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>

                <p className="text-balance text-muted-foreground">
                  Login to your Team Flow account
                </p>
              </div>

              {/* Identifier */}
              <Field>
                <FieldLabel htmlFor="identifier">Email or Username</FieldLabel>

                <div className="relative">
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Enter email or username"
                    onBlur={formik.handleBlur("identifier")}
                    onChange={formik.handleChange("identifier")}
                    value={formik.values.identifier}
                    aria-invalid={
                      formik.touched.identifier && !!formik.errors.identifier
                    }
                    className="pr-10 transition-all duration-200"
                  />

                  {renderError("identifier")}
                </div>
              </Field>

              {/* Password */}
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <Link
                    to="/reset-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

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
                    {/* Error Icon */}
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

                {/* Mobile Error */}
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-xs text-destructive md:hidden">
                    {formik.errors.password}
                  </p>
                )}
              </Field>

              {/* Submit */}
              <Field>
                <Button size="lg" type="submit" className="w-full">
                  Login
                </Button>
              </Field>

              {/* Separator */}
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              {/* Social Login */}
              <Field className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>

                  <span className="sr-only">Login with Google</span>
                </Button>

                <Button variant="outline" type="button"
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M12 .5C5.73.5.75 5.62.75 12.1c0 5.18 3.44 9.57 8.2 11.13.6.12.82-.27.82-.58v-2.1c-3.34.75-4.04-1.65-4.04-1.65-.55-1.44-1.35-1.82-1.35-1.82-1.1-.77.08-.75.08-.75 1.22.09 1.86 1.3 1.86 1.3 1.08 1.9 2.82 1.35 3.5 1.03.1-.8.42-1.35.76-1.66-2.66-.31-5.46-1.37-5.46-6.08 0-1.34.46-2.44 1.23-3.3-.12-.31-.54-1.56.12-3.25 0 0 1-.33 3.3 1.26a11.2 11.2 0 0 1 3-.42c1.02 0 2.04.14 3 .42 2.3-1.59 3.3-1.26 3.3-1.26.66 1.69.24 2.94.12 3.25.77.86 1.23 1.96 1.23 3.3 0 4.72-2.8 5.76-5.47 6.07.43.38.82 1.12.82 2.26v3.35c0 .31.22.7.83.58 4.76-1.56 8.2-5.95 8.2-11.13C23.25 5.62 18.27.5 12 .5z" />
                  </svg>

                  <span className="sr-only">Login with GitHub</span>
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="underline underline-offset-4">
                  Register
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/login.png"
              alt="Login"
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
