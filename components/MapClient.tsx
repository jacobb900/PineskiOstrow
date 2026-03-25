/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// --- KONFIGURACJA WIZUALNA ---
const CATEGORIES = [
    { id: 'all', name: 'Wszystkie', icon: '✨', color: '#6366f1' },
    { id: 'food', name: 'Jedzenie', icon: '🍽️', color: '#f59e0b' },
    { id: 'nature', name: 'Natura', icon: '🌿', color: '#10b981' },
    { id: 'monument', name: 'Zabytki', icon: '🏛️', color: '#8b5cf6' },
    { id: 'sport', name: 'Sport', icon: '🏃', color: '#3b82f6' },
];

interface Pin {
    id: string;
    latlng: [number, number];
    name: string;
    description?: string;
    category: string;
    images: string[];
}

export default function PremiumMap() {
    const [mounted, setMounted] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [pins, setPins] = useState<Pin[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');

    // --- MODALE & FORMULARZ ---
    const [modalOpen, setModalOpen] = useState(false);
    const [previewPin, setPreviewPin] = useState<Pin | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPinId, setCurrentPinId] = useState<string | null>(null);
    const [pinName, setPinName] = useState("");
    const [description, setDescription] = useState("");
    const [pinCategory, setPinCategory] = useState("food");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [tempLatLng, setTempLatLng] = useState<[number, number] | null>(null);

    // --- AUTH & SYSTEM ---
    const markersRef = useRef<Map<string, any>>(new Map());
    const [token, setToken] = useState<string | null>(null);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        setMounted(true);
        const savedToken = localStorage.getItem('token');
        if (savedToken) setToken(savedToken);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const addMarkerToMap = useCallback((pin: Pin) => {
        if (!mapInstanceRef.current || markersRef.current.has(pin.id)) return;
        const L = (window as any).L;
        if (!L) return;

        const categoryData = CATEGORIES.find(c => c.id === pin.category) || CATEGORIES[0];
        const customHtml = `
      <div class="custom-marker" style="background: ${categoryData.color}">
        <span>${categoryData.icon}</span>
        <div class="marker-pulse" style="background: ${categoryData.color}"></div>
      </div>
    `;

        const icon = L.divIcon({
            html: customHtml,
            className: '',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        const marker = L.marker(pin.latlng, { icon }).addTo(mapInstanceRef.current);
        marker.on('click', () => setPreviewPin(pin));
        markersRef.current.set(pin.id, marker);
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current) return;
        pins.forEach(pin => {
            const marker = markersRef.current.get(pin.id);
            if (marker) {
                if (activeCategory === 'all' || pin.category === activeCategory) marker.addTo(mapInstanceRef.current);
                else mapInstanceRef.current.removeLayer(marker);
            }
        });
    }, [activeCategory, pins]);

    useEffect(() => {
        if (!mounted) return;
        fetch('http://localhost:8000/api/pins/')
            .then(res => res.json())
            .then(data => {
                const loadedPins = data.map((p: any) => ({
                    id: p.id.toString(),
                    latlng: [p.latitude, p.longitude],
                    name: p.name,
                    description: p.description,
                    category: p.category || 'food',
                    images: p.images ? p.images.map((img: any) => img.image) : []
                }));
                setPins(loadedPins);
            });
    }, [mounted]);

    useEffect(() => {
        if (!mounted || mapInstanceRef.current) return;

        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => {
            const L = (window as any).L;
            const map = L.map(mapRef.current!, { center: [51.649, 17.812], zoom: 15, zoomControl: false });
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '©OpenStreetMap'
            }).addTo(map);

            mapInstanceRef.current = map;
            map.on('click', (e: any) => {
                if (!localStorage.getItem('token')) return;
                setTempLatLng([e.latlng.lat, e.latlng.lng]);
                setIsEditing(false); setPinName(""); setDescription(""); setSelectedFiles([]); setModalOpen(true);
            });
        };
        document.head.appendChild(script);

        const styleLink = document.createElement("link");
        styleLink.rel = "stylesheet"; styleLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(styleLink);
    }, [mounted]);

    useEffect(() => { if (mapInstanceRef.current) pins.forEach(pin => addMarkerToMap(pin)); }, [pins, addMarkerToMap]);

    const handleSave = async () => {
        const currentToken = localStorage.getItem('token');
        if (!pinName.trim() || !currentToken) return;
        const formData = new FormData();
        formData.append('name', pinName);
        formData.append('description', description);
        formData.append('category', pinCategory);
        selectedFiles.forEach(file => formData.append('uploaded_images', file));

        let url = 'http://localhost:8000/api/pins/';
        let method = 'POST';
        if (isEditing && currentPinId) {
            url = `http://localhost:8000/api/pins/${currentPinId}/`;
            method = 'PATCH';
        } else if (tempLatLng) {
            formData.append('latitude', tempLatLng[0].toString());
            formData.append('longitude', tempLatLng[1].toString());
        }

        try {
            const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${currentToken}` }, body: formData });
            if (res.ok) {
                const saved = await res.json();
                const updatedPin = {
                    id: saved.id.toString(), latlng: [saved.latitude, saved.longitude], name: saved.name,
                    description: saved.description, category: saved.category,
                    images: saved.images ? saved.images.map((img: any) => img.image) : []
                };
                setPins(prev => isEditing ? prev.map(p => p.id === saved.id.toString() ? updatedPin : p) : [...prev, updatedPin]);
                setModalOpen(false);
            }
        } catch (err) { console.error(err); }
    };

    if (!mounted) return null;

    return (
        <div className="master-container">
            <style>{`
        :root {
          --bg-dark: #0f172a;
          --glass: rgba(255, 255, 255, 0.85);
          --accent: #6366f1;
          --radius: 24px;
        }

        .master-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          background: var(--bg-dark);
        }

        .map-wrapper { position: absolute; inset: 0; z-index: 1; }
        #map { height: 100%; width: 100%; }

        .top-nav {
          position: absolute;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--glass);
          padding: 8px 12px;
          border-radius: 100px;
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.4);
        }

        .filter-btn {
          border: none;
          background: transparent;
          padding: 10px 20px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 14px;
          color: #475569;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-btn.active {
          background: var(--bg-dark);
          color: white;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .side-drawer {
          position: absolute;
          left: 30px;
          bottom: 30px;
          z-index: 100;
          width: 320px;
          max-height: 400px;
          background: var(--glass);
          backdrop-filter: blur(20px);
          border-radius: var(--radius);
          padding: 24px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
          border: 1px solid rgba(255,255,255,0.4);
          overflow-y: auto;
        }

        .side-drawer h3 { font-family: 'Syne'; font-size: 18px; margin-bottom: 20px; color: #1e293b; }
        .place-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 16px;
          cursor: pointer;
          transition: 0.3s;
          margin-bottom: 8px;
        }
        .place-item:hover { background: rgba(255,255,255,0.5); transform: translateX(5px); }
        .place-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; }

        .custom-marker {
          width: 40px; height: 40px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          border: 3px solid white;
        }
        .custom-marker span { transform: rotate(45deg); }
        .marker-pulse {
          position: absolute;
          width: 100%; height: 100%;
          border-radius: 50%;
          animation: pulse 2s infinite;
          opacity: 0.5;
          z-index: -1;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        .overlay {
          position: fixed; inset: 0; z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          padding: 20px;
          animation: fadeIn 0.4s ease;
        }

        .premium-card {
          background: #fff;
          border-radius: 40px;
          width: 100%;
          max-width: 550px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 50px 100px rgba(0,0,0,0.5);
          position: relative;
        }

        .gallery-container {
          height: 400px;
          overflow-y: auto;
          background: #f1f5f9;
          display: grid;
          gap: 4px;
        }
        .gallery-img { width: 100%; height: auto; object-fit: cover; }

        .content-body { padding: 40px; }
        .content-body h2 { font-family: 'Syne'; font-size: 32px; font-weight: 800; margin-bottom: 10px; }
        
        .image-upload-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 20px;
        }
        .upload-box {
          aspect-ratio: 1;
          border-radius: 20px;
          background: #f8fafc;
          border: 2.5px dashed #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 24px; color: #94a3b8; transition: 0.3s;
        }
        .upload-box:hover { border-color: var(--accent); color: var(--accent); background: #f1f5ff; }
        
        .preview-thumb {
          position: relative;
          aspect-ratio: 1;
          border-radius: 20px;
          overflow: hidden;
        }
        .preview-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .remove-thumb {
          position: absolute; top: 5px; right: 5px;
          background: rgba(239, 68, 68, 0.9);
          color: white; border: none; width: 24px; height: 24px;
          border-radius: 50%; cursor: pointer; font-size: 14px;
        }

        .action-btn {
          width: 100%;
          padding: 18px;
          border-radius: 20px;
          border: none;
          background: var(--bg-dark);
          color: white;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          margin-top: 30px;
          transition: 0.3s;
        }
        .action-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.3); }

        .auth-trigger {
          position: absolute; top: 30px; right: 30px; z-index: 100;
          background: var(--glass); backdrop-filter: blur(20px);
          padding: 12px 24px; border-radius: 100px; font-weight: 700;
          border: 1px solid rgba(255,255,255,0.4); cursor: pointer;
        }

        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>

            <button className="auth-trigger" onClick={() => token ? (localStorage.removeItem('token'), setToken(null)) : setLoginModalOpen(true)}>
                {token ? '🚪 Wyloguj' : '🔑 Panel Admina'}
            </button>

            <nav className="top-nav">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        <span>{cat.icon}</span> {cat.name}
                    </button>
                ))}
            </nav>

            <div className="map-wrapper">
                <div id="map" ref={mapRef}></div>
            </div>

            <div className="side-drawer">
                <h3>📍 Odkrywaj miejsca</h3>
                {pins.filter(p => activeCategory === 'all' || p.category === activeCategory).map(p => (
                    <div key={p.id} className="place-item" onClick={() => {
                        setPreviewPin(p);
                        mapInstanceRef.current.setView(p.latlng, 17);
                    }}>
                        <div className="place-icon" style={{ background: (CATEGORIES.find(c => c.id === p.category)?.color || '#6366f1') + '22' }}>
                            {CATEGORIES.find(c => c.id === p.category)?.icon}
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '14px' }}>{p.name}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>{p.category}</div>
                        </div>
                    </div>
                ))}
            </div>

            {previewPin && (
                <div className="overlay" onClick={() => setPreviewPin(null)}>
                    <div className="premium-card" onClick={e => e.stopPropagation()}>
                        <div className="gallery-container">
                            {previewPin.images.map((img, idx) => (
                                <img key={idx} src={img} className="gallery-img" alt="location" />
                            ))}
                            {previewPin.images.length === 0 && <div style={{ padding: '100px', textAlign: 'center', color: '#94a3b8' }}>Brak zdjęć</div>}
                        </div>
                        <div className="content-body">
                            <span style={{ color: 'var(--accent)', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {previewPin.category}
                            </span>
                            <h2>{previewPin.name}</h2>
                            <p style={{ color: '#475569', lineHeight: '1.8' }}>{previewPin.description || "Brak szczegółowego opisu dla tego miejsca."}</p>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="action-btn" onClick={() => setPreviewPin(null)}>Zamknij podgląd</button>
                                {token && (
                                    <button className="action-btn" style={{ background: '#ef4444' }} onClick={() => {
                                        if(confirm("Usunąć?")) {
                                            // Funkcja usuwania
                                        }
                                    }}>Usuń</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {modalOpen && (
                <div className="overlay">
                    <div className="premium-card" style={{ padding: '40px' }}>
                        <h2 style={{ fontFamily: 'Syne', marginBottom: '30px' }}>Dodaj nowe miejsce</h2>

                        <input className="input-field" style={{ width: '100%', marginBottom: '15px', padding: '15px', borderRadius: '15px', border: '1px solid #eee' }}
                               placeholder="Nazwa miejsca..." value={pinName} onChange={e => setPinName(e.target.value)} />

                        <select className="input-field" style={{ width: '100%', marginBottom: '15px', padding: '15px', borderRadius: '15px', border: '1px solid #eee' }}
                                value={pinCategory} onChange={e => setPinCategory(e.target.value)}>
                            {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                        </select>

                        <textarea className="input-field" style={{ width: '100%', marginBottom: '15px', padding: '15px', borderRadius: '15px', border: '1px solid #eee', minHeight: '100px' }}
                                  placeholder="Opis lokalizacji..." value={description} onChange={e => setDescription(e.target.value)} />

                        <div style={{ fontWeight: 800, fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>ZDJĘCIA</div>
                        <div className="image-upload-grid">
                            {selectedFiles.map((file, idx) => (
                                <div key={idx} className="preview-thumb">
                                    <img src={URL.createObjectURL(file)} alt="thumb" />
                                    <button className="remove-thumb" onClick={() => removeFile(idx)}>×</button>
                                </div>
                            ))}
                            <label className="upload-box">
                                +
                                <input type="file" multiple hidden onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>

                        <button className="action-btn" onClick={handleSave}>Zapisz na mapie</button>
                        <button style={{ width: '100%', background: 'none', border: 'none', color: '#94a3b8', marginTop: '15px', cursor: 'pointer' }} onClick={() => setModalOpen(false)}>Anuluj</button>
                    </div>
                </div>
            )}

            {loginModalOpen && (
                <div className="overlay">
                    <div className="premium-card" style={{ padding: '40px', maxWidth: '400px' }}>
                        <h2 style={{ fontFamily: 'Syne', textAlign: 'center', marginBottom: '30px' }}>Panel Admina</h2>
                        <input className="input-field" style={{ width: '100%', marginBottom: '15px', padding: '15px', borderRadius: '15px', border: '1px solid #eee' }}
                               placeholder="Użytkownik" value={username} onChange={e => setUsername(e.target.value)} />
                        <input className="input-field" type="password" style={{ width: '100%', marginBottom: '15px', padding: '15px', borderRadius: '15px', border: '1px solid #eee' }}
                               placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} />
                        <button className="action-btn">Zaloguj się</button>
                        <button style={{ width: '100%', background: 'none', border: 'none', color: '#94a3b8', marginTop: '15px', cursor: 'pointer' }} onClick={() => setLoginModalOpen(false)}>Zamknij</button>
                    </div>
                </div>
            )}
        </div>
    );
}