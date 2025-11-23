import umnLibraryLogo from "../assets/img/umn-library.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import usePasswordToggle from "../hooks/usePasswordToggle";
import { useState, useEffect } from "react";
import Dropdown from "../components/dropdown";
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() { 
    const [role, setRole] = useState("");
    const [nomorInduk, setNomorInduk] = useState("");
    const [nomorIndukError, setNomorIndukError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState(""); 
    const navigate = useNavigate();

    const {
        inputType: passwordInputType,
        currentIcon: passwordCurrentIcon,
        togglePassword: togglePasswordVisibility
    } = usePasswordToggle();

    const {
        inputType: confirmInputType,
        currentIcon: confirmCurrentIcon,
        togglePassword: toggleConfirmPasswordVisibility
    } = usePasswordToggle();

    // Validate nomor induk format
    const validateNomorInduk = (value) => {
        setNomorInduk(value.toUpperCase());
        
        if (!value) {
            setNomorIndukError("");
            return;
        }

        // Check if nomor induk starts with correct prefix
        if (role === "Mahasiswa" && !value.toUpperCase().includes("MHS")) {
            setNomorIndukError("Nomor induk harus dimulai dengan MHS");
        } else if (role === "Dosen" && !value.toUpperCase().includes("DSN")) {
            setNomorIndukError("Nomor induk harus dimulai dengan DSN");
        } else if (role === "Staff" && !value.toUpperCase().includes("STF")) {
            setNomorIndukError("Nomor induk harus dimulai dengan STF");
        } else if (!role) {
            setNomorIndukError("Pilih tipe user terlebih dahulu");
        } else {
            setNomorIndukError("");
        }
    };

    // password validator
    useEffect(() => {
        if (confirmPassword.length === 0) {
            setPasswordError("");
        } else if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
        } else {
            setPasswordError("");
        }
    }, [password, confirmPassword]);

    // handle form submit
    const handleSubmitForm = async (e) => { 
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    role: role,
                    nomorInduk: nomorInduk,
                    email: email,
                    password: password
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "An unknown error occurred");
                return;
            }

            alert(data.data?.message || "User created successfully!");
            return navigate(`/`);
         } catch (err) { 
                alert(err.message);
        }
    }



    return (
        <div className="login-container h-screen w-screen bg-gradient-to-br from-[#00DDFF] to-[#0070D9] flex justify-center items-center flex-col">
            <div className="athentication-form w-full bg-white h-screen rounded-none md:max-w-[475px] md:rounded-lg md:my-2">
                <form className="flex flex-col items-center p-3 px-10 flex-shrink-0 h-full">
                    <div className="logo-umn py-2">
                        <img src={umnLibraryLogo} alt="logo library umn" />
                        <h2 className="text-center text-lg font-bold">Welcome!</h2>
                        <h3 className="text-center text-md text-gray-600">Sign up</h3>
                    </div>

                    { /* user type */}
                    <div className="py-2 w-full">
                        <Dropdown
                            label="User type"
                            options={[
                                { label: "Mahasiswa", value: "Mahasiswa" },
                                { label: "Staff", value: "Staff" },
                                { label: "Dosen", value: "Dosen" },
                            ]}
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                    </div>

                    { /* Nomor induk */}
                    <div className="flex w-full flex-col py-2 gap-2">
                        <label htmlFor="nomor-induk" className="font-medium text-gray-700">
                            Nomor Induk
                            <span className="text-xs text-gray-500 ml-2">
                                {role === "Mahasiswa" && "(MHS0001-MHS9999)"}
                                {role === "Dosen" && "(DSN0001-DSN9999)"}
                                {role === "Staff" && "(STF0001-STF9999)"}
                                {!role && "(Pilih tipe user dulu)"}
                            </span>
                        </label>
                        <input
                            type="text"
                            name="nomor-induk"
                            id="nomor-induk" 
                            className={`appearance-none border-2 rounded p-2 focus:outline-none bg-white uppercase ${
                                nomorIndukError ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-blue-500'
                            } text-gray-900`}
                            placeholder="Contoh: MHS0001"
                            value={nomorInduk}
                            onChange={(e) => validateNomorInduk(e.target.value)}
                        />
                        {nomorIndukError && (
                            <p className="text-red-500 text-sm mt-1">{nomorIndukError}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex w-full flex-col py-2 gap-2">
                        <label htmlFor="user-email" className="font-medium text-gray-700">Email address</label>
                        <input
                            type="email"
                            name="user-email"
                            id="user-email" 
                            className="appearance-none border-2 border-gray-400 rounded p-2 focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                            placeholder="nama@email.com"
                            onChange={(e) => { setEmail(e.target.value)}}
                        />
                    </div>

                    {/* Password */}
                    <div className="flex w-full flex-col py-2 gap-2">
                        <label htmlFor="password" className="font-medium text-gray-700">Password</label>
                        <div className="pass-container relative">
                            <input 
                                type={passwordInputType} 
                                name="password" 
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full appearance-none border-2 border-gray-400 rounded p-2 focus:outline-none focus:border-blue-500 pr-10 bg-white text-gray-900" 
                                placeholder="Masukkan password"
                            />
                            <button 
                                type="button" 
                                className="toggle-password-button absolute top-0 right-0 bg-transparent focus:outline-none border-none rounded-full px-2 text-gray-600 hover:text-gray-800"  
                                onClick={togglePasswordVisibility}
                            >
                                <FontAwesomeIcon icon={passwordCurrentIcon} />
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex w-full flex-col py-2 gap-2">
                        <label htmlFor="confirm-password" className="font-medium text-gray-700">Confirm password</label>
                        <div className="pass-container relative">
                            <input 
                                type={confirmInputType} 
                                name="confirm-password" 
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full appearance-none border-2 rounded p-2 focus:outline-none pr-10 bg-white text-gray-900 ${
                                    passwordError ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-blue-500'
                                }`} 
                                placeholder="Konfirmasi password"
                            />
                            <button 
                                type="button" 
                                className="toggle-password-button absolute top-0 right-0 bg-transparent focus:outline-none border-none rounded-full px-2 text-gray-600 hover:text-gray-800"  
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                <FontAwesomeIcon icon={confirmCurrentIcon} />
                            </button>
                        </div>

                        {/* Show validation message */}
                        {passwordError && (
                            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                        )}
                    </div>

                    <div className="signin container flex justify-between py-2">
                        <div className="signinlink">
                            <Link to="/" className="appearance-none text-sm text-blue-400 hover:underline hover:text-blue-400">
                                Already have an account? Sign in
                            </Link>
                        </div>
                    </div>

                    <div className="submit-button-container w-full">
                        <button 
                            type="submit" 
                            className="bg-blue-600 text-white font-bold w-full hover:bg-blue-500 disabled:opacity-50 rounded-lg py-3 transition duration-200"
                            disabled={passwordError || password === "" || confirmPassword === "" || role === "" || nomorInduk === "" || email === "" || nomorIndukError !== ""}
                            onClick={handleSubmitForm}
                        >
                            Sign up 
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
