import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "../App.css";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [applicationCount, setApplicationCount] = useState(0);
  const [apiUpdateCount, setApiUpdateCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // 🔥 REAL-TIME NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }

    const notificationsRef = collection(
      db,
      "notifications"
    );

    const notificationsQuery = query(
      notificationsRef,
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notificationList = snapshot.docs.map(
          (notificationDoc) => ({
            id: notificationDoc.id,
            ...notificationDoc.data(),
          })
        );

        // Latest notifications first
        notificationList.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;

          return timeB - timeA;
        });

        setNotifications(notificationList);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Notification Firebase Error:",
          error
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  // =====================================================
  // 📄 REAL-TIME APPLICATION COUNT
  // =====================================================

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) return;

    const applicationsRef = collection(
      db,
      "applications"
    );

    const applicationsQuery = query(
      applicationsRef,
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      applicationsQuery,
      (snapshot) => {
        setApplicationCount(snapshot.size);
      }
    );

    return () => unsubscribe();
  }, []);

  // =====================================================
  // 🔗 API UPDATE COUNT
  // =====================================================

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) return;

    const applicationsRef = collection(
      db,
      "applications"
    );

    const applicationsQuery = query(
      applicationsRef,
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      applicationsQuery,
      (snapshot) => {
        let apiCount = 0;

        snapshot.docs.forEach((document) => {
          const data = document.data();

          if (
            data.department ||
            data.governmentApplicationId
          ) {
            apiCount++;
          }
        });

        setApiUpdateCount(apiCount);
      }
    );

    return () => unsubscribe();
  }, []);

  // =====================================================
  // ✓ MARK ONE AS READ
  // =====================================================

  const markRead = async (notification) => {
    try {
      if (!notification.unread) return;

      await updateDoc(
        doc(
          db,
          "notifications",
          notification.id
        ),
        {
          unread: false,
        }
      );
    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );
    }
  };

  // =====================================================
  // ✓ MARK ALL AS READ
  // =====================================================

  const markAllRead = async () => {
    try {
      const unreadNotifications =
        notifications.filter(
          (notification) => notification.unread
        );

      if (unreadNotifications.length === 0) {
        return;
      }

      const batch = writeBatch(db);

      unreadNotifications.forEach(
        (notification) => {
          const notificationRef = doc(
            db,
            "notifications",
            notification.id
          );

          batch.update(notificationRef, {
            unread: false,
          });
        }
      );

      await batch.commit();

    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );
    }
  };

  // =====================================================
  // 🔢 UNREAD COUNT
  // =====================================================

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  // =====================================================
  // ⏳ LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>🔔 Loading Notifications...</h2>
          <p>
            Connecting to MahaSetu notifications.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // 🖥️ PAGE
  // =====================================================

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

          <a href="/documents">
            📁 Documents
          </a>

          <a href="/consent-manager">
            🔐 Consent Manager
          </a>

          <a
            href="/notifications"
            className="active"
          >
            🔔 Notifications

            {unreadCount > 0 && (
              <span className="notification-count">
                {unreadCount}
              </span>
            )}
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
            <h3>Notifications</h3>

            <p>
              Stay updated about your government services
            </p>
          </div>

          <div className="header-user">
            👤 Citizen
          </div>

        </header>

        {/* Page */}
        <section className="notifications-page">

          {/* Intro */}
          <div className="notifications-intro">

            <div className="notifications-icon">
              🔔
            </div>

            <div>

              <h1>
                Notifications & Alerts
              </h1>

              <p>
                Important updates about your
                applications, documents and
                government services.
              </p>

            </div>

          </div>

          {/* Summary */}
          <div className="notification-summary">

            <div className="notification-summary-card">

              <span>🔔</span>

              <div>
                <strong>
                  {unreadCount}
                </strong>

                <p>
                  Unread Notifications
                </p>
              </div>

            </div>

            <div className="notification-summary-card">

              <span>📄</span>

              <div>
                <strong>
                  {applicationCount}
                </strong>

                <p>
                  Total Applications
                </p>
              </div>

            </div>

            <div className="notification-summary-card">

              <span>🔗</span>

              <div>
                <strong>
                  {apiUpdateCount}
                </strong>

                <p>
                  API Updates
                </p>
              </div>

            </div>

          </div>

          {/* Notification Header */}
          <div className="notifications-header">

            <div>

              <h2>
                Recent Notifications
              </h2>

              <p>
                {notifications.length} notifications
              </p>

            </div>

            {unreadCount > 0 && (
              <button
                className="mark-read-btn"
                onClick={markAllRead}
              >
                ✓ Mark all as read
              </button>
            )}

          </div>

          {/* Notifications List */}
          <div className="notifications-list">

            {notifications.length === 0 ? (

              <div className="application-info-box">

                <div className="info-box-icon">
                  🔔
                </div>

                <div>

                  <h3>
                    No Notifications Yet
                  </h3>

                  <p>
                    You will receive notifications
                    about your applications and
                    government services here.
                  </p>

                </div>

              </div>

            ) : (

              notifications.map(
                (notification) => (

                  <div
                    key={notification.id}
                    className={`notification-card ${
                      notification.unread
                        ? "unread"
                        : ""
                    }`}
                    onClick={() =>
                      markRead(notification)
                    }
                  >

                    <div
                      className={`notification-type ${
                        notification.type ||
                        "info"
                      }`}
                    >
                      {notification.icon ||
                        "🔔"}
                    </div>

                    <div className="notification-content">

                      <div className="notification-title-row">

                        <h3>
                          {notification.title}
                        </h3>

                        {notification.unread && (
                          <span className="unread-dot"></span>
                        )}

                      </div>

                      <p>
                        {notification.message}
                      </p>

                      <small>
                        {notification.time ||
                          "Recently"}
                      </small>

                    </div>

                    <span className="notification-arrow">
                      →
                    </span>

                  </div>

                )
              )

            )}

          </div>

          {/* Smart Alerts */}
          <div className="smart-alerts">

            <div className="smart-alert-icon">
              🤖
            </div>

            <div>

              <h2>
                Smart Alerts
              </h2>

              <p>
                MahaSetu can automatically notify
                you when your application status
                changes, a document is required,
                or a government service becomes
                available.
              </p>

              <span>
                ✓ Application Status
                &nbsp;&nbsp;
                ✓ Document Alerts
                &nbsp;&nbsp;
                ✓ Government Updates
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Notifications;