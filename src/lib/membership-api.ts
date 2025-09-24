/* eslint-disable @typescript-eslint/no-explicit-any */
export const uploadToDriveApi = async (file: File): Promise<string> => {
  console.log("📤 Starting file upload to Google Drive...");
  console.log("📁 File details:", {
    name: file.name,
    size: file.size,
    type: file.type,
  });

  // Validate file size
  if (file.size > 5 * 1024 * 1024) {
    console.log("❌ File too large:", file.size);
    throw new Error("File size must be less than 5MB");
  }

  // Validate file type for signatures (allow more image types)
  const allowedTypes = ["jpg", "jpeg", "png", "pdf"];
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  if (!fileExtension || !allowedTypes.includes(fileExtension)) {
    console.log("❌ Invalid file type:", fileExtension);
    throw new Error(
      "File type not allowed. Please upload JPG, PNG, or PDF files."
    );
  }

  const formData = new FormData();
  formData.append("file", file); // Changed back to "file" to match backend expectations

  try {
    console.log("🌐 Making API request to upload endpoint...");
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.log(
        "❌ Upload API response not ok:",
        response.status,
        response.statusText
      );
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("✅ Upload successful! Response:", result);
    console.log("🔗 Google Drive link:", result.link);

    return result.link; // Return the Google Drive link
  } catch (error: any) {
    console.error("💥 Drive upload error:", error);
    throw new Error("Failed to upload file");
  }
};

// Submit membership form
export const submitMembershipForm = async (formData: any) => {
  console.log("📝 Submitting membership form...", formData);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/membership-form/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("❌ Form submission failed:", response.status, errorData);
      throw new Error(
        errorData.message || `Submission failed: ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("✅ Form submitted successfully!", result);

    return result;
  } catch (error: any) {
    console.error("💥 Form submission error:", error);
    alert(error?.message || "Failed to submit form");
    throw new Error(error.message || "Failed to submit form");
  }
};
