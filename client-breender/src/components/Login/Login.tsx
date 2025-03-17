export const Login = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submittion initiated");
        const signupData = new FormData(e.currentTarget);
        if (!signupData.get("email") || !signupData.get("pass")) {
            alert("Please fill in all fields");
            return;
        }
        console.log("Form submitted successfully");
    };

    return (
        <div className="container mt-5 d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h1 className="text-center mb-4">Login</h1>
                <form onSubmit={handleSubmit} method="post">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input type="email" name="email" id="email" className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pass" className="form-label">Password:</label>
                        <input type="password" name="pass" id="pass" className="form-control" required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">Login</button>
                </form>
                <div className="text-center">
                    <a href="/signup" className="text-decoration-none">Don't have an account?</a>
                </div>
            </div>
        </div>
    );
};
