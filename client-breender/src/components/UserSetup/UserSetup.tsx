import React, { useState } from "react";
import { Button, Form, Container, Card } from "react-bootstrap";

interface UserSetupData {
    name: string;
    bio: string;
    pictureUrl: string;
    phone: string;
}

export const UserSetup = () => {
    const [userData, setUserData] = useState<UserSetupData>({
        name: "",
        bio: "",
        pictureUrl: "",
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
            // Збереження профілю (запит на сервер)
            console.log("Saving profile data:", userData);
            alert("Profile setup completed!");
            // Перенаправлення на іншу сторінку після успішного збереження
        } catch (error) {
            console.error("Error saving profile data:", error);
            alert("Failed to save profile");
        }
    };

    return (
        <Container className="mt-5">
            <Card className="shadow-lg p-4" style={{ maxWidth: "500px", margin: "0 auto" }}>
                <h2 className="text-center mb-4">Setup Your Profile</h2>

                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="bio"
                        value={userData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell something about yourself"
                        rows={3}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Profile Picture URL</Form.Label>
                    <Form.Control
                        type="text"
                        name="pictureUrl"
                        value={userData.pictureUrl}
                        onChange={handleInputChange}
                        placeholder="Enter a profile picture URL"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                    />
                </Form.Group>

                <Button variant="primary" onClick={handleSave} className="w-100">
                    Save Profile
                </Button>
            </Card>
        </Container>
    );
};
