import { useNavigate } from "react-router-dom";

export const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0">
        <div className="card-body text-center">
          <h1 className="display-4 mb-4">
            Welcome to the Animal Breeder App <span className="text-primary">"Breender"</span>
          </h1>
          <p className="lead">
            Manage your animal breeding operations seamlessly with our powerful and user-friendly application.
          </p>
          <div className="d-flex justify-content-center">
            <ul className="list-group mb-4" style={{ width: "fit-content" }}>
              <li className="list-group-item bg-primary text-white rounded mb-2">
                🗂️ Add, update, delete, and manage user and animal data.
              </li>
              <li className="list-group-item bg-success text-white rounded mb-2">
                📄 Upload important documents, pedigrees, and other animal-related data.
              </li>
              <li className="list-group-item bg-dark text-white rounded mb-2">
                🛠️ Organize and track animal care routines.
              </li>
              <li className="list-group-item bg-secondary text-white rounded">
                🐾 Find compatible breeding partners for your animals.
              </li>
            </ul>
          </div>
          <p className="text-muted">
            Start building better connections and ensuring the best care for your animals today!
          </p>
          <button className="btn btn-primary btn-lg" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
