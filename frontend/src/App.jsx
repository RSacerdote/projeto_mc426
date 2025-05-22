import { useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {

  const position = [-22.817, -47.068]; // Coordenadas iniciais do campus
  const [count, setCount] = useState(0)
  const [bikeRacks, setBikeRacks] = useState([]); // Estado para armazenar os dados dos bicicletários

  // Fetch dos dados dos bicicletários
  useEffect(() => {
    fetch('http://localhost:3000/bike-racks') // Certifique-se de que o backend está rodando
      .then((response) => response.json())
      .then((data) => setBikeRacks(data))
      .catch((error) => console.error('Erro ao buscar bicicletários:', error));
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <MapContainer center={position} zoom={15} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {bikeRacks.map((rack) => (
          <Marker key={rack.id} position={[rack.location.lat, rack.location.lng]}>
            <Popup>
              <strong>{rack.name}</strong>
              <br />
              Vagas disponíveis: {rack.availableSpots}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  )
}

export default App
