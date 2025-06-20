// frontend/src/App.jsx - Com Título do Projeto
import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { bikeIcon } from './leafletIcons'; // Importando nosso ícone personalizado

// Componente auxiliar para lidar com os eventos do mapa
function MapEventsHandler({ onMapChange }) {
  const map = useMapEvents({
    // Eventos que disparam a busca de dados
    load: () => onMapChange(map.getBounds()),
    moveend: () => onMapChange(map.getBounds()),
  });
  return null; // Este componente não renderiza nada
}

function App() {
  const position = [-22.817, -47.068];
  const [bikeRacks, setBikeRacks] = useState([]);

  // Usamos o useCallback para evitar que a função seja recriada em toda renderização
  const fetchBikeRacks = useCallback((bounds) => {
    const url = new URL('http://localhost:3000/bike-racks');
    url.searchParams.append('north', bounds.getNorth());
    url.searchParams.append('south', bounds.getSouth());
    url.searchParams.append('east', bounds.getEast());
    url.searchParams.append('west', bounds.getWest());

    console.log(`Buscando bicicletários em: ${url.toString()}`);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados recebidos:", data);
        setBikeRacks(data);
      })
      .catch((error) => console.error('Erro ao buscar bicicletários:', error));
  }, []);

  return (
    <>
      <div className="app-header">
        <h1>Projeto de Mobilidade Ativa Unicamp</h1>
        <p>Encontre bicicletários e planeje suas rotas no campus.</p>
      </div>

      <MapContainer center={position} zoom={15}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Componente que observa o mapa e chama a função de busca */}
        <MapEventsHandler onMapChange={fetchBikeRacks} />

        {/* Mapeamento dos bicicletários com o ícone personalizado */}
        {bikeRacks.map((rack) => (
          <Marker key={rack.id} position={[rack.location.lat, rack.location.lng]} icon={bikeIcon}>
            <Popup>
              <strong>{rack.name}</strong>
              <br />
              Vagas disponíveis: {rack.availableSpots}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}

export default App;