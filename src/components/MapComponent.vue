<template>
  <div class="hello">
    <h1>Stolper i Norge</h1>
    <p>
      Viser alle kart/områder for alle arrangører i Norge.
    </p>
    <p>Data fra <a href="https://www.openstreetmap.org" target="_blank">OpenStreetMap</a> og
    <a href="https://stolpejakten.no" target="_blank">Stolpejakten.no</a>.</p>
    <div id="container">
      <div id="mapContainer"></div>
    </div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css"
import axios from 'axios'

// import organizers from "./organizers.json"
import L from "leaflet"
delete L.Icon.Default.prototype._getIconUrl;

export default {
  name: "Map",
  data() {
    return {
      center: [37, 7749, -122, 4194],
      organizers: []
    }
  },
  methods: {
    getOrganizers: async function () {
      axios.get('/api/organizers')
          .then(response => {
            // JSON responses are automatically parsed.
            console.log('Get organizers data ...success')
            console.log(response.data.results)
            this.organizers.splice(0, this.organizers.length)
            this.organizers.push(...response.data.results)
          }).then( () => {this.setupLeafletMap() })
          .catch(e => {
            console.log('Get organizers data...failed')
            console.log(e)
          })
    },

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

      console.log("Number of organizers: " + this.organizers.length)
      this.organizers.forEach( (organizer) => {
        organizer.areas.forEach( (area) => {
          const name = area.name
          const organizer  = area.organizer_name
          const location = area.location
          const pole_count = area.pole_count
          if (location.length === 2 ) {
            L.marker([location[1], location[0]]).addTo(mapDiv)
                .bindPopup(organizer + '<br/>' + name + '<br/>' + pole_count + ' stolper')
          }
          else {
            console.log('No location for first municipality for alias: ' + name)
          }
        })
        })
    },
  },
  mounted() {
    this.getOrganizers()
    //this.setupLeafletMap();
  },
};
</script>

<style scoped>
#mapContainer {
  /* width: 80vw; */
  height: 800px;
}
</style>
