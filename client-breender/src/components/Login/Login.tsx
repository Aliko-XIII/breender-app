import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const Login: React.FC = () => {
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const signupData = new FormData(e.currentTarget);

        const email = signupData.get("email") as string;
        const password = signupData.get("pass") as string;

        if (!email || !password) {
            alert("Please fill in all fields");
            return;
        }

        try {
            await login(email, password);
        } catch (error) {
            alert("Login failed");
            console.error("Login error:", error);
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "#181a1b" }}>
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%", background: "#23272b", color: "#f8f9fa", border: "none" }}>
                <h1 className="text-center mb-4" style={{ color: "#f8f9fa" }}>Login</h1>
                <form onSubmit={handleSubmit} method="post">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label" style={{ color: "#f8f9fa" }}>Email:</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="form-control bg-dark text-light border-secondary"
                            required
                            style={{ background: "#181a1b", color: "#f8f9fa", borderColor: "#343a40" }}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pass" className="form-label" style={{ color: "#f8f9fa" }}>Password:</label>
                        <input
                            type="password"
                            name="pass"
                            id="pass"
                            className="form-control bg-dark text-light border-secondary"
                            required
                            style={{ background: "#181a1b", color: "#f8f9fa", borderColor: "#343a40" }}
                        />
                    </div>
                    <button type="submit" className="btn btn-light btn-lg w-100 mb-3" style={{ background: "#f8f9fa", color: "#23272b", borderColor: "#f8f9fa" }}>Login</button>
                </form>
                <div className="text-center">
                    <a href="/signup" className="text-decoration-none" style={{ color: "#66b2ff" }}>Don't have an account?</a>
                </div>
            </div>
        </div>
    );
};
