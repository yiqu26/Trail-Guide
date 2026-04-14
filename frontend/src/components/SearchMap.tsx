import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography } from '@mui/material';
import type { TrailDetail } from '../types';

// 自訂綠色圓點 marker
function createDotIcon(isActive: boolean) {
  return new DivIcon({
    className: '',
    html: `
      <div style="
        width: ${isActive ? 18 : 12}px;
        height: ${isActive ? 18 : 12}px;
        background: ${isActive ? '#1B4332' : '#2D6A4F'};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.2s;
      "></div>`,
    iconSize: [isActive ? 18 : 12, isActive ? 18 : 12],
    iconAnchor: [isActive ? 9 : 6, isActive ? 9 : 6],
  });
}

// 飛到指定座標的 controller
function FlyToController({ lat, lng }: { lat?: number; lng?: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 13, { duration: 1.2 });
    }
  }, [lat, lng, map]);
  return null;
}

interface TrailPin {
  id: number;
  title: string;
  latitude?: number;
  longitude?: number;
}

interface SearchMapProps {
  trails: TrailPin[];
  activeTrailId?: number | null;
  activeTrailDetail?: TrailDetail | null;
  onMarkerClick?: (id: number) => void;
}

export function SearchMap({ trails, activeTrailId, activeTrailDetail, onMarkerClick }: SearchMapProps) {
  const pinsWithCoords = trails.filter((t) => t.latitude && t.longitude);

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={[23.8, 121]}
        zoom={8}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Fly to active trail */}
        {activeTrailDetail?.latitude && activeTrailDetail?.longitude && (
          <FlyToController lat={activeTrailDetail.latitude} lng={activeTrailDetail.longitude} />
        )}

        {/* Trail pins */}
        {pinsWithCoords.map((trail) => (
          <Marker
            key={trail.id}
            position={[trail.latitude!, trail.longitude!]}
            icon={createDotIcon(trail.id === activeTrailId)}
            eventHandlers={{ click: () => onMarkerClick?.(trail.id) }}
          >
            <Popup>
              <Box sx={{ p: 0.5 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  {trail.title}
                </Typography>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* 空地圖提示 */}
      {pinsWithCoords.length === 0 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
            px: 2.5,
            py: 1.2,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            zIndex: 1000,
          }}
        >
          <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
            搜尋步道後，地圖將顯示對應位置
          </Typography>
        </Box>
      )}
    </Box>
  );
}
