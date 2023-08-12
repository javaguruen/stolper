<template>
  <div class="hello">
    <h1>Stolper i Norge</h1>
    <p>
      Viser alle kart/områder for alle arrangører i Norge.
    </p>
    <p>Data fra <a href="https://www.openstreetmap.org" target="_blank">OpenStreetMap</a> og
      <a href="https://stolpejakten.no" target="_blank">Stolpejakten.no</a>.</p>
    <button class="dot circle link icon" @click="locatorButtonPressed">Min posisjon</button>
    <div id="container">
      <div id="mapContainer"></div>
    </div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css"
import axios from 'axios'
import {reactive, onMounted, onBeforeMount} from 'vue'

//import organizers from "./organizers.json"
import L from "leaflet"

delete L.Icon.Default.prototype._getIconUrl;

export default {
  name: "Map",
  setup() {
    const data = reactive({
      center: [37, 7749, -122, 4194],
      organizers: []
    })

    const locatorButtonPressed = () => {
      console.log("locator pressed")
      navigator.geolocation.getCurrentPosition(
          position => {
            const latLngs = [position.coords.latitude, position.coords.longitude]
            const mapDiv = document.getElementById("mapContainer").leaflet; //L.map("mapContainer")
            L.circle(latLngs,
                {color: 'red', fillColor: 'red', radius: 400, fillOpacity: 1.0}).addTo(mapDiv)
                .bindPopup('Min posisjon')
            var markerBounds = L.latLngBounds([latLngs]);
            mapDiv.fitBounds(markerBounds);
            mapDiv.setZoom(11)
          },
          error => {
            console.log(error.message);
          },
      )
    }

    const setupLeafletMap = () => {
      const mapElement = document.getElementById("mapContainer");
      const mapDiv = L.map("mapContainer").setView([65.4577658, 5.312518], 5);
      /* Make map available as custom property on element */
      mapElement.leaflet = mapDiv

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
      });


      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapDiv);

      console.log("Number of organizers: " + data.organizers.length)
      const now = new Date()

      data.organizers.forEach((organizer) => {
        const fylke = organizer.fylke.name
        const kommuner = organizer.kommuner.map( (kommune) => {
          return {
            id: kommune.id,
            name: kommune.name
          }
        })
        console.log(kommuner)

        organizer.areas
            .filter((area) => Date.parse(area.available_from) <= now && now <= Date.parse(area.available_to))
            .forEach((area) => {
              const kommuneNavn = kommuner.filter( (k) => k.id === area.kommune)[0].name
              const name = area.name
              const location = area.location
              const pole_count = area.pole_count
              if (location.length === 2) {
                console.log([location[1], location[0]])
                L.marker([location[1], location[0]]).addTo(mapDiv)
                    .bindPopup(fylke + ', ' + kommuneNavn + '<br/>' + name + '<br/>' + pole_count + ' stolper')
              } else {
                console.log('No location for first municipality for alias: ' + name)
              }
            })
      })
    }

    const getOrganizers = () => {
      /*
      const o = JSON.parse(JSON.stringify(organizers)).results
      data.organizers.splice(0, data.organizers.length)
      data.organizers.push(...o)
      */

      //setupLeafletMap()

      axios.get('/api/organizers')
          .then(response => {
            // JSON responses are automatically parsed.
            console.log('Get organizers data ...success')
            console.log(response.data.results)
            data.organizers.splice(0, data.organizers.length)
            //const availableAreas =
            data.organizers.push(...response.data.results)
          }).then( () => { setupLeafletMap() })
          .catch(e => {
            console.log('Get organizers data...failed')
            console.log(e)
          })


    }

    onBeforeMount(() => {
      getOrganizers()
    })

    onMounted(() => {
      //setupLeafletMap()
    })


    return {data, locatorButtonPressed}
  }
};
</script>

<style scoped>
#mapContainer {
  /* width: 80vw; */
  height: 800px;
}
</style>
