import React, { useState } from "react";
import { Button, Form, Container, Card } from "react-bootstrap";
import { useUser } from "../../context/UserContext";

interface UserSetupData {
    name: string;
    bio: string;
    pictureUrl?: string;
}

export const UserSetup = ({ updateUser }) => {
    const { userId, isLoading } = useUser();

    const [userData, setUserData] = useState<UserSetupData>({
        name: "",
        bio: "",
        pictureUrl: undefined,
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

                <Button variant="primary" onClick={handleSave} className="w-100">
                    Save Profile
                </Button>
            </Card>
        </Container>
    );
};
