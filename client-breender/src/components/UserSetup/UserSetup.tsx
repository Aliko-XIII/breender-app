import React, { useState } from "react";
import { Button, Form, Container, Card } from "react-bootstrap";
import { useUser } from "../../context/UserContext";

interface UserSetupData {
    name: string;
    bio: string;
    phone?: string;
}

export const UserSetup = ({ updateUser }) => {
    const { userId, isLoading } = useUser();

    const [userData, setUserData] = useState<UserSetupData>({
        name: "",
        bio: "",
        phone: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            if (isLoading) return;
            console.log("Saving profile data:", userData);
            await updateUser(userId, userData);
            alert("Profile setup completed!");
        } catch (error) {
            console.error("Error saving profile data:", error);
            alert("Failed to save profile");
        }
    };

    return (
        <Container className="mt-5" style={{ minHeight: "100vh", background: "#181a1b" }}>
            <Card className="shadow-lg p-4" style={{ maxWidth: "500px", margin: "0 auto", background: "#23272b", color: "#f8f9fa", border: "none" }}>
                <h2 className="text-center mb-4" style={{ color: "#f8f9fa" }}>Setup Your Profile</h2>

                <Form.Group className="mb-3">
                    <Form.Label style={{ color: "#f8f9fa" }}>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        required
                        className="bg-dark text-light border-secondary"
                        style={{ background: "#181a1b", color: "#f8f9fa", borderColor: "#343a40" }}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{ color: "#f8f9fa" }}>Bio</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="bio"
                        value={userData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell something about yourself"
                        rows={3}
                        className="bg-dark text-light border-secondary"
                        style={{ background: "#181a1b", color: "#f8f9fa", borderColor: "#343a40" }}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{ color: "#f8f9fa" }}>Phone Number</Form.Label>
                    <Form.Control
                        type="tel"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="bg-dark text-light border-secondary"
                        style={{ background: "#181a1b", color: "#f8f9fa", borderColor: "#343a40" }}
                    />
                </Form.Group>

                <Button variant="primary" onClick={handleSave} className="w-100">
                    Save Profile
                </Button>
            </Card>
        </Container>
    );
};
