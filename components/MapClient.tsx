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
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [pins, setPins] = useState<Pin[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [pinName, setPinName] = useState("");
    const [tempLatLng, setTempLatLng] = useState<[number, number] | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [tableSearch, setTableSearch] = useState("");
    const markersRef = useRef<Map<string, any>>(new Map());

    const removePin = useCallback((id: string) => {
        const marker = markersRef.current.get(id);
        if (mapInstanceRef.current && marker) {
            mapInstanceRef.current.removeLayer(marker);
            markersRef.current.delete(id);
        }
        setPins(prev => prev.filter(p => p.id !== id));
    }, []);

    useEffect(() => {
        if (typeof window === "undefined" || mapInstanceRef.current) return;

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => {
            const L = (window as any).L;

            const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains:['mt0','mt1','mt2','mt3']
            });

            const map = L.map(mapRef.current!, {
                center: [51.649, 17.812],
                zoom: 17,
                layers: [googleHybrid],
                zoomControl: false,
            });

            L.control.zoom({ position: 'bottomright' }).addTo(map);
            mapInstanceRef.current = map;

            map.on('click', (e: any) => {
                setTempLatLng([e.latlng.lat, e.latlng.lng]);
                setModalOpen(true);
                setPinName("");
            });
        };
        document.head.appendChild(script);
    }, []);

    // FUNKCJA DODAJĄCA WIĘKSZĄ, CZERWONĄ PINESKĘ
    const addMarkerToMap = useCallback((pin: Pin) => {
        if (!mapInstanceRef.current) return;
        const L = (window as any).L;

        // Tworzymy własną ikonę: większą (40x65px zamiast 25x41px) i czerwoną
        const redIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [35, 56], // Rozmiar pineski (znacznie większa)
            iconAnchor: [17, 56], // Punkt styku z mapą
            popupAnchor: [1, -45], // Miejsce, gdzie wyskakuje okienko
            shadowSize: [51, 51]
        });

        const marker = L.marker(pin.latlng, { icon: redIcon }).addTo(mapInstanceRef.current);

        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
          <div style="font-family: sans-serif; min-width: 150px;">
            <b style="font-size: 14px;">${pin.address}</b><br/>
            <span style="color: #666;">${pin.name}</span><br/>
            <button id="btn-del-${pin.id}" style="margin-top: 10px; background: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; width: 100%;">Usuń pineskę</button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
            document.getElementById(`btn-del-${pin.id}`)?.addEventListener('click', () => {
                removePin(pin.id);
            });
        });

        markersRef.current.set(pin.id, marker);
    }, [removePin]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim() || !mapInstanceRef.current) return;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", Ostrów Wielkopolski")}&limit=1`);
            const data = await res.json();
            if (data && data.length > 0) {
                const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                mapInstanceRef.current.flyTo(coords, 18);
                setTempLatLng(coords);
                setPinName(searchQuery);
                setModalOpen(true);
            }
        } catch (err) { console.error(err); }
    };

    const handleSave = async () => {
        if (!pinName.trim() || !tempLatLng) return;
        let finalAddress = "Pobieranie...";
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${tempLatLng[0]}&lon=${tempLatLng[1]}&addressdetails=1`);
            const data = await res.json();
            const a = data.address;
            finalAddress = (a.road || a.pedestrian || a.suburb || "Ostrów") + (a.house_number ? ` ${a.house_number}` : "");
        } catch (e) { finalAddress = "Nieznany adres"; }

        const newPin: Pin = { id: Date.now().toString(), latlng: tempLatLng, name: pinName.trim(), address: finalAddress };
        setPins(prev => [...prev, newPin]);
        setModalOpen(false);
        addMarkerToMap(newPin);
        setSearchQuery("");
    };

    const filteredPins = pins.filter(pin =>
        pin.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        pin.address?.toLowerCase().includes(tableSearch.toLowerCase())
    );

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;700&display=swap');
                body { margin: 0; font-family: 'DM Sans', sans-serif; background: #faf8f5; color: #1a1a2e; }
                .search-box { position: absolute; top: 20px; left: 20px; z-index: 1100; width: 320px; background: white; border-radius: 12px; display: flex; align-items: center; padding: 2px 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.25); border: 1px solid #ddd; }
                .search-input { flex: 1; border: none; padding: 12px 0; font-size: 15px; outline: none; background: transparent; }
                .table-search { width: 100%; padding: 10px 15px; border-radius: 10px; border: 1px solid #ddd; margin-bottom: 15px; font-size: 14px; outline: none; box-sizing: border-box; }
            `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '10px' }}>
                <header style={{ paddingBottom: '10px' }}>
                    <h1 style={{ fontFamily: 'Syne', fontSize: '22px', margin: 0 }}>Mapa Ostrowa Wlkp.</h1>
                </header>

                <div style={{ flex: 1, borderRadius: '24px', overflow: 'hidden', position: 'relative', border: '1px solid #e2e8f0' }}>
                    <form className="search-box" onSubmit={handleSearch}>
                        <span style={{ marginRight: '10px' }}>🔍</span>
                        <input className="search-input" type="text" placeholder="Wyszukaj na mapie..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </form>
                    <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
                </div>

                <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '16px', backgroundColor: '#fff', maxHeight: '35vh', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontFamily: 'Syne' }}>Twoje zapisane adresy:</h3>
                        <span style={{ fontSize: '12px', background: '#ff4d4d', color: 'white', padding: '4px 10px', borderRadius: '20px' }}>{pins.length} pinesek</span>
                    </div>

                    <input className="table-search" type="text" placeholder="Filtruj listę..." value={tableSearch} onChange={(e) => setTableSearch(e.target.value)} />

                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {filteredPins.length === 0 ? (
                            <li style={{ color: '#888', textAlign: 'center', padding: '20px' }}>Brak zapisanych miejsc.</li>
                        ) : (
                            filteredPins.map((pin) => (
                                <li key={pin.id} style={{ padding: '12px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <strong style={{ fontSize: '16px', display: 'block' }}>{pin.address}</strong>
                                        <span style={{ fontSize: '13px', color: '#666' }}>{pin.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => mapInstanceRef.current?.flyTo(pin.latlng, 18)} style={{ background: '#eee', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}>👁️</button>
                                        <button onClick={() => removePin(pin.id)} style={{ background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 15px', cursor: 'pointer' }}>Usuń</button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            {modalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '24px', width: '90%', maxWidth: '380px' }}>
                        <h3 style={{ fontFamily: 'Syne', margin: '0 0 15px' }}>Zapisz to miejsce</h3>
                        <input autoFocus value={pinName} onChange={e => setPinName(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #ddd' }} />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                            <button onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd' }}>Anuluj</button>
                            <button onClick={handleSave} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#ff4d4d', color: '#fff' }}>Zapisz</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}