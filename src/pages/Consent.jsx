import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../App.css";

import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { useAuth } from "../AuthContext";
import { db } from "../firebase";

function Consent() {
  const navigate = useNavigate();
const location = useLocation();
const { user } = useAuth();

const scheme =
  location.state?.scheme ||
  JSON.parse(localStorage.getItem("selectedScheme") || "null");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // APPLICATION / PROFILE DATA
  // --------------------------------------------------

  const [applicationData, setApplicationData] = useState({
    name: "",
    mobile: "",
    email: "",
    education: "",
    address: "",
    income: "",
  });

  // --------------------------------------------------
  // CONSENT STATE
  // --------------------------------------------------

  const [consent, setConsent] = useState({
    name: true,
    mobile: true,
    email: true,
    education: true,
    income: false,
    documents: false,
  });

  // --------------------------------------------------
  // DOCUMENT STATES
  // --------------------------------------------------

  // Documents already uploaded by the user
  const [documents, setDocuments] = useState({});

  // Documents selected to share with government service
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // Which document is currently being uploaded
  const [uploadingDocument, setUploadingDocument] =
    useState(null);

  // Hidden file input
  const fileInputRef = useRef(null);

  // --------------------------------------------------
  // AVAILABLE DOCUMENT TYPES
  // --------------------------------------------------

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

  // --------------------------------------------------
  // GET PROFILE DATA FROM FIREBASE
  // --------------------------------------------------

  useEffect(() => {
    if (!user) return;

    const userRef = doc(
      db,
      "users",
      user.uid
    );

    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const profile = snapshot.data();

          setApplicationData({
            name: profile.name || "",
            mobile: profile.mobile || "",
            email:
              profile.email ||
              user.email ||
              "",
            education:
              profile.education || "",
            address:
              profile.district &&
              profile.state
                ? `${profile.district}, ${profile.state}`
                : profile.address || "",
            income:
              profile.income || "",
          });
        }

        setLoadingProfile(false);
      },
      (error) => {
        console.error(
          "Consent Profile Error:",
          error
        );

        setLoadingProfile(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // --------------------------------------------------
  // GET UPLOADED DOCUMENTS FROM FIREBASE
  // --------------------------------------------------

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
          documentData[item.id] =
            item.data();
        });

        setDocuments(documentData);

        console.log(
          "📁 Documents loaded:",
          documentData
        );
      },
      (error) => {
        console.error(
          "❌ Consent Documents Error:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, [user]);

  // --------------------------------------------------
  // TOGGLE NORMAL CONSENT
  // --------------------------------------------------

  const toggleConsent = (field) => {
    setConsent((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  // --------------------------------------------------
  // SELECT / UNSELECT DOCUMENT
  // --------------------------------------------------

  const toggleDocument = (documentId) => {
    setSelectedDocuments(
      (previous) => {
        if (
          previous.includes(
            documentId
          )
        ) {
          return previous.filter(
            (id) =>
              id !== documentId
          );
        }

        return [
          ...previous,
          documentId,
        ];
      }
    );
  };

  // --------------------------------------------------
  // OPEN FILE PICKER
  // --------------------------------------------------

  const handleDocumentUploadClick = (
    documentId
  ) => {
    setUploadingDocument(
      documentId
    );

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";

      fileInputRef.current.click();
    }
  };

  // --------------------------------------------------
  // UPLOAD DOCUMENT TO CLOUDINARY
  // --------------------------------------------------

  const handleDocumentUpload = async (
    event
  ) => {
    const file =
      event.target.files[0];

    if (
      !file ||
      !uploadingDocument ||
      !user
    ) {
      return;
    }

    // Allowed file types
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      alert(
        "Please upload only PDF, JPG or PNG files."
      );

      setUploadingDocument(null);

      return;
    }

    // Maximum 5 MB
    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "File size must be less than 5 MB."
      );

      setUploadingDocument(null);

      return;
    }

    try {
      setLoading(true);

      console.log(
        "📤 Uploading:",
        file.name
      );

      // ----------------------------------------------
      // CLOUDINARY UPLOAD
      // ----------------------------------------------

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "upload_preset",
        "mahasetu_documents"
      );

      const response = await axios.post(
  "https://api.cloudinary.com/v1_1/ogbzccgt/auto/upload",
  formData
);

const data = response.data;

      if (!response.ok) {
        console.error(
          "Cloudinary Error:",
          data
        );

        throw new Error(
          "Cloudinary upload failed"
        );
      }

      console.log(
        "☁️ Cloudinary upload successful:",
        data.secure_url
      );

      // ----------------------------------------------
      // FIND DOCUMENT TYPE
      // ----------------------------------------------

      const selectedType =
        documentTypes.find(
          (item) =>
            item.id ===
            uploadingDocument
        );

      // ----------------------------------------------
      // SAVE DOCUMENT METADATA TO FIRESTORE
      // ----------------------------------------------

      await setDoc(
        doc(
          db,
          "users",
          user.uid,
          "documents",
          uploadingDocument
        ),
        {
          documentId:
            uploadingDocument,

          name:
            selectedType?.name ||
            "Document",

          type:
            selectedType?.type ||
            "Other",

          fileName:
            file.name,

          fileType:
            file.type,

          fileSize:
            file.size,

          fileUrl:
            data.secure_url,

          publicId:
            data.public_id,

          status:
            "Uploaded",

          uploadedAt:
            new Date(),
        }
      );

      // ----------------------------------------------
      // AUTOMATICALLY SELECT DOCUMENT
      // ----------------------------------------------

      setSelectedDocuments(
        (previous) => {
          if (
            previous.includes(
              uploadingDocument
            )
          ) {
            return previous;
          }

          return [
            ...previous,
            uploadingDocument,
          ];
        }
      );

      alert(
        "Document uploaded successfully! ✅"
      );

    } catch (error) {
      console.error(
        "❌ Consent Document Upload Error:",
        error
      );

      alert(
        "Document upload failed. Please check Cloudinary settings."
      );
    } finally {
      setLoading(false);

      setUploadingDocument(null);

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }
    }
  };

  // --------------------------------------------------
  // GIVE CONSENT + SUBMIT APPLICATION
  // --------------------------------------------------

  const giveConsent =
    async () => {
      try {
        setLoading(true);

        // --------------------------------------------
        // CHECK USER
        // --------------------------------------------

        if (!user) {
          alert(
            "Please login first."
          );

          navigate("/login");

          return;
        }

        // --------------------------------------------
        // REQUIRED CONSENT
        // --------------------------------------------

        if (
          !consent.name ||
          !consent.mobile ||
          !consent.email ||
          !consent.education
        ) {
          alert(
            "Please provide consent for all required information."
          );

          setLoading(false);

          return;
        }

        // --------------------------------------------
        // DOCUMENT CONSENT CHECK
        // --------------------------------------------

        if (
          consent.documents &&
          selectedDocuments.length === 0
        ) {
          alert(
            "Please select at least one document to share."
          );

          setLoading(false);

          return;
        }

        // --------------------------------------------
        // PREPARE DATA TO SHARE
        // --------------------------------------------

        const dataToShare = {};

        if (consent.name) {
          dataToShare.name =
            applicationData.name;
        }

        if (consent.mobile) {
          dataToShare.mobile =
            applicationData.mobile;
        }

        if (consent.email) {
          dataToShare.email =
            applicationData.email;
        }

        if (consent.education) {
          dataToShare.education =
            applicationData.education;
        }

        if (consent.income) {
          dataToShare.income =
            applicationData.income;
        }

        // --------------------------------------------
        // SELECTED DOCUMENTS
        // --------------------------------------------

        if (consent.documents) {
          dataToShare.documents =
            selectedDocuments.map(
              (documentId) => ({
                documentId:
                  documentId,

                name:
                  documents[
                    documentId
                  ]?.name || "",

                fileName:
                  documents[
                    documentId
                  ]?.fileName || "",

                fileUrl:
                  documents[
                    documentId
                  ]?.fileUrl || "",

                fileType:
                  documents[
                    documentId
                  ]?.fileType || "",
              })
            );
        }

        // --------------------------------------------
        // ADDRESS
        // --------------------------------------------

        dataToShare.address =
          applicationData.address;

        console.log(
          "📤 Data shared with Government API:",
          dataToShare
        );

        // --------------------------------------------
        // SEND TO MAHASETU BACKEND
        // --------------------------------------------

        const response =
  await axios.post(
    `${import.meta.env.VITE_API_URL}/api/applications/submit`,
    {
      ...dataToShare,

      scheme: {
        name:
          scheme?.name ||
          "Government Scholarship",

        department:
          scheme?.department ||
          "Education Department",

        match:
          scheme?.match ||
          null
      }
    }
  );

        console.log(
          "Backend Response:",
          response.data
        );

        // --------------------------------------------
        // GET GOVERNMENT APPLICATION ID
        // --------------------------------------------

        const governmentId =
          response.data?.data
            ?.governmentApplicationId;

        if (!governmentId) {
          throw new Error(
            "Government Application ID was not received."
          );
        }

        // --------------------------------------------
        // SAVE ID LOCALLY
        // --------------------------------------------

        localStorage.setItem(
          "governmentApplicationId",
          governmentId
        );

        // --------------------------------------------
        // SAVE APPLICATION TO FIRESTORE
        // --------------------------------------------

        await setDoc(
          doc(
            db,
            "applications",
            governmentId
          ),
          {
            userId:
              user.uid,

            service:
              "Government Scholarship",

            department:
              response.data?.data
                ?.department ||
              "Education Department",

            applicant:
              applicationData,

            sharedData:
              dataToShare,

            governmentApplicationId:
              governmentId,

            status:
              response.data?.data
                ?.status ||
              "SUBMITTED",

            consent:
              consent,

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),
          }
        );

        // --------------------------------------------
        // CREATE NOTIFICATION
        // --------------------------------------------

        const notificationRef =
          doc(
            collection(
              db,
              "notifications"
            )
          );

        await setDoc(
          notificationRef,
          {
            userId:
              user.uid,

            type:
              "success",

            icon:
              "✅",

            title:
              "Application Submitted",

            message:
              `Your Government Scholarship application ${governmentId} has been successfully submitted.`,

            unread:
              true,

            applicationId:
              governmentId,

            createdAt:
              serverTimestamp(),

            time:
              "Just now",
          }
        );

        // --------------------------------------------
        // SAVE CONSENT LOCALLY
        // --------------------------------------------

        localStorage.setItem(
          "consentGiven",
          "true"
        );

        console.log(
          "✅ Application and notification saved to Firebase"
        );

        // --------------------------------------------
        // SUCCESS PAGE
        // --------------------------------------------

        navigate(
          "/application-success"
        );

      } catch (error) {
        console.error(
          "❌ Application Error:",
          error
        );

        alert(
          "Unable to submit application. Please make sure the backend and Firebase are running."
        );
      } finally {
        setLoading(false);
      }
    };

  // --------------------------------------------------
  // LOADING PROFILE
  // --------------------------------------------------

  if (loadingProfile) {
    return (
      <div className="dashboard-layout">
        <main className="main-content">
          <h2>
            Loading your information...
          </h2>
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="dashboard-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="logo">
          <span>🌐</span>
          MahaSetu
        </div>

        <nav>

          <a href="/dashboard">
            🏠 Dashboard
          </a>

          <a href="/services">
            🏛️ Government Services
          </a>

          <a href="/ai-scheme-finder">
            🤖 AI Scheme Finder
          </a>

          <a href="/applications">
            📋 My Applications
          </a>

          <a href="/documents">
            📁 Documents
          </a>

          <a href="/consent-manager">
            🔐 Consent Manager
          </a>

          <a href="/notifications">
            🔔 Notifications
          </a>

          <a href="/profile">
            👤 Profile Settings
          </a>

        </nav>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">

        {/* HEADER */}

        <header className="dashboard-header">

          <div className="header-search">

            🔍

            <input
              type="text"
              placeholder="Search services..."
            />

          </div>

          <div className="header-right">

            🌐 English

            <span>
              🔔
            </span>

            <span>
              👤{" "}
              {applicationData.name ||
                "Citizen"}
            </span>

          </div>

        </header>


        {/* =================================================
            CONSENT PAGE
        ================================================= */}

        <section className="consent-page">

          {/* BACK */}

          <button
            className="back-link"
            onClick={() =>
              navigate(
                "/service-details"
              )
            }
          >
            ← Back to Service
          </button>


          {/* =================================================
              CONSENT HEADER
          ================================================= */}

          <div className="consent-header">

            <div className="consent-icon">
              🔐
            </div>

            <div>

              <span className="page-label">
                DATA PRIVACY
              </span>

              <h1>
                Data Sharing Consent
              </h1>

              <p>
                Choose which information
                MahaSetu can share with
                the selected government
                service.
              </p>

            </div>

          </div>


          {/* =================================================
              SELECTED SERVICE
          ================================================= */}

          <div className="consent-service">

            <div>

              <span>
                Selected Service
              </span>

              <h3>
  {scheme?.icon || "🎓"}{" "}
  {scheme?.name || "Government Scholarship"}
</h3>

<p>
  {scheme?.department || "Education Department"}
</p>

            </div>

            <span className="connected-badge">
              Connected
            </span>

          </div>


          {/* =================================================
              DATA FIELDS
          ================================================= */}

          <div className="consent-list">

            <ConsentItem
              title="Full Name"
              description="Required for applicant identification"
              enabled={
                consent.name
              }
              onToggle={() =>
                toggleConsent(
                  "name"
                )
              }
            />


            <ConsentItem
              title="Mobile Number"
              description="Used for application notifications"
              enabled={
                consent.mobile
              }
              onToggle={() =>
                toggleConsent(
                  "mobile"
                )
              }
            />


            <ConsentItem
              title="Email Address"
              description="Used for application communication"
              enabled={
                consent.email
              }
              onToggle={() =>
                toggleConsent(
                  "email"
                )
              }
            />


            <ConsentItem
              title="Education Details"
              description="Required to determine scholarship eligibility"
              enabled={
                consent.education
              }
              onToggle={() =>
                toggleConsent(
                  "education"
                )
              }
            />


            <ConsentItem
              title="Income Information"
              description="Required only for income-based scholarships"
              enabled={
                consent.income
              }
              onToggle={() =>
                toggleConsent(
                  "income"
                )
              }
            />


            {/* DOCUMENT CONSENT */}

            <ConsentItem
              title="Documents"
              description="Academic and supporting documents"
              enabled={
                consent.documents
              }
              onToggle={() =>
                toggleConsent(
                  "documents"
                )
              }
            />

          </div>


          {/* =================================================
              DOCUMENT SELECTION
          ================================================= */}

          {consent.documents && (

            <div className="document-selection">

              <div className="document-selection-header">

                <div>

                  <h3>
                    📁 Select Documents
                  </h3>

                  <p>
                    Select the documents
                    you want to share with
                    this government
                    service.
                  </p>

                </div>

                <span className="document-count">
                  {selectedDocuments.length}{" "}
                  selected
                </span>

              </div>


              <div className="consent-document-list">

                {documentTypes.map(
                  (document) => {

                    const uploaded =
                      documents[
                        document.id
                      ];

                    const selected =
                      selectedDocuments.includes(
                        document.id
                      );

                    return (

                      <div
                        key={
                          document.id
                        }
                        className={`consent-document-item ${
                          selected
                            ? "selected"
                            : ""
                        }`}
                      >

                        {/* DOCUMENT INFO */}

                        <div className="consent-document-info">

                          <span className="document-icon">
                            {
                              document.icon
                            }
                          </span>

                          <div>

                            <h4>
                              {
                                document.name
                              }
                            </h4>

                            <p>
                              {
                                document.type
                              }
                            </p>

                            {uploaded && (

                              <small>
                                📎{" "}
                                {
                                  uploaded.fileName
                                }
                              </small>

                            )}

                          </div>

                        </div>


                        {/* ACTION */}

                        <div className="consent-document-action">

                          {uploaded ? (

                            <>

                              <span className="document-uploaded">
                                ✓ Uploaded
                              </span>

                              <label className="document-checkbox">

                                <input
                                  type="checkbox"
                                  checked={
                                    selected
                                  }
                                  onChange={() =>
                                    toggleDocument(
                                      document.id
                                    )
                                  }
                                />

                                Share

                              </label>

                            </>

                          ) : (

                            <button
                              type="button"
                              className="document-upload-button"
                              onClick={() =>
                                handleDocumentUploadClick(
                                  document.id
                                )
                              }
                              disabled={
                                loading
                              }
                            >

                              {uploadingDocument ===
                              document.id
                                ? "Uploading..."
                                : "Upload"}

                            </button>

                          )}

                        </div>

                      </div>

                    );
                  }
                )}

              </div>


              {/* HIDDEN FILE INPUT */}

              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{
                  display:
                    "none",
                }}
                onChange={
                  handleDocumentUpload
                }
              />

            </div>

          )}


          {/* =================================================
              SECURITY BOX
          ================================================= */}

          <div className="security-box">

            <div className="security-icon">
              🛡️
            </div>

            <div>

              <h3>
                Your data is protected
              </h3>

              <p>
                MahaSetu only shares the
                information you authorize.
                Your data is transmitted
                securely and is not shared
                with unauthorized services.
              </p>

            </div>

          </div>


          {/* =================================================
              ACTION
          ================================================= */}

          <div className="consent-action">

            <p>
              By clicking "Give Consent",
              you authorize MahaSetu to
              share the selected information
              with the government service.
            </p>

            <button
              className="give-consent-button"
              onClick={
                giveConsent
              }
              disabled={
                loading
              }
            >

              {loading
                ? "Processing..."
                : "Give Consent →"}

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}


/* =========================================================
   REUSABLE CONSENT ITEM
========================================================= */

function ConsentItem({
  title,
  description,
  enabled,
  onToggle,
}) {
  return (

    <div className="consent-item">

      <div className="consent-info">

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>

      <label className="switch">

        <input
          type="checkbox"
          checked={
            enabled
          }
          onChange={
            onToggle
          }
        />

        <span className="slider"></span>

      </label>

    </div>

  );
}

export default Consent;