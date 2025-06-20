// frontend/src/App.jsx - Com Planejamento de Rota
import { useState, useCallback } from 'react';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { bikeIcon } from './leafletIcons';

// Componente para lidar com eventos do mapa (bicicletários e cliques)
function MapEventsHandler({ onMapChange, onMapClick }) {
  useMapEvents({
    load: (e) => onMapChange(e.target.getBounds()),
    moveend: (e) => onMapChange(e.target.getBounds()),
    click: (e) => onMapClick(e.latlng),
  });
  return null;
}

function App() {
  const position = [-22.817, -47.068];
  const [bikeRacks, setBikeRacks] = useState([]);

  // Estados para o planejamento de rota
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);

  const fetchBikeRacks = useCallback((bounds) => {
    const url = new URL('http://localhost:3000/bike-racks');
    url.searchParams.append('north', bounds.getNorth());
    url.searchParams.append('south', bounds.getSouth());
    url.searchParams.append('east', bounds.getEast());
    url.searchParams.append('west', bounds.getWest());
    fetch(url).then(res => res.json()).then(data => setBikeRacks(data));
  }, []);

  const handleMapClick = (latlng) => {
    if (!origin) {
      setOrigin(latlng);
      setRoute([]); // Limpa rota anterior
    } else if (!destination) {
      setDestination(latlng);
      // Temos origem e destino, vamos buscar a rota
      fetchRoute(origin, latlng);
    }
  };

  const fetchRoute = (start, end) => {
  // Cria a URL base
  const url = new URL('http://localhost:3000/route');

  // Adiciona os parâmetros de forma segura
  url.searchParams.append('start', `${start.lng},${start.lat}`);
  url.searchParams.append('end', `${end.lng},${end.lat}`);

  console.log(`Buscando rota: ${url.toString()}`); // Agora a URL estará correta

  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`O backend retornou um erro: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (data.error) {
        console.error(data.error);
        alert("Não foi possível encontrar uma rota.");
      } else {
        setRoute(data);
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar rota:", error);
      alert(`Erro ao buscar rota: ${error.message}`);
    });
};

  const clearRoute = () => {
    setOrigin(null);
    setDestination(null);
    setRoute([]);
  };

  return (
    <>
      <div className="app-header">
        <h1>Projeto de Mobilidade Ativa Unicamp</h1>
        { !origin && <p>Clique no mapa para definir o ponto de <b>origem</b>.</p> }
        { origin && !destination && <p>Origem definida. Clique no mapa para definir o <b>destino</b>.</p> }
        { route.length > 0 && <button onClick={clearRoute}>Limpar Rota</button> }
      </div>

      <MapContainer center={position} zoom={15} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
        <MapEventsHandler onMapChange={fetchBikeRacks} onMapClick={handleMapClick} />

        {/* Marcadores de bicicletário */}
        {bikeRacks.map(rack => <Marker key={rack.id} position={rack.location} icon={bikeIcon}><Popup>{rack.name}</Popup></Marker>)}

        {/* Marcadores de Origem e Destino */}
        {origin && <Marker position={origin}><Popup>Origem</Popup></Marker>}
        {destination && <Marker position={destination}><Popup>Destino</Popup></Marker>}

        {/* Linha da Rota */}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </>
  );
}

export default App;