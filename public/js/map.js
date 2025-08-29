 // Replace these coords with the ones for your listing if you want it dynamic
 var lat = 28.6139;   // Latitude for New Delhi
 var lng = 77.2090;   // Longitude for New Delhi
 var map = L.map('map').setView([lat, lng], 11);

 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '&copy; OpenStreetMap contributors'
 }).addTo(map);

 // Optionally, add a marker at the center
 L.marker([lat, lng]).addTo(map)
     .bindPopup('New Delhi')
     .openPopup();