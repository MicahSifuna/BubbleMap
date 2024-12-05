import React, { useState, useEffect, useRef } from 'react'

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import L from "leaflet"

import "../map/map.css"
import MarkerClusterGroup from 'react-leaflet-markercluster';


const pointIcon = L.divIcon({
   className: 'circle-icon',
   html: '<div style="background-color: orange; border: 1px solid black; border-radius: 50%; width: 10px; height: 10px;"></div>',
   iconSize: [10, 10],
   iconAnchor: [5, 5],
});

// Function to determine the color of the cluster based on the cluster size
// const getClusterColor = (count) => {
//    if (count < 100) return 'rgba(0, 128, 0, 0.6)';
//    if (count < 500) return 'rgba(255, 165, 0, 0.6)';
//    return;
// };


const getClusterColor = (count) => {
   if (count < 100) return 'rgba(0, 128, 0, 0.6)';       // Green: 0 - 99
   if (count < 500) return 'rgba(34, 139, 34, 0.6)';     // ForestGreen: 100 - 199
   if (count < 1000) return 'rgba(50, 205, 50, 0.6)';     // LimeGreen: 200 - 299
   if (count < 1500) return 'rgba(154, 205, 50, 0.6)';    // YellowGreen: 300 - 399
   if (count < 2000) return 'rgba(255, 215, 0, 0.6)';     // Gold: 400 - 499
   if (count < 2500) return 'rgba(255, 165, 0, 0.6)';     // Orange: 500 - 599
   if (count < 3000) return 'rgba(255, 99, 71, 0.6)';     // Tomato: 600 - 699
   if (count < 3500) return 'rgba(255, 69, 0, 0.6)';      // RedOrange: 700 - 799
   if (count < 4000) return 'rgba(255, 0, 0, 0.6)';       // Red: 800 - 899
   if (count < 4500) return 'rgba(178, 34, 34, 0.6)';    // FireBrick: 900 - 999
   return;
};


// Function to create a custom cluster icon
const createClusterCustomIcon = (cluster) => {
   const count = cluster.getChildCount(); // Number of points in the cluster
   // const size = 1 + (count / 100) * 5;
   const size = Math.min(40 + (count / 10) * 2, 80);

   return L.divIcon({
      html: `<div style="
               background-color: ${getClusterColor(count)};
               color: white;
               border-radius: 50%;
               width: ${size}px;
               height: ${size}px;
               line-height: ${size}px;
               text-align: center;
               font-weight: bold;
             ">
             ${count}
           </div>`,
      className: 'custom-cluster-icon',
      iconSize: L.point(size, size),
   });
};

const Map = () => {

   const [geojsonData, setGeojsonData] = useState({});
   const [loading, setLoading] = useState(true);
   const mapref = useRef();

   useEffect(() => {
      setLoading(true);
      loadGeojson()
      console.log("geojsonData", geojsonData)
   }, []);

   const loadGeojson = async () => {
      try {
         const response = await fetch('/data/merged.geojson');
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }
         const data = await response.json(); // Parse the response as JSON
         console.log("data:", data);
         setGeojsonData(data);
         return data;
      } catch (error) {
         console.error('Error fetching GeoJSON data:', error);
      } finally {
         setLoading(false); // Set loading to false regardless of success or error
      }
   };
   return (
      <>
         <div>
            <h4>Bubble Map to represent data points</h4>
         </div>

         <div id='map'>
            {loading && <div>Loading GeoJSON data...</div>}

            <MapContainer
               style={{ height: "600px" }}
               center={[12.28325, 22.81724]}
               zoom={3}
               ref={mapref}
            >
               <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               />

               <MarkerClusterGroup
                  maxClusterRadius={20}
                  iconCreateFunction={createClusterCustomIcon}
               >
                  {!loading && geojsonData && (
                     <GeoJSON
                        data={geojsonData}
                        pointToLayer={(feature, latlng) => L.marker(latlng, { icon: pointIcon })}
                        onEachFeature={(feature, layer) => {
                           const { SITE_LATITUDE, SITE_LONGITUDE, SITE_COUNTRY, MEASURE_DATE, MEASURE_VALUE } = feature.properties;
                           layer.bindPopup(`
                              <strong>Location:</strong> ${SITE_COUNTRY} <br />
                              <strong>Latitude:</strong> ${SITE_LATITUDE} <br />
                              <strong>Longitude:</strong> ${SITE_LONGITUDE} <br />
                              <strong>Measure Date:</strong> ${MEASURE_DATE} <br />
                              <strong>Measure Value:</strong> ${MEASURE_VALUE}
                           `);
                        }}
                     />
                  )}

               </MarkerClusterGroup>
            </MapContainer>
         </div>
      </>
   )
}

export default Map