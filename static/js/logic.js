// Data
link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"



let myMap = L.map("map", {
    center: [0, 0],
    zoom: 2
  });
  
  // title
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  


  function depthToColor(depth) {
    if (depth < 10) return "mediumseagreen";  
    else if (depth < 30) return "palegreen"; 
    else if (depth < 50) return "springgreen";  
    else if (depth < 70) return "khaki";  
    else if (depth < 90) return "coral";  
    else return "firebrick";  
  }

//  Data
d3.json(link)
    .then((data) => {
        data.features.forEach(feature => {
            const coordinates = feature.geometry.coordinates;
            const mag = feature.properties.mag;
            const depth = coordinates[2];
            const title = feature.properties.title;

           
            const markerSize = mag * 2.5;

            marker = L.circleMarker([coordinates[1], coordinates[0]], {
              radius: markerSize,
              fillColor: depthToColor(depth),
              color: 'black', 
              weight: 1, 
              opacity: 1, 
              fillOpacity: 0.7, 
            }).addTo(myMap);
            marker.bindPopup(`mag: ${mag}<br>Depth: ${depth} km<br>${title}`);
        });
    })
    .catch(error => console.error('Error fetching earthquake data:', error));


// how to create the legend
function createLegend() {
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      const depthRanges = [[-10, 10], [10, 30], [30, 50], [50, 70], [70, 90], [90, 110]]; 

      for (let i = 0; i < depthRanges.length; i++) {
        const minDepth = depthRanges[i][0];
        const maxDepth = depthRanges[i][1];
        const avgDepth = (minDepth + maxDepth) / 2;
    
       
        if (i === depthRanges.length - 1) {
            div.innerHTML +=
                '<i style="background:' + depthToColor(avgDepth) + '"></i> ' +
                minDepth + '+<br>';
        } else {
            div.innerHTML +=
                '<i style="background:' + depthToColor(avgDepth) + '"></i> ' +
                minDepth + '&ndash;' + maxDepth + '<br>';
        }
      }
      return div;
  };
  legend.addTo(myMap);
}
// create legend
createLegend();

