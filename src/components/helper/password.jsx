import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const CustomPasswordComponent = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [strength, setStrength] = useState("");
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasAlphaNumeric, setHasAlphaNumeric] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const calculatePasswordStrength = (password) => {
    // Implement your password strength logic here and return the strength level.
    // For demonstration purposes, we'll check the password for various conditions.

    // Check for uppercase character
    const uppercaseRegex = /[A-Z]/;
    setHasUppercase(uppercaseRegex.test(password));

    // Check for lowercase character
    const lowercaseRegex = /[a-z]/;
    setHasLowercase(lowercaseRegex.test(password));

    // Check for special character
    const specialCharRegex = /[@#$%^&*()_+!¡¿?~-]/;
    setHasSpecialChar(specialCharRegex.test(password));

    // Check for alphanumeric character
    const alphanumericRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
    setHasAlphaNumeric(alphanumericRegex.test(password));

    // Calculate overall strength level
    if (password.length < 8 || !hasAlphaNumeric) {
      return "Weak";
    } else if (
      (password.length >= 8 && password.length < 12) ||
      !hasUppercase ||
      !hasLowercase ||
      !hasSpecialChar
    ) {
      return "Medium";
    } else {
      return "Strong";
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfPassword = () => {
    setShowConfPassword(!showConfPassword);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const strengthLevel = calculatePasswordStrength(newPassword);
    setStrength(strengthLevel);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordMatch(newConfirmPassword === password);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-5 mt-5">
        <Input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your password"
          defaultValue=""
          className="w-full max-w-[400px]"
        />
        <button onClick={handleShowPassword}>
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <div className="flex gap-5">
        <Input
          type={showConfPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Confirm your password"
          className="w-full max-w-[400px]"
          defaultValue=""
        />
        <button onClick={handleShowConfPassword}>
          {showConfPassword ? "Hide" : "Show"}
        </button>
      </div>


      <div className="flex flex-col my-3">
        <p
          className={`${
            strength === "strong"
              ? "text-green-700"
              : strength === "medium"
              ? "text-orange-600"
              : "text-red-500"
          } capitalize text-sm`}
        >
          Password Strength: {strength}
        </p>
        <p className={`${hasUppercase ? "text-green-700" : "text-red-700"} text-sm`}>
          Contains Uppercase {hasUppercase ? "✔️" : ""}
        </p>
        <p className={`${hasLowercase ? "text-green-700" : "text-red-700"} text-sm`}>
          Contains Lowercase {hasLowercase ? "✔️" : ""}
        </p>
        <p className={`${hasSpecialChar ? "text-green-700" : "text-red-700"} text-sm`}>
          Contains @#$%!&.. {hasSpecialChar ? "✔️" : ""}
        </p>
        <p className={`${hasAlphaNumeric ? "text-green-700" : "text-red-700"} text-sm`}>
          Contains Alphanumeric {hasAlphaNumeric ? "✔️" : ""}
        </p>
      </div>
    </div>
  );
};

export default CustomPasswordComponent;
