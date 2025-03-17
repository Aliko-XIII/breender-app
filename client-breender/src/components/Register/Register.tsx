export const Register = () => {
    return (
      <div className="container mt-5 d-flex justify-content-center align-items-center">
        <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
          <h1 className="text-center mb-4">Sign Up</h1>
          <form method="post">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input type="email" name="email" id="email" className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="pass" className="form-label">Password:</label>
              <input type="password" name="pass" id="pass" className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="pass-repeat" className="form-label">Repeat Password:</label>
              <input type="password" name="pass-repeat" id="pass-repeat" className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">Sign Up</button>
            <div className="text-center">
              <a href="/login" className="text-decoration-none">Already have an account?</a>
            </div>
          </form>
        </div>
      </div>
    );
  };
  