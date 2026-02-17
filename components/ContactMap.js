'use client';

import { useEffect, useRef } from 'react';

export default function ContactMap() {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        const container = mapRef.current;
        if (!container || mapInstanceRef.current) return;

        // Guard: if Leaflet already initialized this container (Strict Mode re-run)
        if (container._leaflet_id) return;

        let cancelled = false;

        // Dynamically import leaflet (client-only)
        import('leaflet').then((L) => {
            if (cancelled || !container || container._leaflet_id) return;

            // Fix default marker icons for webpack/next.js
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            const MAP_LAT = 31.464;
            const MAP_LNG = 74.4426;
            const MAP_ZOOM = 17;

            const map = L.map(container, {
                center: [MAP_LAT, MAP_LNG],
                zoom: MAP_ZOOM,
                scrollWheelZoom: false,
                zoomControl: true,
                attributionControl: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors',
            }).addTo(map);

            const marker = L.marker([MAP_LAT, MAP_LNG]).addTo(map);
            marker.bindPopup(
                '<strong>Hurman</strong><br>Cybersecurity & Digital Forensics Student<br>at Lahore Garrison University.<br><em>Open to Opportunities.</em>'
            );

            mapInstanceRef.current = map;

            // Fix map rendering
            setTimeout(() => map.invalidateSize(), 500);
        });

        return () => {
            cancelled = true;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    return <div id="contactMap" ref={mapRef} />;
}
