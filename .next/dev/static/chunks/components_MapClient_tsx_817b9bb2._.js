(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/MapClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
/* eslint-disable @typescript-eslint/no-explicit-any */ "use client";
;
function MapClient() {
    _s();
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mapInstanceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [pins, setPins] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pinName, setPinName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tempLatLng, setTempLatLng] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tableSearch, setTableSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const markersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    // --- STANY DLA LOGOWANIA (ZABEZPIECZONE) ---
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loginModalOpen, setLoginModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // KROK 1: Bezpieczne sprawdzenie tokena tylko po stronie klienta
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapClient.useEffect": ()=>{
            const savedToken = localStorage.getItem('token');
            if (savedToken) setToken(savedToken);
        }
    }["MapClient.useEffect"], []);
    // POBIERANIE Z BAZY PRZY STARCIE
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapClient.useEffect": ()=>{
            fetch('http://localhost:8000/api/pins/').then({
                "MapClient.useEffect": (res)=>res.json()
            }["MapClient.useEffect"]).then({
                "MapClient.useEffect": (data)=>{
                    const loadedPins = data.map({
                        "MapClient.useEffect.loadedPins": (p)=>({
                                id: p.id.toString(),
                                latlng: [
                                    p.latitude,
                                    p.longitude
                                ],
                                name: p.name,
                                address: p.address
                            })
                    }["MapClient.useEffect.loadedPins"]);
                    setPins(loadedPins);
                    loadedPins.forEach({
                        "MapClient.useEffect": (pin)=>addMarkerToMap(pin)
                    }["MapClient.useEffect"]);
                }
            }["MapClient.useEffect"]).catch({
                "MapClient.useEffect": (err)=>console.error("Błąd pobierania z bazy:", err)
            }["MapClient.useEffect"]);
        }
    }["MapClient.useEffect"], []);
    const handleLogin = async (e)=>{
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.access);
                setToken(data.access);
                setLoginModalOpen(false);
                alert("Zalogowano jako admin!");
            } else {
                alert("Błędny login lub hasło");
            }
        } catch (err) {
            console.error("Błąd logowania:", err);
        }
    };
    const handleLogout = ()=>{
        localStorage.removeItem('token');
        setToken(null);
        alert("Wylogowano");
    };
    const removePin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MapClient.useCallback[removePin]": async (id)=>{
            // Pobierz token bezpośrednio z localStorage na wypadek odświeżenia
            const currentToken = localStorage.getItem('token');
            if (!currentToken) {
                alert("Tylko admin może usuwać pineski!");
                return;
            }
            try {
                const res = await fetch(`http://localhost:8000/api/pins/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${currentToken}`
                    }
                });
                if (res.ok) {
                    const marker = markersRef.current.get(id);
                    if (mapInstanceRef.current && marker) {
                        mapInstanceRef.current.removeLayer(marker);
                        markersRef.current.delete(id);
                    }
                    setPins({
                        "MapClient.useCallback[removePin]": (prev)=>prev.filter({
                                "MapClient.useCallback[removePin]": (p)=>p.id !== id
                            }["MapClient.useCallback[removePin]"])
                    }["MapClient.useCallback[removePin]"]);
                } else {
                    alert("Błąd uprawnień lub sesja wygasła.");
                }
            } catch (err) {
                console.error("Błąd usuwania:", err);
            }
        }
    }["MapClient.useCallback[removePin]"], []);
    const addMarkerToMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MapClient.useCallback[addMarkerToMap]": (pin)=>{
            if (!mapInstanceRef.current || markersRef.current.has(pin.id)) return;
            const L = window.L;
            if (!L) return;
            const redIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [
                    35,
                    56
                ],
                iconAnchor: [
                    17,
                    56
                ],
                popupAnchor: [
                    1,
                    -45
                ],
                shadowSize: [
                    51,
                    51
                ]
            });
            const marker = L.marker(pin.latlng, {
                icon: redIcon
            }).addTo(mapInstanceRef.current);
            const popupContent = document.createElement('div');
            popupContent.innerHTML = `
          <div style="font-family: sans-serif; min-width: 150px;">
            <b style="font-size: 14px;">${pin.address || "Brak adresu"}</b><br/>
            <span style="color: #666;">${pin.name}</span><br/>
            <button id="btn-del-${pin.id}" style="margin-top: 10px; background: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; width: 100%;">Usuń pineskę</button>
          </div>
        `;
            marker.bindPopup(popupContent);
            marker.on('popupopen', {
                "MapClient.useCallback[addMarkerToMap]": ()=>{
                    const btn = document.getElementById(`btn-del-${pin.id}`);
                    if (btn) {
                        btn.onclick = ({
                            "MapClient.useCallback[addMarkerToMap]": ()=>removePin(pin.id)
                        })["MapClient.useCallback[addMarkerToMap]"];
                    }
                }
            }["MapClient.useCallback[addMarkerToMap]"]);
            markersRef.current.set(pin.id, marker);
        }
    }["MapClient.useCallback[addMarkerToMap]"], [
        removePin
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapClient.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") === "undefined" || mapInstanceRef.current) return;
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
            const script = document.createElement("script");
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.onload = ({
                "MapClient.useEffect": ()=>{
                    const L = window.L;
                    if (!L) return;
                    const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                        maxZoom: 20,
                        subdomains: [
                            'mt0',
                            'mt1',
                            'mt2',
                            'mt3'
                        ]
                    });
                    const map = L.map(mapRef.current, {
                        center: [
                            51.649,
                            17.812
                        ],
                        zoom: 17,
                        layers: [
                            googleHybrid
                        ],
                        zoomControl: false
                    });
                    L.control.zoom({
                        position: 'bottomright'
                    }).addTo(map);
                    mapInstanceRef.current = map;
                    pins.forEach({
                        "MapClient.useEffect": (pin)=>addMarkerToMap(pin)
                    }["MapClient.useEffect"]);
                    map.on('click', {
                        "MapClient.useEffect": (e)=>{
                            setTempLatLng([
                                e.latlng.lat,
                                e.latlng.lng
                            ]);
                            setModalOpen(true);
                            setPinName("");
                        }
                    }["MapClient.useEffect"]);
                }
            })["MapClient.useEffect"];
            document.head.appendChild(script);
        }
    }["MapClient.useEffect"], [
        pins,
        addMarkerToMap
    ]);
    const handleSearch = async (e)=>{
        e.preventDefault();
        if (!searchQuery.trim() || !mapInstanceRef.current) return;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", Ostrów Wielkopolski")}&limit=1`);
            const data = await res.json();
            if (data && data.length > 0) {
                const coords = [
                    parseFloat(data[0].lat),
                    parseFloat(data[0].lon)
                ];
                mapInstanceRef.current.flyTo(coords, 18);
                setTempLatLng(coords);
                setPinName(searchQuery);
                setModalOpen(true);
            }
        } catch (err) {
            console.error(err);
        }
    };
    const handleSave = async ()=>{
        const currentToken = localStorage.getItem('token');
        if (!pinName.trim() || !tempLatLng) return;
        if (!currentToken) {
            alert("Musisz być zalogowany jako admin, aby dodać pineskę!");
            setModalOpen(false);
            setLoginModalOpen(true);
            return;
        }
        const pinData = {
            name: pinName.trim(),
            address: `Współrzędne: ${tempLatLng[0].toFixed(4)}, ${tempLatLng[1].toFixed(4)}`,
            latitude: tempLatLng[0],
            longitude: tempLatLng[1]
        };
        try {
            const response = await fetch('http://localhost:8000/api/pins/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                },
                body: JSON.stringify(pinData)
            });
            if (response.ok) {
                const savedPin = await response.json();
                const newPin = {
                    id: savedPin.id.toString(),
                    latlng: [
                        savedPin.latitude,
                        savedPin.longitude
                    ],
                    name: savedPin.name,
                    address: savedPin.address
                };
                setPins((prev)=>[
                        ...prev,
                        newPin
                    ]);
                setModalOpen(false);
                addMarkerToMap(newPin);
            } else {
                alert("Błąd zapisu. Zaloguj się ponownie.");
                handleLogout();
            }
        } catch (err) {
            alert("Błąd połączenia z serwerem.");
        }
    };
    const filteredPins = pins.filter((pin)=>pin.name.toLowerCase().includes(tableSearch.toLowerCase()) || pin.address && pin.address.toLowerCase().includes(tableSearch.toLowerCase()));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;700&display=swap');
                body { margin: 0; font-family: 'DM Sans', sans-serif; background: #faf8f5; color: #1a1a2e; }
                .search-box { position: absolute; top: 20px; left: 20px; z-index: 1100; width: 320px; background: white; border-radius: 12px; display: flex; align-items: center; padding: 2px 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.25); border: 1px solid #ddd; }
                .search-input { flex: 1; border: none; padding: 12px 0; font-size: 15px; outline: none; background: transparent; }
                .table-search { width: 100%; padding: 10px 15px; border-radius: 10px; border: 1px solid #ddd; margin-bottom: 15px; font-size: 14px; outline: none; box-sizing: border-box; }
                .admin-btn { position: absolute; top: 20px; right: 20px; z-index: 1100; padding: 12px 20px; border-radius: 12px; border: none; cursor: pointer; font-weight: bold; transition: 0.3s; }
            `
            }, void 0, false, {
                fileName: "[project]/components/MapClient.tsx",
                lineNumber: 249,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    padding: '10px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "admin-btn",
                        onClick: ()=>token ? handleLogout() : setLoginModalOpen(true),
                        style: {
                            background: token ? '#4CAF50' : '#333',
                            color: 'white'
                        },
                        children: token ? 'Wyloguj Admina' : 'Zaloguj Admina'
                    }, void 0, false, {
                        fileName: "[project]/components/MapClient.tsx",
                        lineNumber: 259,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        style: {
                            paddingBottom: '10px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            style: {
                                fontFamily: 'Syne',
                                fontSize: '22px',
                                margin: 0
                            },
                            children: "Mapa Ostrowa Wlkp."
                        }, void 0, false, {
                            fileName: "[project]/components/MapClient.tsx",
                            lineNumber: 268,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/MapClient.tsx",
                        lineNumber: 267,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            borderRadius: '24px',
                            overflow: 'hidden',
                            position: 'relative',
                            border: '1px solid #e2e8f0'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                className: "search-box",
                                onSubmit: handleSearch,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            marginRight: '10px'
                                        },
                                        children: "🔍"
                                    }, void 0, false, {
                                        fileName: "[project]/components/MapClient.tsx",
                                        lineNumber: 273,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "search-input",
                                        placeholder: "Wyszukaj na mapie...",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/components/MapClient.tsx",
                                        lineNumber: 274,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/MapClient.tsx",
                                lineNumber: 272,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: mapRef,
                                style: {
                                    height: '100%',
                                    width: '100%'
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/MapClient.tsx",
                                lineNumber: 276,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MapClient.tsx",
                        lineNumber: 271,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: '20px',
                            padding: '20px',
                            border: '1px solid #ccc',
                            borderRadius: '16px',
                            backgroundColor: '#fff',
                            maxHeight: '35vh',
                            overflowY: 'auto'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    margin: "0 0 10px",
                                    fontFamily: 'Syne'
                                },
                                children: [
                                    "Twoje zapisane adresy: (",
                                    pins.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/MapClient.tsx",
                                lineNumber: 280,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "table-search",
                                placeholder: "Filtruj listę...",
                                value: tableSearch,
                                onChange: (e)=>setTableSearch(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/MapClient.tsx",
                                lineNumber: 281,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                style: {
                                    listStyleType: 'none',
                                    padding: 0
                                },
                                children: filteredPins.map((pin)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        style: {
                                            padding: '12px 0',
                                            borderBottom: '1px solid #eee',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: pin.address
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/MapClient.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 38
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                        fileName: "[project]/components/MapClient.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 68
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                        children: pin.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/MapClient.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 73
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/MapClient.tsx",
                                                lineNumber: 285,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    gap: '8px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>mapInstanceRef.current?.flyTo(pin.latlng, 18),
                                                        style: {
                                                            background: '#eee',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            padding: '8px'
                                                        },
                                                        children: "👁️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/MapClient.tsx",
                                                        lineNumber: 287,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>removePin(pin.id),
                                                        style: {
                                                            background: '#ff4d4d',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            padding: '8px'
                                                        },
                                                        children: "Usuń"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/MapClient.tsx",
                                                        lineNumber: 288,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/MapClient.tsx",
                                                lineNumber: 286,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, pin.id, true, {
                                        fileName: "[project]/components/MapClient.tsx",
                                        lineNumber: 284,
                                        columnNumber: 29
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/MapClient.tsx",
                                lineNumber: 282,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MapClient.tsx",
                        lineNumber: 279,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MapClient.tsx",
                lineNumber: 258,
                columnNumber: 13
            }, this),
            modalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: '#fff',
                        padding: '30px',
                        borderRadius: '24px',
                        width: '320px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                margin: '0 0 15px'
                            },
                            children: "Zapisz to miejsce"
                        }, void 0, false, {
                            fileName: "[project]/components/MapClient.tsx",
                            lineNumber: 299,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            autoFocus: true,
                            value: pinName,
                            onChange: (e)=>setPinName(e.target.value),
                            style: {
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                border: '1px solid #ddd'
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/MapClient.tsx",
                            lineNumber: 300,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: '10px',
                                marginTop: '20px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setModalOpen(false),
                                    style: {
                                        flex: 1,
                                        padding: '10px'
                                    },
                                    children: "Anuluj"
                                }, void 0, false, {
                                    fileName: "[project]/components/MapClient.tsx",
                                    lineNumber: 302,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSave,
                                    style: {
                                        flex: 1,
                                        padding: '10px',
                                        background: '#ff4d4d',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '12px'
                                    },
                                    children: "Zapisz"
                                }, void 0, false, {
                                    fileName: "[project]/components/MapClient.tsx",
                                    lineNumber: 303,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/MapClient.tsx",
                            lineNumber: 301,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/MapClient.tsx",
                    lineNumber: 298,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/MapClient.tsx",
                lineNumber: 297,
                columnNumber: 17
            }, this),
            loginModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 20000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleLogin,
                    style: {
                        background: '#fff',
                        padding: '30px',
                        borderRadius: '24px',
                        width: '320px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                marginBottom: '20px'
                            },
                            children: "Logowanie Admina"
                        }, void 0, false, {
                            fileName: "[project]/components/MapClient.tsx",
                            lineNumber: 312,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            placeholder: "Login",
                            value: username,
                            onChange: (e)=>setUsername(e.target.value),
                            style: {
                                width: '100%',
                                padding: '12px',
                                marginBottom: '10px'
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/MapClient.tsx",
                            lineNumber: 313,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "password",
                            placeholder: "Hasło",
                            value: password,
                            onChange: (e)=>setPassword(e.target.value),
                            style: {
                                width: '100%',
                                padding: '12px',
                                marginBottom: '20px'
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/MapClient.tsx",
                            lineNumber: 314,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: '10px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setLoginModalOpen(false),
                                    style: {
                                        flex: 1
                                    },
                                    children: "Anuluj"
                                }, void 0, false, {
                                    fileName: "[project]/components/MapClient.tsx",
                                    lineNumber: 316,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    style: {
                                        flex: 1,
                                        background: '#000',
                                        color: '#fff'
                                    },
                                    children: "Zaloguj"
                                }, void 0, false, {
                                    fileName: "[project]/components/MapClient.tsx",
                                    lineNumber: 317,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/MapClient.tsx",
                            lineNumber: 315,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/MapClient.tsx",
                    lineNumber: 311,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/MapClient.tsx",
                lineNumber: 310,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true);
}
_s(MapClient, "qfUKW9ArWk3Na/fxog8C7gqdJz0=");
_c = MapClient;
var _c;
__turbopack_context__.k.register(_c, "MapClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/MapClient.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/MapClient.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_MapClient_tsx_817b9bb2._.js.map