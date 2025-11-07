import umnLibraryLogo from "../assets/img/umn-library.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { Link } from "react-router-dom";
import usePasswordToggle from "../hooks/usePasswordToggle";
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const { inputType, currentIcon, togglePassword } = usePasswordToggle();
    const [emailError, setEmailError] = useState("");
    const navigate = useNavigate();

    const checkEmailValidity = (email) => { 
        if (email.includes("@")) {
            setEmailError("");
            setEmailAddress(email);
        } else { 
            setEmailError("masukkan email yang tepat!");
            setEmailAddress("");
        }
    }

    const handleLoginRequest = async (e) => { 
        e.preventDefault();
        try { 
            const response = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            const res = await response.json();

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            if (res.success) {
                alert(res.data.message);
                if (res.data.user.role === "user") {
                    return navigate(`/dashboard/user/${res.data.user.UserID}`);
                } else { 
                    return navigate(`/dashboard/admin/${res.data.user.UserID}`);
                }
                
            } else { 
                alert(res.message);
                return;
            }
        
        } catch (err) { 
            alert(err.message);
            return;
        }
    }

    return (
        <div className="login-container h-screen w-screen bg-gradient-to-br from-[#00DDFF] to-[#0070D9] flex justify-center items-center flex-col">
            <div className="athentication-form w-full  bg-white h-screen rounded-none md:max-w-[475px] md:rounded-lg md:my-2">
                <form action="" className="flex flex-col items-center p-3 px-10 flex-shrink-0 h-full">
                    <div className="logo-umn py-2">
                        <img src={umnLibraryLogo} alt="logo library umn" />
                        <h2 className="text-center text-lg font-bold">Welcome Back!</h2>
                        <h3 className="text-center text-md text-gray-600">Sign in</h3>
                    </div>
                    <div className="flex w-full flex-col py-2 gap-2">
                        <label htmlFor="user-email" className="font-medium">email address </label>
                        <input
                            type="text"
                            name="user-email"
                            id="user-email"
                            className={`appearance-none border-2 border-gray-400 rounded p-2 focus:outline-none ${
                                    emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-blue-500'
                                }`}
                            onChange={(e) => { checkEmailValidity(e.target.value) }}
                        />
                        {emailError && (
                            <p className="text-red-500 text-sm mt-1">{emailError}</p>
                        )}
                    </div>
                    <div className="flex w-full flex-col py-2 gap-2">
                        <label htmlFor="password" className="font-medium">password </label>
                        <div className="pass-container relative ">
                            <input
                                type={inputType}
                                name="password"
                                id="password"
                                className="w-full appearance-none border-2 border-gray-400 rounded p-2 focus:outline-none focus:border-blue-500 pr-10"
                                onChange={(e) => { setPassword(e.target.value)}}
                            />
                            <button type="button" className="toggle-password-button absolute top-0 right-0 bg-transparent focus:outline-none border-none rounded-full px-2"  onClick={togglePassword}>
                                <FontAwesomeIcon icon={currentIcon} />
                            </button>
                        </div>
                    </div>
                    <div className="signup-and-official-website container flex justify-between py-6">
                        <div className="signuplink">
                            <p className="">
                                <Link to="/register" className="appearance-none text-sm text-blue-400 hover:underline hover:text-blue-400">No account? Sign up here</Link>
                            </p>
                        </div>
                        <div className="official-website-link">
                            <p className="">
                                <a href="https://library.umn.ac.id/umnlibrary/" className="appearance-none text-sm text-black hover:underline hover:text-black">Check Offical website here</a>
                            </p>
                        </div>
                    </div>
                    <div className="submit-button-container w-full">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white font-bold w-full hover:bg-blue-500 disabled:opacity-50"
                            disabled={email === "" || password === ""}
                            onClick={handleLoginRequest}
                        >
                            Sign in     
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
