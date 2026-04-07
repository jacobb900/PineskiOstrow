/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const API_BASE = "http://localhost:8000";

const CATEGORIES = [
  { id: "all",      name: "Wszystkie", icon: "✨", color: "#6366f1" },
  { id: "food",     name: "Jedzenie",  icon: "🍽️", color: "#f59e0b" },
  { id: "nature",   name: "Natura",    icon: "🌿", color: "#10b981" },
  { id: "monument", name: "Zabytki",   icon: "🏛️", color: "#8b5cf6" },
  { id: "sport",    name: "Sport",     icon: "🏃", color: "#3b82f6" },
];

interface PinImage { id: number; image: string; }

interface Pin {
  id: string;
  latlng: [number, number];
  name: string;
  description?: string;
  address?: string;
  category: string;
  mount_date?: string;   // "YYYY-MM-DD"
  direction?: string;    // N/NE/E/SE/S/SW/W/NW
  images: PinImage[];
}

const DIRECTIONS = [
  { id: "N",  label: "Północ",            symbol: "↑" },
  { id: "NE", label: "Północny-wschód",   symbol: "↗" },
  { id: "E",  label: "Wschód",            symbol: "→" },
  { id: "SE", label: "Południowy-wschód", symbol: "↘" },
  { id: "S",  label: "Południe",          symbol: "↓" },
  { id: "SW", label: "Południowy-zachód", symbol: "↙" },
  { id: "W",  label: "Zachód",            symbol: "←" },
  { id: "NW", label: "Północny-zachód",   symbol: "↖" },
];

// Oblicza dni naświetlania od daty montażu
function exposureDays(mountDate?: string): number | null {
  if (!mountDate) return null;
  const start = new Date(mountDate).getTime();
  const now   = Date.now();
  return Math.max(0, Math.floor((now - start) / 86400000));
}

// Zwraca kąt obrotu strzałki kompasu w stopniach
function directionDeg(dir?: string): number {
  const map: Record<string, number> = {
    N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315,
  };
  return dir ? (map[dir] ?? 0) : 0;
}

type ToastType = "success" | "error" | "info";
interface Toast { id: number; msg: string; type: ToastType; }

// ---------- helpers ----------
function resolveImage(url: string): string {
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
}

function mapPin(p: any): Pin {
  return {
    id: p.id.toString(),
    latlng: [p.latitude, p.longitude] as [number, number],
    name: p.name,
    description: p.description ?? "",
    address: p.address ?? "",
    category: p.category || "food",
    mount_date: p.mount_date ?? undefined,
    direction:  p.direction  ?? undefined,
    images: (p.images ?? []).map((img: any) => ({
      id: img.id,
      image: resolveImage(img.image),
    })),
  };
}

// ---------- component ----------
export default function MapClient() {
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const tokenRef = useRef<string | null>(null);

  const [pins, setPins] = useState<Pin[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");

  // modals
  const [previewPin, setPreviewPin] = useState<Pin | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // gallery lightbox
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentPinId, setCurrentPinId] = useState<string | null>(null);
  const [tempLatLng, setTempLatLng] = useState<[number, number] | null>(null);
  const [pinName, setPinName] = useState("");
  const [pinAddress, setPinAddress] = useState("");
  const [description, setDescription] = useState("");
  const [pinCategory, setPinCategory] = useState("food");
  const [pinMountDate, setPinMountDate] = useState("");
  const [pinDirection, setPinDirection] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // auth
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounter = useRef(0);

  const addToast = useCallback((msg: string, type: ToastType = "success") => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  // ---------- mount ----------
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("token");
    if (saved) { setToken(saved); tokenRef.current = saved; }
  }, []);

  useEffect(() => { tokenRef.current = token; }, [token]);

  // ---------- cleanup preview URLs ----------
  useEffect(() => {
    return () => { previewUrls.forEach((u) => URL.revokeObjectURL(u)); };
  }, [previewUrls]);

  // ---------- file handling ----------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const newUrls = newFiles.map((f) => URL.createObjectURL(f));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newUrls]);
    e.target.value = "";
  };

  const removeFile = (idx: number) => {
    URL.revokeObjectURL(previewUrls[idx]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  // ---------- marker helpers ----------
  const removeMarker = useCallback((pinId: string) => {
    const marker = markersRef.current.get(pinId);
    if (marker && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(marker);
      markersRef.current.delete(pinId);
    }
  }, []);

  const addMarkerToMap = useCallback(
    (pin: Pin) => {
      if (!mapInstanceRef.current) return;
      const L = (window as any).L;
      if (!L) return;

      // remove stale marker first (important for updates)
      removeMarker(pin.id);

      const cat = CATEGORIES.find((c) => c.id === pin.category) || CATEGORIES[1];
      const icon = L.divIcon({
        html: `<div class="custom-marker" style="background:${cat.color}">
                 <span>${cat.icon}</span>
                 <div class="marker-pulse" style="background:${cat.color}"></div>
               </div>`,
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      const marker = L.marker(pin.latlng, { icon }).addTo(mapInstanceRef.current);
      marker.on("click", () => {
        setPins((prev) => {
          const fresh = prev.find((p) => p.id === pin.id);
          if (fresh) setPreviewPin(fresh);
          return prev;
        });
      });
      markersRef.current.set(pin.id, marker);
    },
    [removeMarker]
  );

  // ---------- load pins ----------
  useEffect(() => {
    if (!mounted) return;
    fetch(`${API_BASE}/api/pins/`)
      .then((r) => r.json())
      .then((data: any[]) => setPins(data.map(mapPin)))
      .catch(() => addToast("Nie udało się pobrać pinezek.", "error"));
  }, [mounted, addToast]);

  // ---------- init map ----------
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
        zoom: 15,
        zoomControl: false,
      });
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { attribution: "©OpenStreetMap ©CartoDB" }
      ).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstanceRef.current = map;

      map.on("click", (e: any) => {
        if (!tokenRef.current) {
          addToast("Zaloguj się, aby dodawać miejsca.", "info");
          return;
        }
        setTempLatLng([e.latlng.lat, e.latlng.lng]);
        setIsEditing(false);
        setCurrentPinId(null);
        setPinName("");
        setPinAddress("");
        setDescription("");
        setPinCategory("food");
        setPinMountDate("");
        setPinDirection("");
        setSelectedFiles([]);
        setPreviewUrls([]);
        setFormOpen(true);
      });
    };
    document.head.appendChild(script);
  }, [mounted, addToast]);

  // ---------- sync markers ----------
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    pins.forEach((pin) => addMarkerToMap(pin));
  }, [pins, addMarkerToMap]);

  // ---------- filter visibility ----------
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    pins.forEach((pin) => {
      const marker = markersRef.current.get(pin.id);
      if (!marker) return;
      const visible = activeCategory === "all" || pin.category === activeCategory;
      if (visible) marker.addTo(mapInstanceRef.current);
      else mapInstanceRef.current.removeLayer(marker);
    });
  }, [activeCategory, pins]);

  // ---------- auth ----------
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return;
    setLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access);
        setToken(data.access);
        setLoginOpen(false);
        setUsername("");
        setPassword("");
        addToast("Zalogowano pomyślnie! 🎉");
      } else {
        addToast("Błędny login lub hasło.", "error");
      }
    } catch {
      addToast("Błąd połączenia z serwerem.", "error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    tokenRef.current = null;
    addToast("Wylogowano.");
  };

  // ---------- delete ----------
  const handleDelete = async (pinId: string) => {
    const tok = tokenRef.current;
    if (!tok) return;
    try {
      const res = await fetch(`${API_BASE}/api/pins/${pinId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (res.ok) {
        removeMarker(pinId);
        setPins((prev) => prev.filter((p) => p.id !== pinId));
        setPreviewPin(null);
        addToast("Miejsce usunięte.");
      } else {
        addToast("Nie udało się usunąć.", "error");
      }
    } catch {
      addToast("Błąd połączenia z serwerem.", "error");
    }
  };

  // ---------- open edit form ----------
  const openEditForm = (pin: Pin) => {
    setIsEditing(true);
    setCurrentPinId(pin.id);
    setTempLatLng(pin.latlng);
    setPinName(pin.name);
    setPinAddress(pin.address ?? "");
    setDescription(pin.description ?? "");
    setPinCategory(pin.category);
    setPinMountDate(pin.mount_date ?? "");
    setPinDirection(pin.direction ?? "");
    setSelectedFiles([]);
    setPreviewUrls([]);
    setPreviewPin(null);
    setFormOpen(true);
  };

  // ---------- save ----------
  const handleSave = async () => {
    const tok = tokenRef.current;
    if (!pinName.trim() || !tok) return;
    setSaving(true);

    const formData = new FormData();
    formData.append("name", pinName);
    formData.append("address", pinAddress);
    formData.append("description", description);
    formData.append("category", pinCategory);
    if (pinMountDate) formData.append("mount_date", pinMountDate);
    if (pinDirection)  formData.append("direction",  pinDirection);
    selectedFiles.forEach((f) => formData.append("uploaded_images", f));

    let url = `${API_BASE}/api/pins/`;
    let method = "POST";

    if (isEditing && currentPinId) {
      url = `${API_BASE}/api/pins/${currentPinId}/`;
      method = "PATCH";
    } else if (tempLatLng) {
      formData.append("latitude", tempLatLng[0].toString());
      formData.append("longitude", tempLatLng[1].toString());
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${tok}` },
        body: formData,
      });
      if (res.ok) {
        const saved = await res.json();
        const updatedPin = mapPin(saved);
        setPins((prev) =>
          isEditing
            ? prev.map((p) => (p.id === updatedPin.id ? updatedPin : p))
            : [...prev, updatedPin]
        );
        addMarkerToMap(updatedPin);
        setFormOpen(false);
        addToast(isEditing ? "Miejsce zaktualizowane! ✏️" : "Miejsce dodane! 📍");
      } else {
        addToast("Błąd zapisu. Sprawdź dane.", "error");
      }
    } catch {
      addToast("Błąd połączenia z serwerem.", "error");
    } finally {
      setSaving(false);
    }
  };

  const visiblePins = pins.filter(
    (p) => activeCategory === "all" || p.category === activeCategory
  );

  if (!mounted) return null;

  return (
    <div className="mc-root">
      <style>{CSS}</style>

      {/* ── MAP ── */}
      <div className="mc-map">
        <div id="map" ref={mapRef} style={{ height: "100%", width: "100%" }} />
      </div>

      {/* ── AUTH BUTTON ── */}
      <button
        className="mc-auth-btn"
        onClick={() => (token ? handleLogout() : setLoginOpen(true))}
      >
        {token ? "🚪 Wyloguj" : "🔑 Panel Admina"}
      </button>

      {/* ── CATEGORY FILTER ── */}
      <nav className="mc-nav">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`mc-filter-btn${activeCategory === cat.id ? " active" : ""}`}
            style={
              activeCategory === cat.id
                ? ({ "--active-color": cat.color } as React.CSSProperties)
                : {}
            }
            onClick={() => setActiveCategory(cat.id)}
          >
            <span className="mc-filter-icon">{cat.icon}</span>
            <span className="mc-filter-label">{cat.name}</span>
          </button>
        ))}
      </nav>

      {/* ── SIDE DRAWER ── */}
      <aside className="mc-drawer">
        <div className="mc-drawer-header">
          <span>📍</span>
          <span>Odkrywaj miejsca</span>
          <span className="mc-badge">{visiblePins.length}</span>
        </div>
        <div className="mc-drawer-list">
          {visiblePins.length === 0 && (
            <p className="mc-empty">Brak miejsc w tej kategorii</p>
          )}
          {visiblePins.map((p) => {
            const cat = CATEGORIES.find((c) => c.id === p.category) || CATEGORIES[1];
            return (
              <div
                key={p.id}
                className="mc-place-item"
                onClick={() => {
                  setPreviewPin(p);
                  mapInstanceRef.current?.setView(p.latlng, 17, { animate: true });
                }}
              >
                <div className="mc-place-icon" style={{ background: cat.color + "22" }}>
                  {cat.icon}
                </div>
                <div className="mc-place-info">
                  <div className="mc-place-name">{p.name}</div>
                  {p.address && <div className="mc-place-addr">{p.address}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── PREVIEW MODAL ── */}
      {previewPin && (
        <div className="mc-overlay" onClick={() => setPreviewPin(null)}>
          <div className="mc-card" onClick={(e) => e.stopPropagation()}>
            {/* Gallery */}
            <div className="mc-gallery">
              {previewPin.images.length > 0 ? (
                <>
                  <img
                    src={previewPin.images[lightboxIdx ?? 0]?.image}
                    className="mc-gallery-main"
                    alt="Zdjęcie główne"
                    onClick={() => setLightboxIdx(lightboxIdx ?? 0)}
                  />
                  {previewPin.images.length > 1 && (
                    <div className="mc-gallery-thumbs">
                      {previewPin.images.map((img, idx) => (
                        <img
                          key={img.id}
                          src={img.image}
                          className={`mc-thumb${(lightboxIdx ?? 0) === idx ? " active" : ""}`}
                          alt="Miniatura"
                          onClick={() => setLightboxIdx(idx)}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="mc-gallery-empty">
                  <span>📷</span>
                  <span>Brak zdjęć</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mc-card-body">
              <div className="mc-card-meta">
                <span
                  className="mc-cat-badge"
                  style={{
                    background:
                      (CATEGORIES.find((c) => c.id === previewPin.category)?.color ??
                        "#6366f1") + "1a",
                    color:
                      CATEGORIES.find((c) => c.id === previewPin.category)?.color ??
                      "#6366f1",
                  }}
                >
                  {CATEGORIES.find((c) => c.id === previewPin.category)?.icon}{" "}
                  {CATEGORIES.find((c) => c.id === previewPin.category)?.name}
                </span>
                <button className="mc-close-x" onClick={() => setPreviewPin(null)}>
                  ✕
                </button>
              </div>
              <h2 className="mc-card-title">{previewPin.name}</h2>
              {previewPin.address && (
                <p className="mc-card-addr">📍 {previewPin.address}</p>
              )}
              <p className="mc-card-desc">
                {previewPin.description || "Brak opisu dla tego miejsca."}
              </p>

              {/* ── LICZNIK NAŚWIETLANIA ── */}
              {previewPin.mount_date && (() => {
                const days = exposureDays(previewPin.mount_date)!;
                const target = 180; // zakładany czas naświetlania w dniach
                const pct = Math.min(100, Math.round((days / target) * 100));
                return (
                  <div className="mc-exposure">
                    <div className="mc-exposure-header">
                      <span>☀️ Naświetlanie</span>
                      <span className="mc-exposure-days">{days} dni</span>
                    </div>
                    <div className="mc-exposure-bar">
                      <div
                        className="mc-exposure-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="mc-exposure-meta">
                      <span>Montaż: {new Date(previewPin.mount_date).toLocaleDateString("pl-PL")}</span>
                      <span>{pct}% z {target} dni</span>
                    </div>
                  </div>
                );
              })()}

              {/* ── KOMPAS KIERUNKU ── */}
              {previewPin.direction && (
                <div className="mc-compass-row">
                  <div className="mc-compass">
                    <div
                      className="mc-compass-arrow"
                      style={{ transform: `rotate(${directionDeg(previewPin.direction)}deg)` }}
                    >↑</div>
                    <div className="mc-compass-ring">
                      {["N","E","S","W"].map(d => (
                        <span key={d} className={`mc-compass-label mc-compass-${d}`}>{d}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mc-compass-info">
                    <div className="mc-compass-title">Kierunek puszki</div>
                    <div className="mc-compass-value">
                      {DIRECTIONS.find(d => d.id === previewPin.direction)?.label ?? previewPin.direction}
                      {" "}{DIRECTIONS.find(d => d.id === previewPin.direction)?.symbol}
                    </div>
                  </div>
                </div>
              )}

              <div className="mc-card-actions">
                {token && (
                  <>
                    <button
                      className="mc-btn mc-btn-edit"
                      onClick={() => openEditForm(previewPin)}
                    >
                      ✏️ Edytuj
                    </button>
                    <button
                      className="mc-btn mc-btn-danger"
                      onClick={() => {
                        if (confirm(`Usunąć "${previewPin.name}"?`))
                          handleDelete(previewPin.id);
                      }}
                    >
                      🗑️ Usuń
                    </button>
                  </>
                )}
                <button
                  className="mc-btn mc-btn-close"
                  onClick={() => setPreviewPin(null)}
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FORM MODAL ── */}
      {formOpen && (
        <div className="mc-overlay" onClick={() => setFormOpen(false)}>
          <div
            className="mc-card mc-form-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mc-form-header">
              <h2>{isEditing ? "✏️ Edytuj miejsce" : "📍 Dodaj nowe miejsce"}</h2>
              <button className="mc-close-x" onClick={() => setFormOpen(false)}>
                ✕
              </button>
            </div>

            <div className="mc-form-body">
              <label className="mc-label">Nazwa miejsca *</label>
              <input
                className="mc-input"
                placeholder="np. Restauracja Pod Lipami"
                value={pinName}
                onChange={(e) => setPinName(e.target.value)}
              />

              <label className="mc-label">Adres</label>
              <input
                className="mc-input"
                placeholder="np. ul. Raszkowska 12"
                value={pinAddress}
                onChange={(e) => setPinAddress(e.target.value)}
              />

              <label className="mc-label">Kategoria</label>
              <div className="mc-cat-grid">
                {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                  <button
                    key={c.id}
                    className={`mc-cat-option${pinCategory === c.id ? " selected" : ""}`}
                    style={
                      pinCategory === c.id
                        ? { background: c.color, color: "#fff", borderColor: c.color }
                        : {}
                    }
                    onClick={() => setPinCategory(c.id)}
                  >
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>

              <label className="mc-label">Opis historyczny</label>
              <textarea
                className="mc-input mc-textarea"
                placeholder="Krótki opis tego miejsca..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label className="mc-label">Data montażu puszki</label>
              <input
                type="date"
                className="mc-input"
                value={pinMountDate}
                onChange={(e) => setPinMountDate(e.target.value)}
              />

              <label className="mc-label">Kierunek świata (gdzie patrzy puszka)</label>
              <div className="mc-dir-grid">
                {DIRECTIONS.map((d) => (
                  <button
                    key={d.id}
                    className={`mc-dir-btn${pinDirection === d.id ? " selected" : ""}`}
                    onClick={() => setPinDirection(pinDirection === d.id ? "" : d.id)}
                    title={d.label}
                  >
                    <span className="mc-dir-symbol">{d.symbol}</span>
                    <span className="mc-dir-id">{d.id}</span>
                  </button>
                ))}
              </div>

              <label className="mc-label">Zdjęcia</label>
              <div className="mc-img-grid">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="mc-img-thumb">
                    <img src={url} alt="Podgląd" />
                    <button className="mc-img-remove" onClick={() => removeFile(idx)}>
                      ✕
                    </button>
                  </div>
                ))}
                <label className="mc-img-add">
                  <span>+</span>
                  <input
                    type="file"
                    multiple
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            <div className="mc-form-footer">
              <button
                className="mc-btn mc-btn-primary"
                onClick={handleSave}
                disabled={saving || !pinName.trim()}
              >
                {saving ? "Zapisywanie…" : isEditing ? "Zaktualizuj" : "Zapisz na mapie"}
              </button>
              <button
                className="mc-btn mc-btn-ghost"
                onClick={() => setFormOpen(false)}
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGIN MODAL ── */}
      {loginOpen && (
        <div className="mc-overlay" onClick={() => setLoginOpen(false)}>
          <div
            className="mc-card mc-login-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mc-form-header">
              <h2>🔑 Panel Admina</h2>
              <button className="mc-close-x" onClick={() => setLoginOpen(false)}>
                ✕
              </button>
            </div>
            <div className="mc-form-body">
              <label className="mc-label">Użytkownik</label>
              <input
                className="mc-input"
                placeholder="login"
                value={username}
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <label className="mc-label">Hasło</label>
              <input
                className="mc-input"
                type="password"
                placeholder="••••••••"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div className="mc-form-footer">
              <button
                className="mc-btn mc-btn-primary"
                onClick={handleLogin}
                disabled={loginLoading}
              >
                {loginLoading ? "Logowanie…" : "Zaloguj się"}
              </button>
              <button
                className="mc-btn mc-btn-ghost"
                onClick={() => setLoginOpen(false)}
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOASTS ── */}
      <div className="mc-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`mc-toast mc-toast-${t.type}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CSS (inline, scoped with mc- prefix)
// ─────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;700&display=swap');

.mc-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
  background: #0f172a;
}

/* MAP */
.mc-map { position: absolute; inset: 0; z-index: 1; }

/* MARKERS */
.custom-marker {
  width: 38px; height: 38px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 17px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.35);
  border: 3px solid #fff;
  position: relative;
}
.custom-marker span { transform: rotate(45deg); display: block; }
.marker-pulse {
  position: absolute; width: 100%; height: 100%;
  border-radius: 50%; opacity: 0.4;
  animation: mc-pulse 2s ease-out infinite;
  z-index: -1;
}
@keyframes mc-pulse {
  0%   { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(2.8); opacity: 0; }
}

/* AUTH BUTTON */
.mc-auth-btn {
  position: absolute; top: 24px; right: 24px; z-index: 100;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.5);
  padding: 10px 20px; border-radius: 100px;
  font-family: 'DM Sans'; font-weight: 700; font-size: 13px;
  color: #1e293b; cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  transition: transform 0.2s, box-shadow 0.2s;
}
.mc-auth-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.18); }

/* CATEGORY NAV */
.mc-nav {
  position: absolute; top: 24px; left: 50%; transform: translateX(-50%);
  z-index: 100;
  display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(16px);
  padding: 6px 10px; border-radius: 100px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  border: 1px solid rgba(255,255,255,0.5);
  max-width: calc(100vw - 220px);
}
.mc-filter-btn {
  border: none; background: transparent;
  padding: 8px 16px; border-radius: 100px;
  font-family: 'DM Sans'; font-weight: 700; font-size: 13px;
  color: #475569; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  transition: all 0.25s ease;
  white-space: nowrap;
}
.mc-filter-btn.active {
  background: var(--active-color, #6366f1);
  color: #fff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.2);
}
.mc-filter-btn:not(.active):hover { background: rgba(0,0,0,0.06); }
.mc-filter-icon { font-size: 15px; }

/* SIDE DRAWER */
.mc-drawer {
  position: absolute; left: 24px; bottom: 24px; z-index: 100;
  width: 300px; max-height: calc(100vh - 120px);
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(16px);
  border-radius: 24px; border: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  display: flex; flex-direction: column; overflow: hidden;
}
.mc-drawer-header {
  display: flex; align-items: center; gap: 8px;
  padding: 20px 20px 14px;
  font-family: 'Syne'; font-weight: 800; font-size: 16px; color: #1e293b;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  flex-shrink: 0;
}
.mc-badge {
  margin-left: auto;
  background: #6366f1; color: #fff;
  font-family: 'DM Sans'; font-size: 11px; font-weight: 700;
  padding: 2px 8px; border-radius: 100px;
}
.mc-drawer-list { overflow-y: auto; padding: 10px 12px 16px; flex: 1; }
.mc-empty { color: #94a3b8; font-size: 13px; text-align: center; padding: 20px 0; }
.mc-place-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 10px; border-radius: 14px;
  cursor: pointer; transition: all 0.2s;
}
.mc-place-item:hover { background: rgba(99,102,241,0.07); transform: translateX(4px); }
.mc-place-icon {
  width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.mc-place-name { font-weight: 700; font-size: 13px; color: #1e293b; }
.mc-place-addr { font-size: 11px; color: #64748b; margin-top: 1px; }

/* OVERLAY */
.mc-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(15,23,42,0.75);
  backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  animation: mc-fadein 0.3s ease;
}
@keyframes mc-fadein {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* CARD */
.mc-card {
  background: #fff; border-radius: 32px;
  width: 100%; max-width: 520px;
  max-height: 92vh; overflow: hidden;
  box-shadow: 0 40px 80px rgba(0,0,0,0.4);
  display: flex; flex-direction: column;
  animation: mc-slideup 0.35s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes mc-slideup {
  from { transform: translateY(30px) scale(0.97); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}

/* PREVIEW GALLERY */
.mc-gallery {
  flex-shrink: 0; background: #f8fafc;
  max-height: 300px; overflow: hidden;
  display: flex; flex-direction: column;
}
.mc-gallery-main {
  width: 100%; object-fit: cover; flex: 1;
  max-height: 240px; display: block;
}
.mc-gallery-thumbs {
  display: flex; gap: 4px; padding: 6px;
  overflow-x: auto; background: #f1f5f9;
  flex-shrink: 0;
}
.mc-thumb {
  width: 52px; height: 52px; object-fit: cover;
  border-radius: 8px; cursor: pointer; flex-shrink: 0;
  border: 2px solid transparent; transition: border-color 0.2s;
}
.mc-thumb.active { border-color: #6366f1; }
.mc-gallery-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 8px;
  height: 140px; color: #94a3b8; font-size: 14px;
}
.mc-gallery-empty span:first-child { font-size: 36px; }

/* CARD BODY */
.mc-card-body { padding: 28px 32px; overflow-y: auto; flex: 1; }
.mc-card-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.mc-cat-badge {
  font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px;
  padding: 4px 12px; border-radius: 100px;
}
.mc-close-x {
  background: #f1f5f9; border: none;
  width: 30px; height: 30px; border-radius: 50%;
  cursor: pointer; font-size: 13px; color: #64748b;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.mc-close-x:hover { background: #e2e8f0; color: #1e293b; }
.mc-card-title { font-family: 'Syne'; font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
.mc-card-addr { font-size: 13px; color: #64748b; margin: 0 0 14px; }
.mc-card-desc { font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 24px; }
.mc-card-actions { display: flex; gap: 8px; flex-wrap: wrap; }

/* BUTTONS */
.mc-btn {
  padding: 11px 20px; border-radius: 14px; border: none;
  font-family: 'DM Sans'; font-weight: 700; font-size: 14px;
  cursor: pointer; transition: all 0.2s;
}
.mc-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.mc-btn-primary {
  background: #0f172a; color: #fff; flex: 1;
}
.mc-btn-primary:not(:disabled):hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
.mc-btn-edit { background: #6366f1; color: #fff; }
.mc-btn-edit:hover { background: #4f46e5; }
.mc-btn-danger { background: #ef4444; color: #fff; }
.mc-btn-danger:hover { background: #dc2626; }
.mc-btn-close { background: #f1f5f9; color: #475569; }
.mc-btn-close:hover { background: #e2e8f0; }
.mc-btn-ghost {
  background: transparent; color: #94a3b8;
  width: 100%; margin-top: 4px;
}
.mc-btn-ghost:hover { color: #475569; }

/* FORM CARD */
.mc-form-card { max-width: 540px; }
.mc-login-card { max-width: 380px; }
.mc-form-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 28px 32px 0;
  flex-shrink: 0;
}
.mc-form-header h2 { font-family: 'Syne'; font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; }
.mc-form-body { padding: 20px 32px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 6px; }
.mc-form-footer { padding: 16px 32px 28px; display: flex; flex-direction: column; gap: 0; flex-shrink: 0; }
.mc-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; margin-top: 10px; }
.mc-input {
  width: 100%; padding: 13px 16px; border-radius: 14px;
  border: 2px solid #e2e8f0; font-family: 'DM Sans'; font-size: 14px; color: #1e293b;
  outline: none; transition: border-color 0.2s; background: #f8fafc; box-sizing: border-box;
}
.mc-input:focus { border-color: #6366f1; background: #fff; }
.mc-textarea { min-height: 90px; resize: vertical; }

/* CATEGORY GRID IN FORM */
.mc-cat-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
.mc-cat-option {
  padding: 8px 14px; border-radius: 100px;
  border: 2px solid #e2e8f0; background: #f8fafc;
  font-family: 'DM Sans'; font-size: 13px; font-weight: 700; color: #475569;
  cursor: pointer; transition: all 0.2s;
}
.mc-cat-option:hover { border-color: #cbd5e1; }

/* IMAGE UPLOAD GRID */
.mc-img-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 4px; }
.mc-img-thumb {
  position: relative; aspect-ratio: 1;
  border-radius: 14px; overflow: hidden;
}
.mc-img-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.mc-img-remove {
  position: absolute; top: 4px; right: 4px;
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(239,68,68,0.9); color: #fff;
  border: none; cursor: pointer; font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.mc-img-add {
  aspect-ratio: 1; border-radius: 14px;
  border: 2px dashed #cbd5e1; background: #f8fafc;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; color: #94a3b8; cursor: pointer;
  transition: all 0.2s;
}
.mc-img-add:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }

/* TOASTS */
.mc-toasts {
  position: fixed; bottom: 24px; right: 24px; z-index: 9999;
  display: flex; flex-direction: column; gap: 8px; align-items: flex-end;
}
.mc-toast {
  padding: 12px 20px; border-radius: 14px;
  font-family: 'DM Sans'; font-size: 14px; font-weight: 600;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  animation: mc-toastin 0.3s ease, mc-toastout 0.3s ease 3.2s forwards;
  max-width: 280px;
}
.mc-toast-success { background: #0f172a; color: #fff; }
.mc-toast-error   { background: #ef4444; color: #fff; }
.mc-toast-info    { background: #6366f1; color: #fff; }
@keyframes mc-toastin  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes mc-toastout { from { opacity: 1; } to { opacity: 0; transform: translateY(6px); } }

/* EXPOSURE COUNTER */
.mc-exposure {
  background: linear-gradient(135deg, #fff7ed, #fef3c7);
  border: 1px solid #fcd34d;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}
.mc-exposure-header {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 13px; font-weight: 700; color: #92400e; margin-bottom: 10px;
}
.mc-exposure-days {
  background: #f59e0b; color: #fff;
  padding: 3px 10px; border-radius: 100px; font-size: 12px;
}
.mc-exposure-bar {
  height: 8px; background: #fde68a; border-radius: 100px; overflow: hidden; margin-bottom: 6px;
}
.mc-exposure-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #ef4444);
  border-radius: 100px;
  transition: width 0.6s ease;
}
.mc-exposure-meta {
  display: flex; justify-content: space-between;
  font-size: 11px; color: #b45309;
}

/* COMPASS */
.mc-compass-row {
  display: flex; align-items: center; gap: 20px;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  border-radius: 16px; padding: 16px; margin-bottom: 16px;
}
.mc-compass {
  position: relative; width: 72px; height: 72px; flex-shrink: 0;
}
.mc-compass-ring {
  position: absolute; inset: 0;
  border: 2px solid #86efac; border-radius: 50%;
}
.mc-compass-label {
  position: absolute; font-size: 10px; font-weight: 800; color: #166534;
}
.mc-compass-N  { top: -1px;  left: 50%; transform: translateX(-50%); }
.mc-compass-S  { bottom: -1px; left: 50%; transform: translateX(-50%); }
.mc-compass-E  { right: 2px; top: 50%; transform: translateY(-50%); }
.mc-compass-W  { left: 2px;  top: 50%; transform: translateY(-50%); }
.mc-compass-arrow {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; color: #16a34a; font-weight: 900;
  transition: transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
}
.mc-compass-info { flex: 1; }
.mc-compass-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #86efac; margin-bottom: 4px; }
.mc-compass-value { font-size: 16px; font-weight: 800; color: #166534; }

/* DIRECTION GRID IN FORM */
.mc-dir-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 4px;
}
.mc-dir-btn {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 10px 4px; border-radius: 12px;
  border: 2px solid #e2e8f0; background: #f8fafc;
  cursor: pointer; transition: all 0.2s;
}
.mc-dir-btn:hover { border-color: #10b981; }
.mc-dir-btn.selected { background: #10b981; border-color: #10b981; color: #fff; }
.mc-dir-symbol { font-size: 18px; line-height: 1; }
.mc-dir-id { font-size: 11px; font-weight: 800; }


.mc-drawer-list::-webkit-scrollbar,
.mc-form-body::-webkit-scrollbar,
.mc-card-body::-webkit-scrollbar { width: 4px; }
.mc-drawer-list::-webkit-scrollbar-thumb,
.mc-form-body::-webkit-scrollbar-thumb,
.mc-card-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

/* RESPONSIVE */
@media (max-width: 640px) {
  .mc-nav { max-width: calc(100vw - 48px); top: 16px; }
  .mc-auth-btn { top: 16px; right: 16px; font-size: 12px; padding: 8px 14px; }
  .mc-drawer { width: calc(100vw - 32px); left: 16px; bottom: 16px; max-height: 220px; }
  .mc-filter-label { display: none; }
  .mc-filter-btn { padding: 8px 10px; }
  .mc-card { border-radius: 24px; }
  .mc-card-body { padding: 20px 20px; }
  .mc-form-header { padding: 20px 20px 0; }
  .mc-form-body { padding: 16px 20px; }
  .mc-form-footer { padding: 12px 20px 20px; }
  .mc-img-grid { grid-template-columns: repeat(3, 1fr); }
}
`;