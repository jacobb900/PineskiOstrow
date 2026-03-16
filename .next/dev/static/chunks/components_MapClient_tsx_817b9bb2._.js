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
    const removePin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MapClient.useCallback[removePin]": (id)=>{
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
        }
    }["MapClient.useCallback[removePin]"], []);
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
    }["MapClient.useEffect"], []);
    // FUNKCJA DODAJĄCA WIĘKSZĄ, CZERWONĄ PINESKĘ
    const addMarkerToMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MapClient.useCallback[addMarkerToMap]": (pin)=>{
            if (!mapInstanceRef.current) return;
            const L = window.L;
            // Tworzymy własną ikonę: większą (40x65px zamiast 25x41px) i czerwoną
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
            <b style="font-size: 14px;">${pin.address}</b><br/>
            <span style="color: #666;">${pin.name}</span><br/>
            <button id="btn-del-${pin.id}" style="margin-top: 10px; background: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; width: 100%;">Usuń pineskę</button>
          </div>
        `;
            marker.bindPopup(popupContent);
            marker.on('popupopen', {
                "MapClient.useCallback[addMarkerToMap]": ()=>{
                    document.getElementById(`btn-del-${pin.id}`)?.addEventListener('click', {
                        "MapClient.useCallback[addMarkerToMap]": ()=>{
                            removePin(pin.id);
                        }
                    }["MapClient.useCallback[addMarkerToMap]"]);
                }
            }["MapClient.useCallback[addMarkerToMap]"]);
            markersRef.current.set(pin.id, marker);
        }
    }["MapClient.useCallback[addMarkerToMap]"], [
        removePin
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
        if (!pinName.trim() || !tempLatLng) return;
        let finalAddress = "Pobieranie...";
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${tempLatLng[0]}&lon=${tempLatLng[1]}&addressdetails=1`);
            const data = await res.json();
            const a = data.address;
            finalAddress = (a.road || a.pedestrian || a.suburb || "Ostrów") + (a.house_number ? ` ${a.house_number}` : "");
        } catch (e) {
            finalAddress = "Nieznany adres";
        }
        const newPin = {
            id: Date.now().toString(),
            latlng: tempLatLng,
            name: pinName.trim(),
            address: finalAddress
        };
        setPins((prev)=>[
                ...prev,
                newPin
            ]);
        setModalOpen(false);
        addMarkerToMap(newPin);
        setSearchQuery("");
    };
    const filteredPins = pins.filter((pin)=>pin.name.toLowerCase().includes(tableSearch.toLowerCase()) || pin.address?.toLowerCase().includes(tableSearch.toLowerCase()));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;700&display=swap');
                body { margin: 0; font-family: 'DM Sans', sans-serif; background: #faf8f5; color: #1a1a2e; }
                .search-box { position: absolute; top: 20px; left: 20px; z-index: 1100; width: 320px; background: white; border-radius: 12px; display: flex; align-items: center; padding: 2px 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.25); border: 1px solid #ddd; }
                .search-input { flex: 1; border: none; padding: 12px 0; font-size: 15px; outline: none; background: transparent; }
                .table-search { width: 100%; padding: 10px 15px; border-radius: 10px; border: 1px solid #ddd; margin-bottom: 15px; font-size: 14px; outline: none; box-sizing: border-box; }
            `
            }, void 0, false, {
                fileName: "[project]/components/MapClient.tsx",
                lineNumber: 146,
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
                            lineNumber: 156,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/MapClient.tsx",
                        lineNumber: 155,
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
                                        lineNumber: 161,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "search-input",
                                        type: "text",
                                        placeholder: "Wyszukaj na mapie...",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/components/MapClient.tsx",
                                        lineNumber: 162,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/MapClient.tsx",
                                lineNumber: 160,
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
                                lineNumber: 164,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MapClient.tsx",
                        lineNumber: 159,
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            margin: 0,
                                            fontFamily: 'Syne'
                                        },
                                        children: "Twoje zapisane adresy:"
                                    }, void 0, false, {
                                        fileName: "[project]/components/MapClient.tsx",
                                        lineNumber: 169,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '12px',
                                            background: '#ff4d4d',
                                            color: 'white',
                                            padding: '4px 10px',
                                            borderRadius: '20px'
                                        },
                                        children: [
                                            pins.length,
                                            " pinesek"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/MapClient.tsx",
                                        lineNumber: 170,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/MapClient.tsx",
                                lineNumber: 168,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "table-search",
                                type: "text",
                                placeholder: "Filtruj listę...",
                                value: tableSearch,
                                onChange: (e)=>setTableSearch(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/MapClient.tsx",
                                lineNumber: 173,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                style: {
                                    listStyleType: 'none',
                                    padding: 0
                                },
                                children: filteredPins.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    style: {
                                        color: '#888',
                                        textAlign: 'center',
                                        padding: '20px'
                                    },
                                    children: "Brak zapisanych miejsc."
                                }, void 0, false, {
                                    fileName: "[project]/components/MapClient.tsx",
                                    lineNumber: 177,
                                    columnNumber: 29
                                }, this) : filteredPins.map((pin)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
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
                                                        style: {
                                                            fontSize: '16px',
                                                            display: 'block'
                                                        },
                                                        children: pin.address
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/MapClient.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: '13px',
                                                            color: '#666'
                                                        },
                                                        children: pin.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/MapClient.tsx",
                                                        lineNumber: 183,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/MapClient.tsx",
                                                lineNumber: 181,
                                                columnNumber: 37
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
                                                            padding: '8px 12px',
                                                            cursor: 'pointer'
                                                        },
                                                        children: "👁️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/MapClient.tsx",
                                                        lineNumber: 186,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>removePin(pin.id),
                                                        style: {
                                                            background: '#ff4d4d',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            padding: '8px 15px',
                                                            cursor: 'pointer'
                                                        },
                                                        children: "Usuń"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/MapClient.tsx",
                                                        lineNumber: 187,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/MapClient.tsx",
                                                lineNumber: 185,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, pin.id, true, {
                                        fileName: "[project]/components/MapClient.tsx",
                                        lineNumber: 180,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/MapClient.tsx",
                                lineNumber: 175,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MapClient.tsx",
                        lineNumber: 167,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MapClient.tsx",
                lineNumber: 154,
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
                        width: '90%',
                        maxWidth: '380px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                fontFamily: 'Syne',
                                margin: '0 0 15px'
                            },
                            children: "Zapisz to miejsce"
                        }, void 0, false, {
                            fileName: "[project]/components/MapClient.tsx",
                            lineNumber: 199,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            autoFocus: true,
                            value: pinName,
                            onChange: (e)=>setPinName(e.target.value),
                            style: {
                                width: '100%',
                                padding: '14px',
                                borderRadius: '12px',
                                border: '1px solid #ddd'
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/MapClient.tsx",
                            lineNumber: 200,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: '10px',
                                marginTop: '25px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setModalOpen(false),
                                    style: {
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: '1px solid #ddd'
                                    },
                                    children: "Anuluj"
                                }, void 0, false, {
                                    fileName: "[project]/components/MapClient.tsx",
                                    lineNumber: 202,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSave,
                                    style: {
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: '#ff4d4d',
                                        color: '#fff'
                                    },
                                    children: "Zapisz"
                                }, void 0, false, {
                                    fileName: "[project]/components/MapClient.tsx",
                                    lineNumber: 203,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/MapClient.tsx",
                            lineNumber: 201,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/MapClient.tsx",
                    lineNumber: 198,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/MapClient.tsx",
                lineNumber: 197,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true);
}
_s(MapClient, "EPhAbRlzVnnW7o2fLj0H2sSufwM=");
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