import L from 'leaflet';

// Map building types to appropriate icons
const typeToIconMap: Record<string, { icon: string, color: string }> = {
  academic: { icon: 'school', color: '#3B82F6' },  // blue
  administrative: { icon: 'building', color: '#6366F1' }, // indigo
  residence: { icon: 'home', color: '#EC4899' },   // pink
  dining: { icon: 'utensils', color: '#F59E0B' },  // amber
  recreation: { icon: 'dumbbell', color: '#10B981' }, // emerald
  library: { icon: 'book', color: '#6D28D9' },     // purple
  default: { icon: 'map-marker', color: '#EF4444' } // red
};

// This function creates custom Leaflet icons based on building type
export function getIconForBuildingType(type?: string): L.Icon {
  const iconConfig = type && typeToIconMap[type] ? typeToIconMap[type] : typeToIconMap.default;
  
  // Create a custom HTML marker with FontAwesome icon
  const iconHtml = `
    <div style="
      background-color: ${iconConfig.color}; 
      width: 36px; 
      height: 36px; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      border-radius: 50%; 
      color: white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    ">
      <i class="fa fa-${iconConfig.icon}"></i>
    </div>
    <div style="
      width: 0; 
      height: 0; 
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid ${iconConfig.color};
      margin: -5px auto 0;
    "></div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-map-icon',
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -46]
  });
}

// Get icon for the user's current location
export function getUserLocationIcon(): L.Icon {
  return L.divIcon({
    html: `
      <div style="
        background-color: #3B82F6; 
        width: 20px; 
        height: 20px; 
        border-radius: 50%; 
        border: 3px solid white;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.7);
      "></div>
    `,
    className: 'user-location-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

// Helper function for highlighted/selected building
export function getHighlightedIcon(type?: string): L.Icon {
  const iconConfig = type && typeToIconMap[type] ? typeToIconMap[type] : typeToIconMap.default;
  
  const iconHtml = `
    <div style="
      background-color: ${iconConfig.color}; 
      width: 42px; 
      height: 42px; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      border-radius: 50%; 
      color: white;
      box-shadow: 0 0 0 4px white, 0 0 10px rgba(0,0,0,0.5);
    ">
      <i class="fa fa-${iconConfig.icon}"></i>
    </div>
    <div style="
      width: 0; 
      height: 0; 
      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
      border-top: 12px solid ${iconConfig.color};
      margin: -5px auto 0;
    "></div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-map-icon-highlighted',
    iconSize: [42, 54],
    iconAnchor: [21, 54],
    popupAnchor: [0, -54]
  });
}
