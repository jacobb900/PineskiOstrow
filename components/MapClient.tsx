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
    const [searchQuery, setSearchQuery] = useState("");
    const [tableSearch, setTableSearch] = useState("");
    const markersRef = useRef<Map<string, any>>(new Map());

    const [token, setToken] = useState<string | null>(null);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // 1. Zabezpieczenie przed błędem 500 (SSR)
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
          <div style="font-family: sans-serif; min-width: 150px;">
            <b style="font-size: 14px;">${pin.address || "Brak adresu"}</b><br/>
            <span style="color: #666;">${pin.name}</span><br/>
            <button id="btn-del-${pin.id}" style="margin-top: 10px; background: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; width: 100%;">Usuń pineskę</button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
            const btn = document.getElementById(`btn-del-${pin.id}`);
            if (btn) btn.onclick = () => removePin(pin.id);
        });

        markersRef.current.set(pin.id, marker);
    }, []);

    // 2. Pobieranie pinesek (tylko raz po zamontowaniu)
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

    // 3. Usuwanie pineski
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
            } else { alert("Błędne dane"); }
        } catch (err) { console.error(err); }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    // 4. Inicjalizacja Mapy
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
                subdomains:['mt0','mt1','mt2','mt3']
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

    // 5. Dodawanie markerów do mapy kiedy zmieni się lista pins
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
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;700&display=swap');
                body { margin: 0; font-family: 'DM Sans', sans-serif; background: #faf8f5; }
                .search-box { position: absolute; top: 20px; left: 20px; z-index: 1100; width: 320px; background: white; border-radius: 12px; padding: 5px 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); border: 1px solid #ddd; }
                .admin-btn { position: absolute; top: 20px; right: 20px; z-index: 1100; padding: 12px 20px; border-radius: 12px; border: none; cursor: pointer; color: white; font-weight: bold; }
            `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '10px' }}>
                <button className="admin-btn" onClick={() => token ? handleLogout() : setLoginModalOpen(true)} style={{ background: token ? '#4CAF50' : '#333' }}>
                    {token ? 'Wyloguj Admina' : 'Zaloguj Admina'}
                </button>
                <div style={{ flex: 1, borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
                    <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
                </div>
                <div style={{ marginTop: '10px', padding: '15px', background: 'white', borderRadius: '15px', maxHeight: '30vh', overflowY: 'auto' }}>
                    <h3>Zapisane miejsca ({pins.length}):</h3>
                    {pins.map(p => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                            <span>{p.name}</span>
                            <button onClick={() => removePin(p.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Usuń</button>
                        </div>
                    ))}
                </div>
            </div>

            {modalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '15px' }}>
                        <input placeholder="Nazwa miejsca" value={pinName} onChange={e => setPinName(e.target.value)} style={{ padding: '10px', width: '200px' }} />
                        <button onClick={handleSave}>Zapisz</button>
                        <button onClick={() => setModalOpen(false)}>Anuluj</button>
                    </div>
                </div>
            )}

            {loginModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <form onSubmit={handleLogin} style={{ background: 'white', padding: '20px', borderRadius: '15px' }}>
                        <input placeholder="Login" value={username} onChange={e => setUsername(e.target.value)} style={{ display: 'block', marginBottom: '10px' }} />
                        <input type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} style={{ display: 'block', marginBottom: '10px' }} />
                        <button type="submit">Zaloguj</button>
                        <button type="button" onClick={() => setLoginModalOpen(false)}>Anuluj</button>
                    </form>
                </div>
            )}
        </>
    );
}