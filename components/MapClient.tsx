/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Pin {
    id: string;
    latlng: [number, number];
    name: string;
    address?: string;
}

export default function MapClient() {
    const [mounted, setMounted] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [pins, setPins] = useState<Pin[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [pinName, setPinName] = useState("");
    const [tempLatLng, setTempLatLng] = useState<[number, number] | null>(null);
    const markersRef = useRef<Map<string, any>>(new Map());

    const [token, setToken] = useState<string | null>(null);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedToken = localStorage.getItem('token');
        if (savedToken) setToken(savedToken);
    }, []);

    const addMarkerToMap = useCallback((pin: Pin) => {
        if (!mapInstanceRef.current || markersRef.current.has(pin.id)) return;
        const L = (window as any).L;
        if (!L) return;

        const redIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [35, 56],
            iconAnchor: [17, 56],
            popupAnchor: [1, -45],
            shadowSize: [51, 51]
        });

        const marker = L.marker(pin.latlng, { icon: redIcon }).addTo(mapInstanceRef.current);

        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
          <div style="font-family: 'DM Sans', sans-serif; min-width: 160px; padding: 14px;">
            <b style="font-size: 13px; color: #1a1a2e;">${pin.address || "Brak adresu"}</b><br/>
            <span style="color: #888; font-size: 12px;">${pin.name}</span><br/>
            <button id="btn-del-${pin.id}" style="margin-top: 10px; background: #c0392b; color: white; border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; width: 100%; font-size: 12px; font-weight: 600; letter-spacing: 0.02em;">Usuń pineskę</button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
            const btn = document.getElementById(`btn-del-${pin.id}`);
            if (btn) btn.onclick = () => removePin(pin.id);
        });

        markersRef.current.set(pin.id, marker);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        fetch('http://localhost:8000/api/pins/')
            .then(res => res.json())
            .then(data => {
                const loadedPins = data.map((p: any) => ({
                    id: p.id.toString(),
                    latlng: [p.latitude, p.longitude],
                    name: p.name,
                    address: p.address
                }));
                setPins(loadedPins);
            })
            .catch(err => console.error("Błąd pobierania:", err));
    }, [mounted]);

    const removePin = async (id: string) => {
        const currentToken = localStorage.getItem('token');
        if (!currentToken) return alert("Zaloguj się!");
        try {
            const res = await fetch(`http://localhost:8000/api/pins/${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });
            if (res.ok) {
                const marker = markersRef.current.get(id);
                if (marker) mapInstanceRef.current.removeLayer(marker);
                markersRef.current.delete(id);
                setPins(prev => prev.filter(p => p.id !== id));
            }
        } catch (err) { console.error(err); }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");
        setLoginLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/token/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.access);
                setToken(data.access);
                setLoginModalOpen(false);
                setUsername("");
                setPassword("");
            } else {
                setLoginError("Nieprawidłowy login lub hasło");
            }
        } catch {
            setLoginError("Błąd połączenia z serwerem");
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    useEffect(() => {
        if (!mounted || mapInstanceRef.current) return;

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => {
            const L = (window as any).L;
            const map = L.map(mapRef.current!, {
                center: [51.649, 17.812],
                zoom: 17,
                zoomControl: false,
            });
            L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            }).addTo(map);
            L.control.zoom({ position: 'bottomright' }).addTo(map);
            mapInstanceRef.current = map;

            map.on('click', (e: any) => {
                setTempLatLng([e.latlng.lat, e.latlng.lng]);
                setModalOpen(true);
            });
        };
        document.head.appendChild(script);
    }, [mounted]);

    useEffect(() => {
        if (mapInstanceRef.current) {
            pins.forEach(pin => addMarkerToMap(pin));
        }
    }, [pins, addMarkerToMap]);

    const handleSave = async () => {
        const currentToken = localStorage.getItem('token');
        if (!pinName.trim() || !tempLatLng || !currentToken) return alert("Błąd danych lub brak logowania!");
        try {
            const res = await fetch('http://localhost:8000/api/pins/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                },
                body: JSON.stringify({
                    name: pinName,
                    address: `Współrzędne: ${tempLatLng[0].toFixed(4)}, ${tempLatLng[1].toFixed(4)}`,
                    latitude: tempLatLng[0],
                    longitude: tempLatLng[1]
                })
            });
            if (res.ok) {
                const saved = await res.json();
                setPins(prev => [...prev, {
                    id: saved.id.toString(),
                    latlng: [saved.latitude, saved.longitude],
                    name: saved.name,
                    address: saved.address
                }]);
                setModalOpen(false);
                setPinName("");
            }
        } catch (err) { console.error(err); }
    };

    if (!mounted) return null;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

                /* ── Auth Button ── */
                .auth-btn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    z-index: 1100;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 18px;
                    border-radius: 50px;
                    border: 1.5px solid transparent;
                    cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 600;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    transition: all 0.25s cubic-bezier(.4,0,.2,1);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
                    backdrop-filter: blur(8px);
                }
                .auth-btn.logged-in {
                    background: rgba(74, 124, 89, 0.92);
                    border-color: rgba(106, 173, 126, 0.5);
                    color: #fff;
                }
                .auth-btn.logged-out {
                    background: rgba(26, 26, 46, 0.88);
                    border-color: rgba(255,255,255,0.12);
                    color: #f0ede8;
                }
                .auth-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.28);
                }
                .auth-btn:active { transform: translateY(0); }
                .auth-btn .dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: currentColor;
                    opacity: 0.7;
                    animation: pulse 2s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }

                /* ── Login Modal Overlay ── */
                .login-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 20000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(10, 10, 20, 0.65);
                    backdrop-filter: blur(12px);
                    animation: fadeIn 0.2s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                /* ── Login Card ── */
                .login-card {
                    background: #faf8f5;
                    border-radius: 24px;
                    padding: 48px 44px 40px;
                    width: 380px;
                    max-width: 92vw;
                    box-shadow: 0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.06);
                    animation: slideUp 0.3s cubic-bezier(.4,0,.2,1);
                    position: relative;
                    overflow: hidden;
                }
                .login-card::before {
                    content: '';
                    position: absolute;
                    top: -60px;
                    right: -60px;
                    width: 180px;
                    height: 180px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(74,124,89,0.12) 0%, transparent 70%);
                    pointer-events: none;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(24px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }

                .login-icon {
                    width: 52px;
                    height: 52px;
                    border-radius: 16px;
                    background: #1a1a2e;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                    font-size: 22px;
                }
                .login-title {
                    font-family: 'Syne', sans-serif;
                    font-size: 26px;
                    font-weight: 800;
                    color: #1a1a2e;
                    margin: 0 0 4px;
                    letter-spacing: -0.02em;
                }
                .login-subtitle {
                    font-size: 13px;
                    color: #999;
                    margin: 0 0 32px;
                    font-weight: 400;
                }

                .login-field {
                    margin-bottom: 14px;
                }
                .login-field label {
                    display: block;
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #888;
                    margin-bottom: 6px;
                }
                .login-field input {
                    width: 100%;
                    padding: 12px 14px;
                    border-radius: 12px;
                    border: 1.5px solid #e0ddd8;
                    background: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    color: #1a1a2e;
                    outline: none;
                    transition: border-color 0.18s, box-shadow 0.18s;
                    box-sizing: border-box;
                }
                .login-field input:focus {
                    border-color: #4a7c59;
                    box-shadow: 0 0 0 3px rgba(74,124,89,0.12);
                }
                .login-field input::placeholder { color: #bbb; }

                .login-error {
                    background: rgba(192, 57, 43, 0.08);
                    border: 1px solid rgba(192, 57, 43, 0.2);
                    border-radius: 10px;
                    padding: 10px 14px;
                    font-size: 13px;
                    color: #c0392b;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .login-submit {
                    width: 100%;
                    padding: 14px;
                    border-radius: 12px;
                    border: none;
                    background: #1a1a2e;
                    color: #faf8f5;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: 0.04em;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
                    margin-top: 8px;
                    box-shadow: 0 4px 16px rgba(26,26,46,0.18);
                }
                .login-submit:hover:not(:disabled) {
                    background: #2d2d4e;
                    box-shadow: 0 8px 24px rgba(26,26,46,0.25);
                    transform: translateY(-1px);
                }
                .login-submit:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }

                .login-cancel {
                    width: 100%;
                    padding: 11px;
                    border-radius: 12px;
                    border: 1.5px solid #e0ddd8;
                    background: transparent;
                    color: #888;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: border-color 0.18s, color 0.18s;
                    margin-top: 8px;
                }
                .login-cancel:hover {
                    border-color: #c0c0c0;
                    color: #555;
                }

                /* ── Pin Modal ── */
                .pin-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.45);
                    backdrop-filter: blur(6px);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.18s ease;
                }
                .pin-card {
                    background: #faf8f5;
                    border-radius: 20px;
                    padding: 32px 28px;
                    width: 320px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
                    animation: slideUp 0.25s cubic-bezier(.4,0,.2,1);
                }
                .pin-card h3 {
                    font-family: 'Syne', sans-serif;
                    font-size: 18px;
                    font-weight: 700;
                    color: #1a1a2e;
                    margin: 0 0 16px;
                }
                .pin-card input {
                    width: 100%;
                    padding: 11px 13px;
                    border-radius: 10px;
                    border: 1.5px solid #e0ddd8;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    outline: none;
                    margin-bottom: 16px;
                    box-sizing: border-box;
                    transition: border-color 0.18s, box-shadow 0.18s;
                }
                .pin-card input:focus {
                    border-color: #4a7c59;
                    box-shadow: 0 0 0 3px rgba(74,124,89,0.12);
                }
                .pin-actions { display: flex; gap: 8px; }
                .pin-save {
                    flex: 1;
                    padding: 11px;
                    border-radius: 10px;
                    border: none;
                    background: #4a7c59;
                    color: white;
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                    transition: background 0.18s;
                }
                .pin-save:hover { background: #3d6849; }
                .pin-cancel-btn {
                    flex: 1;
                    padding: 11px;
                    border-radius: 10px;
                    border: 1.5px solid #e0ddd8;
                    background: transparent;
                    color: #888;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    cursor: pointer;
                    transition: border-color 0.18s;
                }
                .pin-cancel-btn:hover { border-color: #bbb; }

                /* ── Places list ── */
                .places-list {
                    margin-top: 10px;
                    padding: 18px 20px;
                    background: white;
                    border-radius: 16px;
                    max-height: 28vh;
                    overflow-y: auto;
                    box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
                }
                .places-list h3 {
                    font-family: 'Syne', sans-serif;
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    color: #999;
                    margin: 0 0 12px;
                }
                .place-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid #f0ede8;
                    font-size: 13px;
                    color: #1a1a2e;
                }
                .place-row:last-child { border-bottom: none; }
                .place-remove {
                    color: #c0392b;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.03em;
                    opacity: 0.7;
                    transition: opacity 0.15s;
                }
                .place-remove:hover { opacity: 1; }
            `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '10px' }}>

                {/* ── Auth Button ── */}
                <button
                    className={`auth-btn ${token ? 'logged-in' : 'logged-out'}`}
                    onClick={() => token ? handleLogout() : setLoginModalOpen(true)}
                >
                    <span className="dot" />
                    {token ? 'Panel aktywny' : 'Zaloguj się'}
                </button>

                {/* ── Map ── */}
                <div style={{ flex: 1, borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
                    <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
                </div>

                {/* ── Places list ── */}
                <div className="places-list">
                    <h3>Zapisane miejsca &nbsp;·&nbsp; {pins.length}</h3>
                    {pins.length === 0 && (
                        <p style={{ color: '#bbb', fontSize: '13px', margin: 0 }}>Kliknij mapę, aby dodać miejsce.</p>
                    )}
                    {pins.map(p => (
                        <div key={p.id} className="place-row">
                            <span>{p.name}</span>
                            <button className="place-remove" onClick={() => removePin(p.id)}>Usuń</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Add Pin Modal ── */}
            {modalOpen && (
                <div className="pin-overlay">
                    <div className="pin-card">
                        <h3>📍 Nowa pineska</h3>
                        <input
                            placeholder="Nazwa miejsca"
                            value={pinName}
                            onChange={e => setPinName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSave()}
                            autoFocus
                        />
                        <div className="pin-actions">
                            <button className="pin-save" onClick={handleSave}>Zapisz</button>
                            <button className="pin-cancel-btn" onClick={() => setModalOpen(false)}>Anuluj</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Login Modal ── */}
            {loginModalOpen && (
                <div className="login-overlay" onClick={e => e.target === e.currentTarget && setLoginModalOpen(false)}>
                    <div className="login-card">
                        <div className="login-icon">🗺️</div>
                        <h2 className="login-title">Panel admina</h2>
                        <p className="login-subtitle">Zaloguj się, aby zarządzać mapą</p>

                        {loginError && (
                            <div className="login-error">
                                <span>⚠</span> {loginError}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="login-field">
                                <label>Login</label>
                                <input
                                    placeholder="Nazwa użytkownika"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    autoComplete="username"
                                    autoFocus
                                />
                            </div>
                            <div className="login-field">
                                <label>Hasło</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="login-submit"
                                disabled={loginLoading}
                            >
                                {loginLoading ? "Logowanie…" : "Zaloguj się →"}
                            </button>
                            <button
                                type="button"
                                className="login-cancel"
                                onClick={() => { setLoginModalOpen(false); setLoginError(""); }}
                            >
                                Anuluj
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
