# PortMap Analyst
A responsive web map application template with geospatial tools using [Turf](https://github.com/Turfjs/turf), [Bootstrap](https://getbootstrap.com/) and [Mapbox GL](https://www.mapbox.com/mapbox-gl-js/api/)

It's basically a starting point to easily attach additional Turf.js spatial analysis tools. What's already included is a lat/lng finder, center of mass, buffer, great circle, polygon grid, feature measurement, and coordinate array. 

You can also drag and drop JSON files into the app to display the geographic feature on the map. Additionally, JSON features work with the Mapbox Draw API so you can import, edit, and export your JSON files directly from the app. I added some JSON files in assets/json/ if you wanted to test the functionality. The Drag and Drop functionality was built up from F.Moser's code https://bl.ocks.org/fxi/b7f1af5981432296bfafec70a95fd9b6



PortMap Analyst is built from [PortMap](https://github.com/portofportlandgis/portmap). Take a look there if you need more of an organizational mapping application. 

To get started you need to generate a Mapbox ID. Get your ID by creating a Mapbox account. Insert your Mapbox ID in assets/js/map.js on line 1.



