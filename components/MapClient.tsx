/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Pin {
  id: string;
  latlng: [number, number];
  name: string;
}

export default function MapClient() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pinName, setPinName] = useState("");
  const [tempLatLng, setTempLatLng] = useState<[number, number] | null>(null);
  const [showPinList, setShowPinList] = useState(false);
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

      const bounds = L.latLngBounds(L.latLng(51.60, 17.70), L.latLng(51.70, 17.90));

      const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors', maxZoom: 20, maxNativeZoom: 19
      });

      const satelliteImg = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles © Esri', maxZoom: 20, maxNativeZoom: 18 }
      );

      const labels = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
        { attribution: '© CartoDB', maxZoom: 20, pane: 'shadowPane' }
      );

      const satelliteHybrid = L.layerGroup([satelliteImg, labels]);

      const map = L.map(mapRef.current, {
        center: [51.655, 17.807],
        zoom: 14,
        minZoom: 12,
        maxZoom: 20,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        layers: [osm],
        tap: true,
        tapTolerance: 15,
      });

      mapInstanceRef.current = map;

      const ostrowBoundary = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[
            [17.771, 51.688], [17.792, 51.697], [17.832, 51.699], [17.864, 51.685],
            [17.876, 51.666], [17.884, 51.641], [17.873, 51.618], [17.846, 51.604],
            [17.808, 51.601], [17.771, 51.607], [17.744, 51.632], [17.737, 51.661],
            [17.771, 51.688]
          ]]
        }
      };

      L.geoJSON(ostrowBoundary, {
        style: { color: "#4a7c59", weight: 2, fillOpacity: 0.04, dashArray: '6, 10' },
        interactive: false
      }).addTo(map);

      L.control.layers({ "Mapa Standardowa": osm, "Satelita z nazwami": satelliteHybrid }).addTo(map);

      map.on('click', (e: any) => {
        setTempLatLng([e.latlng.lat, e.latlng.lng]);
        setModalOpen(true);
        setPinName("");
      });
    };

    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const addMarkerToMap = useCallback((pin: Pin) => {
    if (!mapInstanceRef.current) return;
    const L = (window as any).L;

    const marker = L.marker([pin.latlng[0], pin.latlng[1]]).addTo(mapInstanceRef.current);

    const container = document.createElement("div");
    container.innerHTML = `
      <div style="padding: 14px 16px; border-bottom: 1px solid #e8e4de;">
        <div style="font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: #1a1a2e; word-break: break-word;">${pin.name}</div>
        <div style="font-size: 11px; color: #aaa; margin-top: 2px;">${pin.latlng[0].toFixed(5)}, ${pin.latlng[1].toFixed(5)}</div>
      </div>
      <div style="padding: 10px 16px;">
        <button data-id="${pin.id}" class="remove-btn" style="
          display:flex; align-items:center; gap:6px; background:#fdf0ef;
          color:#c0392b; border:1px solid #f5c6c2; padding:8px 12px;
          border-radius:8px; cursor:pointer; font-size:13px; font-family:'DM Sans',sans-serif;
          font-weight:500; width:100%; justify-content:center; min-height:36px;
        ">✕ Usuń pineskę</button>
      </div>
    `;

    container.querySelector(".remove-btn")?.addEventListener("click", (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id!;
      removePin(id);
    });

    marker.bindPopup(container, { maxWidth: 240 }).openPopup();
    markersRef.current.set(pin.id, marker);
  }, [removePin]);

  const handleSave = () => {
    if (!pinName.trim() || !tempLatLng) return;
    const newPin: Pin = { id: Date.now().toString(), latlng: tempLatLng, name: pinName.trim() };
    setPins(prev => [...prev, newPin]);
    setModalOpen(false);
    setTimeout(() => addMarkerToMap(newPin), 50);
  };

  const pinCount = pins.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        html, body { margin: 0; padding: 0; overflow-x: hidden; }

        /* Make map fill viewport on mobile */
        .map-wrapper {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--border);
          box-shadow: 0 8px 32px var(--shadow);
        }

        @media (max-width: 640px) {
          .map-wrapper {
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
          .map-outer {
            padding: 0 !important;
          }
        }

        /* Bottom sheet */
        .pin-sheet {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-radius: 20px 20px 0 0;
          box-shadow: 0 -8px 40px rgba(26,26,46,0.18);
          z-index: 500;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
          max-height: 60vh;
          display: flex;
          flex-direction: column;
        }
        .pin-sheet.open {
          transform: translateY(0);
        }
        .pin-sheet-handle {
          width: 36px; height: 4px;
          background: #ddd;
          border-radius: 2px;
          margin: 12px auto 0;
          flex-shrink: 0;
        }
        .pin-sheet-content {
          overflow-y: auto;
          flex: 1;
          padding: 0 16px 32px;
          -webkit-overflow-scrolling: touch;
        }

        /* Modal bottom sheet on mobile */
        @media (max-width: 640px) {
          .modal-box {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            border-radius: 20px 20px 0 0 !important;
            padding: 24px 20px 40px !important;
            transform: none !important;
            max-width: 100% !important;
          }
          .modal-overlay {
            align-items: flex-end !important;
          }
        }

        /* Touch-friendly controls */
        .leaflet-control-zoom a {
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
        }

        /* Fab button */
        .fab {
          position: fixed;
          bottom: 24px;
          right: 20px;
          z-index: 400;
          background: var(--moss);
          color: white;
          border: none;
          border-radius: 50%;
          width: 56px;
          height: 56px;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(74,124,89,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s, box-shadow 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .fab:active { transform: scale(0.93); }
        .fab-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #e74c3c;
          color: white;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          font-family: 'DM Sans', sans-serif;
          border: 2px solid white;
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <header style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          background: "rgba(250,248,245,0.97)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "17px",
              letterSpacing: "-0.02em",
              margin: 0,
              color: "var(--ink)",
              lineHeight: 1.2,
            }}>
              Mapa Ostrowa Wlkp.
            </h1>
            <span style={{ fontSize: "11px", color: "#aaa", fontStyle: "italic", fontFamily: "'DM Sans', sans-serif" }}>
              interaktywna
            </span>
          </div>
          {pinCount > 0 && (
            <button
              onClick={() => setShowPinList(true)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "var(--moss)", color: "white",
                padding: "7px 14px", borderRadius: "20px",
                fontSize: "13px", fontWeight: 500,
                border: "none", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              📍 {pinCount} {pinCount === 1 ? "pineska" : pinCount < 5 ? "pineski" : "pinesek"}
            </button>
          )}
        </header>

        {/* Tip bar */}
        <div style={{
          background: "#eef6f0", borderBottom: "1px solid #c8e6d0",
          padding: "8px 20px", display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span style={{ fontSize: "14px" }}>👆</span>
          <span style={{ fontSize: "12px", color: "#3d6b4a", fontFamily: "'DM Sans', sans-serif" }}>
            Dotknij mapę, aby dodać pineskę
          </span>
        </div>

        {/* Map */}
        <main className="map-outer" style={{ padding: "16px", flex: 1 }}>
          <div className="map-wrapper">
            <div
              ref={mapRef}
              style={{
                height: "calc(100vh - 130px)",
                minHeight: "400px",
                width: "100%",
              }}
            />
          </div>
        </main>
      </div>

      {/* FAB – show pin list */}
      {pinCount > 0 && (
        <button className="fab" onClick={() => setShowPinList(true)} aria-label="Twoje pineski">
          📍
          <span className="fab-badge">{pinCount}</span>
        </button>
      )}

      {/* Bottom sheet – pin list */}
      <div className={`pin-sheet${showPinList ? " open" : ""}`}>
        <div className="pin-sheet-handle" />
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 16px 8px",
          flexShrink: 0,
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            fontSize: "16px", margin: 0, color: "var(--ink)",
          }}>Twoje miejsca ({pinCount})</h2>
          <button
            onClick={() => setShowPinList(false)}
            style={{
              background: "#f0ede8", border: "none", borderRadius: "50%",
              width: "32px", height: "32px", cursor: "pointer",
              fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#666",
            }}
          >×</button>
        </div>
        <div className="pin-sheet-content">
          {pins.map(pin => (
            <div key={pin.id} style={{
              display: "flex", alignItems: "center", gap: "12px",
              background: "white", border: "1px solid var(--border)",
              borderRadius: "14px", padding: "12px 14px",
              marginBottom: "10px",
              boxShadow: "0 2px 8px var(--shadow)",
            }}>
              <span style={{ fontSize: "20px", flexShrink: 0 }}>📍</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 600, fontSize: "14px",
                  fontFamily: "'Syne', sans-serif",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{pin.name}</div>
                <div style={{ fontSize: "11px", color: "#bbb", marginTop: "2px", fontFamily: "'DM Sans', sans-serif" }}>
                  {pin.latlng[0].toFixed(4)}, {pin.latlng[1].toFixed(4)}
                </div>
              </div>
              <button
                onClick={() => removePin(pin.id)}
                style={{
                  background: "#fdf0ef", border: "1px solid #f5c6c2",
                  color: "#c0392b", borderRadius: "10px",
                  width: "36px", height: "36px",
                  cursor: "pointer", fontSize: "16px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay for bottom sheet */}
      {showPinList && (
        <div
          onClick={() => setShowPinList(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(26,26,46,0.3)",
            zIndex: 499,
          }}
        />
      )}

      {/* Add pin modal */}
      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(26,26,46,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="modal-box"
            style={{
              background: "white", borderRadius: "20px",
              padding: "28px 24px", width: "min(360px, 92vw)",
              boxShadow: "0 24px 80px rgba(26,26,46,0.3)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <span style={{ fontSize: "22px" }}>📍</span>
              <h3 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                fontSize: "18px", margin: 0, color: "var(--ink)",
              }}>Nowe miejsce</h3>
            </div>
            <p style={{ fontSize: "13px", color: "#999", margin: "0 0 18px", paddingLeft: "32px", fontFamily: "'DM Sans', sans-serif" }}>
              Nadaj nazwę tej lokalizacji
            </p>
            <input
              autoFocus
              type="text"
              value={pinName}
              onChange={e => setPinName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setModalOpen(false); }}
              placeholder="np. Moja ulubiona lodziarnia…"
              style={{
                width: "100%", padding: "13px 16px",
                border: "1.5px solid var(--border)", borderRadius: "12px",
                fontSize: "16px", // 16px avoids iOS zoom
                fontFamily: "'DM Sans', sans-serif",
                outline: "none", background: "var(--cream)", color: "var(--ink)",
                WebkitAppearance: "none",
              }}
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  flex: 1, padding: "14px", border: "1.5px solid var(--border)",
                  borderRadius: "12px", background: "white", cursor: "pointer",
                  fontSize: "15px", fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500, color: "#666",
                  minHeight: "50px",
                }}
              >Anuluj</button>
              <button
                onClick={handleSave}
                disabled={!pinName.trim()}
                style={{
                  flex: 2, padding: "14px", border: "none", borderRadius: "12px",
                  background: pinName.trim() ? "var(--moss)" : "#ccc",
                  cursor: pinName.trim() ? "pointer" : "not-allowed",
                  fontSize: "15px", fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600, color: "white",
                  minHeight: "50px",
                }}
              >Zapisz miejsce</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
