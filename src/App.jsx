import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Alert, Row, Col, Button, Table, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCDqoxsSDKfiq84QbnhkiVKIzueZC9oFDg",
  authDomain: "lwcs-health-monitoring-s-efe40.firebaseapp.com",
  projectId: "lwcs-health-monitoring-s-efe40",
  storageBucket: "lwcs-health-monitoring-s-efe40.firebasestorage.app",
  messagingSenderId: "957745080870",
  appId: "1:957745080870:web:616e4effdb21a9704894e7",
  measurementId: "G-2V5FC5DZEM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Detailed SVG matching the Little Way College Seminary Seal
const LWCSLogo = ({ size = 110 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ display: 'inline-block' }}>
    <defs>
      <path id="topArc" d="M 28,100 A 72,72 0 1,1 172,100" />
      <path id="bottomArc" d="M 26,105 A 74,74 0 0,0 174,105" />
      <clipPath id="innerCircle">
        <circle cx="100" cy="100" r="61" />
      </clipPath>
    </defs>

    {/* Outer White & Black Borders + Yellow Ring */}
    <circle cx="100" cy="100" r="98" fill="#ffffff" />
    <circle cx="100" cy="100" r="95" fill="#fff02a" stroke="#111111" strokeWidth="3" />
    <circle cx="100" cy="100" r="62" fill="#0095ff" stroke="#111111" strokeWidth="2.5" />

    {/* Curved Text: Little Way College Seminary */}
    <text fill="#111111" fontSize="14.5" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="0.4">
      <textPath href="#topArc" startOffset="50%" textAnchor="middle">
        Little Way College Seminary
      </textPath>
    </text>

    {/* Curved Text: Diocese of Kabankalan */}
    <text fill="#111111" fontSize="12.5" fontWeight="bold" fontFamily="Georgia, serif" letterSpacing="0.5">
      <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
        Diocese of Kabankalan
      </textPath>
    </text>

    {/* Left & Right 5-Point Stars */}
    <polygon points="24,113 26.5,120 34,120 28,124.5 30,131.5 24,127 18,131.5 20,124.5 14,120 21.5,120" fill="#111111" />
    <polygon points="176,113 178.5,120 186,120 180,124.5 182,131.5 176,127 170,131.5 172,124.5 166,120 173.5,120" fill="#111111" />

    {/* Inner Seal Artwork */}
    <g clipPath="url(#innerCircle)">
      {/* Sky Blue Background */}
      <rect x="35" y="35" width="130" height="130" fill="#0099ff" />

      {/* Top Colored Rays (Green, Yellow, White, Blue, Red) */}
      <polygon points="100,82 40,82 52,55" fill="#009933" />
      <polygon points="100,82 52,55 82,38" fill="#fff200" />
      <polygon points="100,82 82,38 118,38" fill="#ffffff" />
      <polygon points="100,82 118,38 148,55" fill="#0033cc" />
      <polygon points="100,82 148,55 160,82" fill="#cc0000" />

      {/* Top Center Eucharist / Monstrance Emblem */}
      <circle cx="100" cy="49" r="6.5" fill="#e69900" stroke="#111" strokeWidth="1.2" />
      <circle cx="100" cy="49" r="3" fill="#ffffff" />

      {/* Green Grass Ground */}
      <ellipse cx="100" cy="155" rx="60" ry="22" fill="#7ac943" />

      {/* Left Oval Portrait (St. Thérèse of the Child Jesus) */}
      <ellipse cx="73" cy="118" rx="14" ry="20" fill="#ffffff" stroke="#8c6239" strokeWidth="1.5" />
      <ellipse cx="73" cy="119" rx="11.5" ry="17.5" fill="#e6f2ff" />
      {/* Habit & Veil */}
      <path d="M 64,132 Q 73,112 82,132 Z" fill="#5c3a21" />
      <path d="M 66,124 Q 73,113 80,124 L 78,133 L 68,133 Z" fill="#f5e6cc" />
      <circle cx="73" cy="111" r="4.5" fill="#ffe0bd" />
      <path d="M 68,112 Q 73,104 78,112 L 79,118 L 67,118 Z" fill="#2b1b10" />
      {/* Roses */}
      <circle cx="75" cy="123" r="1.5" fill="#ff4d6d" />
      <circle cx="77" cy="125" r="1.5" fill="#ff8fa3" />

      {/* Right Chapel & Parishioners */}
      {/* Chapel Bell Tower */}
      <rect x="123" y="96" width="10" height="18" fill="#ffffff" stroke="#666" strokeWidth="0.7" />
      <polygon points="122,96 128,87 134,96" fill="#b32400" />
      <line x1="128" y1="83" x2="128" y2="88" stroke="#4d1a00" strokeWidth="1.2" />
      <line x1="126" y1="85" x2="130" y2="85" stroke="#4d1a00" strokeWidth="1.2" />
      <rect x="126" y="100" width="4" height="5" rx="2" fill="#ffcc00" />
      {/* Chapel Main Hall */}
      <rect x="115" y="114" width="26" height="16" fill="#ffffff" stroke="#666" strokeWidth="0.7" />
      <polygon points="113,114 128,106 143,114" fill="#b32400" />
      {/* Priest & Community Figures */}
      <circle cx="132" cy="127" r="2.5" fill="#ffe0bd" />
      <rect x="129.5" y="129.5" width="5" height="9" fill="#222222" />
      <circle cx="122" cy="131" r="2" fill="#ffe0bd" />
      <rect x="120" y="133" width="4" height="6" fill="#ff4d4d" />
      <circle cx="126" cy="132" r="2" fill="#ffe0bd" />
      <rect x="124" y="134" width="4" height="6" fill="#3399ff" />

      {/* Left & Right Palm Trees */}
      <path d="M 55,142 Q 52,120 48,103" stroke="#8c5319" strokeWidth="2.2" fill="none" />
      <path d="M 48,103 Q 38,98 36,106 M 48,103 Q 42,93 38,98 M 48,103 Q 55,94 58,102 M 48,103 Q 56,102 57,110" stroke="#228b22" strokeWidth="2" fill="none" />
      <path d="M 145,142 Q 148,120 152,103" stroke="#8c5319" strokeWidth="2.2" fill="none" />
      <path d="M 152,103 Q 162,98 164,106 M 152,103 Q 158,93 162,98 M 152,103 Q 145,94 142,102 M 152,103 Q 144,102 143,110" stroke="#228b22" strokeWidth="2" fill="none" />

      {/* Central Green Bamboo Cross */}
      <rect x="95.5" y="60" width="9" height="102" fill="#2e9e2e" stroke="#145214" strokeWidth="1" />
      <rect x="52" y="84" width="96" height="8.5" fill="#2e9e2e" stroke="#145214" strokeWidth="1" />
      {/* Bamboo Node Joints & Center Tie */}
      <line x1="95.5" y1="73" x2="104.5" y2="73" stroke="#145214" strokeWidth="1.2" />
      <line x1="95.5" y1="108" x2="104.5" y2="108" stroke="#145214" strokeWidth="1.2" />
      <line x1="95.5" y1="132" x2="104.5" y2="132" stroke="#145214" strokeWidth="1.2" />
      <line x1="72" y1="84" x2="72" y2="92.5" stroke="#145214" strokeWidth="1.2" />
      <line x1="128" y1="84" x2="128" y2="92.5" stroke="#145214" strokeWidth="1.2" />
      <line x1="95.5" y1="84" x2="104.5" y2="92.5" stroke="#d4af37" strokeWidth="1.5" />
      <line x1="104.5" y1="84" x2="95.5" y2="92.5" stroke="#d4af37" strokeWidth="1.5" />
    </g>
  </svg>
);

const FeverPortal = () => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Form states
  const [temperature, setTemperature] = useState('');
  const [unit, setUnit] = useState('C');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // History states
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
      if (currentUser) {
        fetchUserHistory(currentUser.uid);
      } else {
        setHistory([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setAuthError(
        `${error.message} — Add this exact domain to Firebase Authorized Domains: ${window.location.hostname}`
      );
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setHistory([]);
  };

  const getTempInCelsius = () => {
    const val = parseFloat(temperature);
    if (isNaN(val)) return null;
    return unit === 'F' ? ((val - 32) * 5) / 9 : val;
  };

  const getFeverStatus = () => {
    const tempC = getTempInCelsius();
    if (tempC === null) return null;

    if (tempC < 35.0) return { label: 'Hypothermia', variant: 'info' };
    if (tempC <= 37.5) return { label: 'Normal Temperature', variant: 'success' };
    if (tempC <= 38.0) return { label: 'Low-Grade Fever', variant: 'warning' };
    if (tempC <= 39.5) return { label: 'Moderate Fever', variant: 'warning' };
    return { label: 'High Fever!', variant: 'danger' };
  };

  const status = getFeverStatus();

  const handleSaveRecord = async (e) => {
    e.preventDefault();
    if (!temperature || !status || !user) return;

    setSaving(true);
    setMessage(null);

    try {
      await addDoc(collection(db, "temperature_records"), {
        userId: user.uid,
        userEmail: user.email || 'No Email',
        temperature: parseFloat(temperature),
        unit: unit,
        tempC: getTempInCelsius(),
        status: status.label,
        createdAt: serverTimestamp()
      });

      setMessage({ type: 'success', text: 'Recorded successfully!' });
      setTemperature('');
      fetchUserHistory(user.uid);
    } catch (error) {
      setMessage({ type: 'danger', text: `Database Error: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  const fetchUserHistory = async (uid) => {
    setLoadingHistory(true);
    try {
      const q = query(
        collection(db, "temperature_records"),
        where("userId", "==", uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt ? doc.data().createdAt.toDate().toLocaleString() : 'Just now'
      }));
      setHistory(records);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (loadingAuth) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: '650px' }}>
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
          <div className="d-flex align-items-center gap-2">
            <LWCSLogo size={42} />
            <h4 className="mb-0">Fever Tracker Portal</h4>
          </div>
          {user && (
            <div className="d-flex align-items-center gap-2">
              {user.photoURL && (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  style={{ width: '30px', height: '30px', borderRadius: '50%' }} 
                />
              )}
              <span className="small d-none d-sm-inline">{user.displayName || user.email}</span>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </Card.Header>

        <Card.Body className="p-4">
          {!user ? (
            <div className="text-center py-4">
              <div className="mb-4">
                <div className="mb-3">
                  <LWCSLogo size={135} />
                </div>
                <h4 className="fw-bold text-primary mb-1">Little Way College Seminary</h4>
                <p className="text-muted small">Diocese of Kabankalan — Health Monitoring Portal</p>
              </div>

              <h5 className="mb-4">Sign in with your Google account to view your private temperature log</h5>
              
              {authError && (
                <Alert variant="danger" className="text-start small user-select-all">
                  {authError}
                </Alert>
              )}

              <div className="d-grid gap-3 col-md-8 mx-auto">
                <Button variant="danger" size="lg" onClick={handleGoogleLogin}>
                  Continue with Google
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Form onSubmit={handleSaveRecord}>
                <Form.Group className="mb-3" controlId="temperatureInput">
                  <Form.Label className="fw-semibold">Enter Current Temperature</Form.Label>
                  <Row className="g-2">
                    <Col xs={7}>
                      <Form.Control
                        type="number"
                        step="0.1"
                        placeholder={unit === 'C' ? 'e.g. 37.5' : 'e.g. 99.5'}
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        required
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Select value={unit} onChange={(e) => setUnit(e.target.value)}>
                        <option value="C">°C</option>
                        <option value="F">°F</option>
                      </Form.Select>
                    </Col>
                    <Col xs={2}>
                      <Button type="submit" variant="success" className="w-100" disabled={saving || !status}>
                        {saving ? <Spinner animation="border" size="sm" /> : 'Save'}
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>

              {message && (
                <Alert variant={message.type} className="py-2 text-center">
                  {message.text}
                </Alert>
              )}

              {status && (
                <Alert variant={status.variant} className="text-center mb-4">
                  <span className="fw-bold">{status.label}</span> ({temperature} °{unit})
                </Alert>
              )}

              <hr className="my-4" />

              <h5 className="mb-3">My Private Temperature History</h5>
              {loadingHistory ? (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" /> Loading your records...
                </div>
              ) : history.length === 0 ? (
                <p className="text-muted text-center">No temperature records found for your account.</p>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Temp</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((rec) => (
                        <tr key={rec.id}>
                          <td>{rec.date}</td>
                          <td>{rec.temperature} °{rec.unit}</td>
                          <td>
                            <span className={`badge bg-${rec.status.includes('High') ? 'danger' : rec.status.includes('Fever') ? 'warning text-dark' : 'success'}`}>
                              {rec.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FeverPortal;
