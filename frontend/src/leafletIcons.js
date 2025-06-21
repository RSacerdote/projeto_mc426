import L from 'leaflet';
import iconUrl from './assets/bike-icon.svg';

export const bikeIcon = new L.Icon({
  iconUrl: iconUrl,
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35]
});