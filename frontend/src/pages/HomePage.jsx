import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { bikeIcon } from '../leafletIcons';

// Componente para lidar com eventos do mapa
function MapEventsHandler({ onMapChange, onMapClick }) {
  const map = useMapEvents({
    load: (e) => onMapChange(e.target.getBounds()),
    moveend: (e) => onMapChange(e.target.getBounds()),
    click: (e) => onMapClick(e.latlng),
  });
  return null;
}

function HomePage() {
  const position = [-22.817, -47.068]; // Centered on Campinas
  const [bikeRacks, setBikeRacks] = useState([]);
  
  // Estados para o planejamento de rota
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0); // Estado para a distância

  const fetchBikeRacks = useCallback((bounds) => {
    const url = new URL('http://localhost:3000/bike-racks');
    url.searchParams.append('north', bounds.getNorth());
    url.searchParams.append('south', bounds.getSouth());
    url.searchParams.append('east', bounds.getEast());
    url.searchParams.append('west', bounds.getWest());
    fetch(url)
      .then(res => res.json())
      .then(data => setBikeRacks(data))
      .catch(error => console.error("Erro ao buscar bicicletários:", error));
  }, []);

  const handleMapClick = (latlng) => {
    console.log(`Ponto clicado -> Latitude: ${latlng.lat}, Longitude: ${latlng.lng}`);
    if (!origin) {
      setOrigin(latlng);
      setRoute([]); // Limpa apenas a rota anterior, mantendo a nova origem
      setDistance(0);
    } else if (!destination) {
      setDestination(latlng);
      fetchRoute(origin, latlng);
    }
  };

  const fetchRoute = (start, end) => {
    const url = new URL('http://localhost:3000/route');
    url.searchParams.append('start', `${start.lng},${start.lat}`);
    url.searchParams.append('end', `${end.lng},${end.lat}`);
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setRoute(data.coordinates); 
        setDistance(data.distance);
      })
      .catch((error) => {
        alert(`Erro ao buscar rota: ${error.message}`);
        clearRoute();
      });
  };

  const clearRoute = () => {
    setOrigin(null);
    setDestination(null);
    setRoute([]);
    setDistance(0);
  };
  
  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  };

  return (
    <>
      <div className="app-header">
        <h1>Projeto de Mobilidade Ativa Unicamp</h1>
        { !origin && <p>Clique no mapa para definir o ponto de <b>origem</b>.</p> }
        { origin && !destination && <p>Origem definida. Clique no mapa para definir o <b>destino</b>.</p> }
        { route.length > 0 && (
            <div className="route-info">
              <span>Distância da Rota: <strong>{formatDistance(distance)}</strong></span>
              <button onClick={clearRoute}>Limpar Rota</button>
            </div>
        )}
      </div>

      <MapContainer center={position} zoom={15} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
        <MapEventsHandler onMapChange={fetchBikeRacks} onMapClick={handleMapClick} />
        
        {bikeRacks.map(rack => (
          <Marker key={rack.id} position={[rack.location.lat, rack.location.lng]} icon={bikeIcon}>
            <Popup><strong>{rack.name}</strong><br />Vagas disponíveis: {rack.availableSpots}</Popup>
          </Marker>
        ))}

        {origin && <Marker position={origin}><Popup>Origem</Popup></Marker>}
        {destination && <Marker position={destination}><Popup>Destino</Popup></Marker>}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </>
  );
}

export default HomePage;