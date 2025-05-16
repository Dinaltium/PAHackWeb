// This script fixes CSS issues with Leaflet maps
document.addEventListener("DOMContentLoaded", function () {
  // Make sure Leaflet styles get properly applied
  const style = document.createElement("style");
  style.textContent = `
    .leaflet-container {
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    
    .leaflet-control {
      z-index: 1000;
    }
    
    .custom-map-icon {
      background: none !important;
      border: none !important;
    }
    
    .leaflet-marker-icon {
      filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
    }
  `;
  document.head.appendChild(style);

  // Load FontAwesome if not already loaded
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(link);
  }

  console.log("Leaflet CSS fixes applied!");
});
