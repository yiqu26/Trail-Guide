import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography } from '@mui/material';
import type { TrailHead } from '../types';

// 修復 Leaflet 預設圖標問題
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const trailHeadIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface TrailMapProps {
  title: string;
  latitude?: number;
  longitude?: number;
  trailHeads?: TrailHead[];
}

export function TrailMap({ title, latitude, longitude, trailHeads = [] }: TrailMapProps) {
  // 如果沒有座標，不顯示地圖
  if (!latitude || !longitude) {
    return null;
  }

  const center: [number, number] = [latitude, longitude];

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        步道位置
      </Typography>
      <Box
        sx={{
          height: 250,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 步道主要位置 */}
          <Marker position={center} icon={defaultIcon}>
            <Popup>
              <strong>{title}</strong>
            </Popup>
          </Marker>

          {/* 步道入口 */}
          {trailHeads.map((head) =>
            head.latitude && head.longitude ? (
              <Marker
                key={head.id}
                position={[head.latitude, head.longitude]}
                icon={trailHeadIcon}
              >
                <Popup>
                  <strong>{head.name}</strong>
                  {head.description && (
                    <>
                      <br />
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {head.description}
                      </span>
                    </>
                  )}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        藍色標記：步道位置 / 綠色標記：步道入口
      </Typography>
    </Box>
  );
}
