import { useEffect, useRef, useState } from "react";

const OTP_LENGTH = 6;

export default function OTPInput({
  onVerify,
  loading = false,
  success = false,
  error = false,
  clearError,
}) {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRefs = useRef([]);

  // focus first empty input
  useEffect(() => {
    const firstEmptyIndex = otp.findIndex((digit) => digit === "");

    if (firstEmptyIndex !== -1) {
      inputRefs.current[firstEmptyIndex]?.focus();
      setActiveIndex(firstEmptyIndex);
    }
  }, []);

  // auto verify when complete
  useEffect(() => {
    const otpValue = otp.join("");

    if (
      otpValue.length === OTP_LENGTH &&
      !otp.includes("") &&
      !loading
    ) {
      onVerify(otpValue);
    }
  }, [otp]);

  // handle typing
const handleChange = (value, index) => {
  if (!/^\d*$/.test(value)) return;

  const digit = value.slice(-1);

  const updatedOtp = [...otp];
  updatedOtp[index] = digit;

  setOtp(updatedOtp);

  if (digit && index < OTP_LENGTH - 1) {
    inputRefs.current[index + 1]?.focus();
    setActiveIndex(index + 1);
  }
};

  // handle keyboard
const handleKeyDown = (e, index) => {
  // backspace
  if (e.key === "Backspace") {
    e.preventDefault();

    // clear error ONLY when deleting
    if (error) {
      clearError?.();
    }

    const updatedOtp = [...otp];

    if (otp[index]) {
      updatedOtp[index] = "";
      setOtp(updatedOtp);
      return;
    }

    if (index > 0) {
      updatedOtp[index - 1] = "";
      setOtp(updatedOtp);

      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  }

  // arrows
  if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
    inputRefs.current[index + 1]?.focus();
    setActiveIndex(index + 1);
  }

  if (e.key === "ArrowLeft" && index > 0) {
    inputRefs.current[index - 1]?.focus();
    setActiveIndex(index - 1);
  }
};

  // paste support
  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .trim()
      .replace(/\s/g, "")
      .slice(0, OTP_LENGTH);

    if (!/^\d+$/.test(pasted)) return;

    const otpArray = pasted.split("");

    while (otpArray.length < OTP_LENGTH) {
      otpArray.push("");
    }

    setOtp(otpArray);

    const focusIndex = Math.min(
      pasted.length,
      OTP_LENGTH - 1
    );

    inputRefs.current[focusIndex]?.focus();
    setActiveIndex(focusIndex);
  };

  // click container -> focus first empty
  const handleContainerClick = () => {
    const firstEmpty = otp.findIndex((d) => d === "");

    if (firstEmpty !== -1) {
      inputRefs.current[firstEmpty]?.focus();
      setActiveIndex(firstEmpty);
    } else {
      inputRefs.current[OTP_LENGTH - 1]?.focus();
      setActiveIndex(OTP_LENGTH - 1);
    }
  };

  const getInputStyle = (index) => {
    // success
    if (success) {
      return `
        border-green-500
        bg-green-500/5
        text-green-600
        shadow-[0_0_0_3px_rgba(34,197,94,0.15)]
      `;
    }

    // error
    if (error) {
      return `
        border-red-500
        bg-red-500/5
        text-red-600
        animate-shake
      `;
    }

    // active
    if (activeIndex === index) {
      return `
        border-primary
        ring-4 ring-primary/10
        scale-105
      `;
    }

    // filled
    if (otp[index]) {
      return `
        border-primary/50
        bg-primary/[0.03]
      `;
    }

    return `
      border-border
      hover:border-primary/40
    `;
  };

  return (
    <div
      className="flex flex-col items-center gap-5"
      onClick={handleContainerClick}
    >

      {/* OTP INPUTS */}
      <div className="flex items-center gap-2 md:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            disabled={loading || success}
            onFocus={() => setActiveIndex(index)}
            onChange={(e) =>
              handleChange(e.target.value, index)
            }
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`
              h-10 w-10 rounded-lg
              border
              bg-background
              text-center
              text-xl font-bold
              outline-none
              transition-all duration-200
              md:h-12 md:w-12 md:text-xl
              ${getInputStyle(index)}
            `}
          />
        ))}
      </div>
    </div>
  );
}