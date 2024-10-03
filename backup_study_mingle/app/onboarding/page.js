"use client"; // Client Component

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { db } from "../firebase-config";
import { useRouter } from "next/navigation";

const OnboardingForm = () => {
  const { id, user } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    levelOfStudy: "",
    subjects: "",
    interests: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Store the form data in Firestore
    await db
      .collection("users")
      .doc(id)
      .set({
        ...formData,
        onboardingCompleted: true,
        createdAt: new Date(),
      });

    // Alternatively, store in Clerk's metadata
    await user.update({
      publicMetadata: {
        ...formData,
        onboardingCompleted: true,
      },
    });

    // Redirect to main app
    router.push("/dashboard");
  };

  const pageStyle = {
    height: "100vh",
    margin: "0",
    padding: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEC89A", // Background color for the whole page
  };

  const containerStyle = {
    backgroundColor: "#F4A261",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
    width: "600px",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const labelStyle = {
    marginBottom: "5px",
    fontSize: "1.2em",
    color: "#000",
  };

  const inputStyle = {
    backgroundColor: "#FCD5B5",
    border: "none",
    borderRadius: "15px",
    padding: "10px",
    marginBottom: "15px",
    boxShadow: "inset 0px 3px 5px rgba(0, 0, 0, 0.1)",
    fontSize: "1em",
  };

  const buttonStyle = {
    backgroundColor: "#E76F51",
    color: "#fff",
    border: "none",
    borderRadius: "15px",
    padding: "10px",
    cursor: "pointer",
    fontSize: "1em",
    boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle} htmlFor="name">
            Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            style={inputStyle}
          />
          <label style={labelStyle} htmlFor="age">
            Age
          </label>
          <input
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Your age"
            style={inputStyle}
          />
          <label style={labelStyle} htmlFor="location">
            Location
          </label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Your location"
            style={inputStyle}
          />
          <label style={labelStyle} htmlFor="levelOfStudy">
            Level Of Study
          </label>
          <input
            name="levelOfStudy"
            value={formData.levelOfStudy}
            onChange={handleChange}
            placeholder="Where do you study?"
            style={inputStyle}
          />
          <label style={labelStyle} htmlFor="subjects">
            Subjects
          </label>
          <input
            name="subjects"
            value={formData.subjects}
            onChange={handleChange}
            placeholder="What subjects do you study? Separate them by a comma"
            style={inputStyle}
          />
          <label style={labelStyle} htmlFor="age">
            Interests
          </label>
          <input
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="What are your interests? Separate them by a comma"
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingForm;
