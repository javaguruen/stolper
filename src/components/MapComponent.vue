<template>
  <div class="hello">
    <h1>Stolper i Norge</h1>
    <p>
      Viser alle kommuner med arrangører som har stolper.
    </p>
    <div id="container">
      <div id="mapContainer"></div>
    </div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css"
import organizers from "./organizers.json"
import L from "leaflet"
delete L.Icon.Default.prototype._getIconUrl;

export default {
  name: "Map",
  data() {
    return {
      center: [37, 7749, -122, 4194]
    }
  },
  methods: {
    setupLeafletMap: function () {
      const mapDiv = L.map("mapContainer").setView([65.4577658, 5.312518], 5);
      // const mapDiv = L.map("mapContainer").setView([65.275, 10.311], 5);

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
      });


      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapDiv);

      // console.log(organizers)
      organizers.results.forEach( (organizer) => {
        const name = organizer.alias
        // console.log('Parsing alias: ' + name)
        if( organizer.kommuner.length > 0) {
          const location = organizer.kommuner[0].location
          if (location.length === 2 ) {
            L.marker([location[1], location[0]]).addTo(mapDiv)
                .bindPopup(name)
          }
          else {
            console.log('No location for first municipality for alias: ' + name)
          }
        } else {
          console.log('Ingen kommuner for alias ' + name)
        }
          //.openPopup();
      })
    },
  },
  mounted() {
    this.setupLeafletMap();
  },
};
</script>

<style scoped>
#mapContainer {
  /* width: 80vw; */
  height: 800px;
}
</style>
