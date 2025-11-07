import { useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function usePasswordToggle() {
  const [visible, setVisible] = useState(false);

  const togglePassword = () => setVisible(prev => !prev);

  const inputType = visible ? "text" : "password";
  const currentIcon = visible ? faEyeSlash : faEye;

  return { inputType, currentIcon, togglePassword };
}
