import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Register: React.FC = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submission initiated");

        const signupData = new FormData(e.currentTarget);
        const email = signupData.get("email") as string;
        const password = signupData.get("pass") as string;
        const passwordRepeat = signupData.get("pass-repeat") as string;

        if (!email || !password || !passwordRepeat) {
            alert("Please fill in all fields");
            return;
        }

        if (password !== passwordRepeat) {
            alert("Passwords do not match");
            return;
        }

        try {
            await register(email, password);
            navigate('/login');
        } catch (error) {
            alert("Sign up failed");
            console.error("Registration error:", error);
        }

        console.log("Form submitted successfully");
    };

    return (
        <div className="container mt-5 d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h1 className="text-center mb-4">Sign Up</h1>
                <form onSubmit={handleSubmit} method="post">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pass" className="form-label">Password:</label>
                        <input
                            type="password"
                            name="pass"
                            id="pass"
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pass-repeat" className="form-label">Repeat Password:</label>
                        <input
                            type="password"
                            name="pass-repeat"
                            id="pass-repeat"
                            className="form-control"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3">Sign Up</button>
                </form>
                <div className="text-center">
                    <a href="/login" className="text-decoration-none">Already have an account?</a>
                </div>
            </div>
        </div>
    );
};
