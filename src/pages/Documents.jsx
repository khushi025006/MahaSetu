import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import "../App.css";

function Documents() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [documents, setDocuments] = useState({});
  const [uploading, setUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const fileInputRef = useRef(null);

  // Predefined documents
  const documentTypes = [
    {
      id: "aadhaar",
      name: "Aadhaar Card",
      type: "Government ID",
      icon: "🪪",
    },
    {
      id: "education",
      name: "Education Certificate",
      type: "Education",
      icon: "🎓",
    },
    {
      id: "income",
      name: "Income Certificate",
      type: "Income",
      icon: "💰",
    },
    {
      id: "address",
      name: "Address Proof",
      type: "Address",
      icon: "🏠",
    },
    {
      id: "caste",
      name: "Caste Certificate",
      type: "Social Welfare",
      icon: "📄",
    },
    {
      id: "domicile",
      name: "Domicile Certificate",
      type: "Residence",
      icon: "📋",
    },
  ];

  // Get documents from Firestore in realtime
  useEffect(() => {
    if (!user) return;

    const documentsRef = collection(
      db,
      "users",
      user.uid,
      "documents"
    );

    const unsubscribe = onSnapshot(
      documentsRef,
      (snapshot) => {
        const documentData = {};

        snapshot.forEach((item) => {
          documentData[item.id] = item.data();
        });

        setDocuments(documentData);
      },
      (error) => {
        console.error("Firestore Documents Error:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Open file selector for a particular document
  const handleUploadClick = (documentId) => {
    setSelectedDocument(documentId);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Upload selected file
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file || !selectedDocument || !user) {
      return;
    }

    // Allowed file types
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload only PDF, JPG or PNG files.");
      return;
    }

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5 MB.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "upload_preset",
        "mahasetu_documents"
      );

      // Cloudinary upload
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/ogbzccgt/auto/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Cloudinary Error:", data);
        throw new Error("Cloudinary upload failed");
      }

      // Save document information in Firestore
      await setDoc(
        doc(
          db,
          "users",
          user.uid,
          "documents",
          selectedDocument
        ),
        {
          documentId: selectedDocument,
          name:
            documentTypes.find(
              (item) => item.id === selectedDocument
            )?.name || "Document",

          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,

          fileUrl: data.secure_url,
          publicId: data.public_id,

          status: "Uploaded",
          uploadedAt: new Date(),
        }
      );

      alert("Document uploaded successfully! ✅");

    } catch (error) {
      console.error("Document Upload Error:", error);

      alert(
        "Document upload failed. Please check Cloudinary settings."
      );
    } finally {
      setUploading(false);
      setSelectedDocument(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // View document
  const handleView = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  // Remove document
  const handleRemove = async (documentId) => {
    if (!user) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to remove this document?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(
          db,
          "users",
          user.uid,
          "documents",
          documentId
        )
      );

      alert("Document removed successfully.");
    } catch (error) {
      console.error("Remove Document Error:", error);

      alert("Unable to remove document.");
    }
  };

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className="sidebar">

        <h2 className="sidebar-logo">
          🏛️ MahaSetu
        </h2>

        <nav>

          <a href="/dashboard">
            📊 Dashboard
          </a>

          <a href="/services">
            🏛️ Government Services
          </a>

          <a href="/ai-scheme-finder">
            🤖 AI Scheme Finder
          </a>

          <a href="/applications">
            📄 My Applications
          </a>

          <a href="/autofill">
            ⚡ Smart Auto-Fill
          </a>

          <a
            href="/documents"
            className="active"
          >
            📁 Documents
          </a>

          <a href="/consent-manager">
            🔐 Consent Manager
          </a>

          <a href="/notifications">
            🔔 Notifications
          </a>

          <a href="/profile">
            ⚙️ Profile Settings
          </a>

        </nav>

      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Header */}
        <header className="top-header">

          <div>

            <h3>Documents</h3>

            <p>
              Manage your documents in one secure place
            </p>

          </div>

          <div className="header-user">
            👤 {user?.displayName || "Citizen"}
          </div>

        </header>

        {/* Page */}
        <section className="documents-page">

          {/* Intro */}
          <div className="documents-intro">

            <div className="documents-icon">
              📁
            </div>

            <div>

              <h1>
                Document Vault
              </h1>

              <p>
                Store and reuse your verified documents
                across government services.
              </p>

            </div>

          </div>

          {/* Security Banner */}
          <div className="documents-security">

            🔒

            <div>

              <strong>
                Your documents are protected
              </strong>

              <p>
                Documents are shared with government
                departments only after your consent.
              </p>

            </div>

          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
          />

          {/* Upload Section */}
          <div className="upload-card">

            <div>

              <h2>
                Upload New Document
              </h2>

              <p>
                Select the upload button on any document
                below to add it to your vault.
              </p>

            </div>

          </div>

          {/* Documents */}
          <div className="documents-section">

            <div className="section-title">

              <div>

                <h2>
                  My Documents
                </h2>

                <p>
                  {Object.keys(documents).length} of{" "}
                  {documentTypes.length} documents uploaded
                </p>

              </div>

            </div>

            <div className="documents-grid">

              {documentTypes.map((document) => {

                const uploaded =
                  documents[document.id];

                return (

                  <div
                    className="document-card"
                    key={document.id}
                  >

                    <div className="document-top">

                      <div className="document-icon">
                        {document.icon}
                      </div>

                      <span
                        className={
                          uploaded
                            ? "document-status verified"
                            : "document-status available"
                        }
                      >
                        {uploaded
                          ? "✓ Uploaded"
                          : "Available"}
                      </span>

                    </div>

                    <h3>
                      {document.name}
                    </h3>

                    <p>
                      {document.type}
                    </p>

                    {!uploaded ? (

                      <div className="document-actions">

                        <button
                          onClick={() =>
                            handleUploadClick(
                              document.id
                            )
                          }
                          disabled={uploading}
                        >
                          📤{" "}
                          {uploading &&
                          selectedDocument ===
                            document.id
                            ? "Uploading..."
                            : `Upload ${document.name}`}
                        </button>

                      </div>

                    ) : (

                      <div className="document-actions">

                        <button
                          onClick={() =>
                            handleView(
                              uploaded.fileUrl
                            )
                          }
                        >
                          👁 View
                        </button>

                        <button
                          onClick={() =>
                            handleRemove(
                              document.id
                            )
                          }
                        >
                          🗑 Remove
                        </button>

                      </div>

                    )}

                  </div>

                );
              })}

            </div>

          </div>

          {/* Smart Document Matching */}
          <div className="document-matching">

            <div className="matching-icon">
              🤖
            </div>

            <div>

              <h2>
                Smart Document Matching
              </h2>

              <p>
                MahaSetu automatically identifies which
                documents are required for each government
                service.
              </p>

              <button
                onClick={() =>
                  navigate("/ai-scheme-finder")
                }
              >
                Find a Government Scheme →
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Documents;