import React, { useEffect, useState } from "react";

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 50);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="btn btn-primary rounded-circle"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: 1050, // Make sure it floats above other elements
        width: "48px",
        height: "48px",
        padding: 0,
        fontSize: "20px",
        lineHeight: "48px",
        textAlign: "center"
      }}
      title="Back to top"
    >
      ↑
    </button>
  );
};
