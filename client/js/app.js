App = {

  api: '/api',

  geocoder: function () {
    return L.mapbox.geocoder('tutorwire.map-rbl1tiup')
  },

  map: null,

  initMap: function (id) {
    if (App.map) return App.map

    id = id || 'map'

    var map = App.map = L.mapbox.map(id, 'tutorwire.map-rbl1tiup',{
      attributionControl: false,
      minZoom: 6
    })

    map.zoomControl.setPosition('topright')
    map.setView([55, -6], 6)

    return map
  },

  userMarker: null,

  showUserMarker: function(location) {
    if (App.userMarker){
      App.map.removeLayer(App.userMarker)
    }

    var icon = L.AwesomeMarkers.icon({
      color: 'orange'
    })

    App.userMarker = L.marker(location.coords, {icon: icon, title: 'You are here'})

    App.userMarker.addTo(App.map)

    App.map.setView(location.coords, 11)
  },

  locateUser: function (cb) {
    cb = cb || function () {}

    App.map.on('locationfound', function (event) {

      App.geocoder().reverseQuery(event.latlng, function (err, response){
        if (err) { return console.error(err) }

        // response looks like: {"query":[-0.0801,51.4657],"results":[[{"bounds":[-0.523222999999989,51.27866,0.336112,51.72023],"lat":51.5040006418191,"lon":-0.109467698133307,"name":"London","score":900001728809196.6,"type":"place","id":"mapbox-places.219827"},{"bounds":[-0.107894862857551,51.4191873235362,-0.0231455141541109,51.51158478481],"lat":51.4653860541731,"lon":-0.0636831061709452,"name":"Southwark","score":30926433.0294826,"type":"province","id":"province.2903"},{"bounds":[-13.6913559567794,49.9096161909876,1.77170536308596,60.8475532028857],"lat":54.3177967325959,"lon":-1.91064039912679,"name":"United Kingdom","population":61113205,"type":"country","id":"country.152"}]],"attribution":{"mapbox-places":"<a href='http://mapbox.com/about/maps' target='_blank'>Terms & Feedback</a>"}}
        var name = response.results[0][0].name

        App.location = {
          name: name,
          coords: App.normalizeCoords(event.latlng)
        }

        cb(App.location)
      })

    })

    App.map.locate()
  },

  markers: [],

  clearMarkers: function () {
    console.log('Clearing markers', App.markers)
    while (App.markers.length) {
      App.map.removeLayer(App.markers.pop())
    }
  },

  showTutorsOnMap: function (tutors) {
    console.log('Showing tutors on map', tutors)
    for (var i = 0; i < tutors.length; i++) {
      App.showTutorOnMap(tutors[i])
    }
  },

  showTutorOnMap: function (tutor) {
    var icon = new L.Icon.Default

    if (tutor.photo && tutor.photo.url) {
      icon = L.icon({
        className: 'photo-icon',
        iconUrl: tutor.photo.url,
        iconSize: [50, 50],
        popupAnchor: [4, -25]
      })
    }

    var marker = L.marker(tutor.location.coords, {
      title: tutor.name,
      icon: icon
    })

    marker.bindPopup(Template.profilePopup(tutor))

    marker.addTo(App.map)

    App.markers.push(marker)
  },

  normalizeCoords: function (coords) {
    return {
      lat: App.trimTo(coords.lat, 6),
      lng: App.trimTo(coords.lng, 6)
    }
  },

  trimTo: function (number, decimalPlaces) {
    return parseFloat(number.toFixed(decimalPlaces))
  },

  type: function (word, cb, done) {
    var index = 1
    var interval = setInterval(function () {

      cb(word.substring(0, index))

      index++

      if (index > word.length) {
        clearInterval(interval)
        if ($.isFunction(done)){
          done(word)
        }
      }
    }, 100)
  },

  mailto: function (opts) {
    return 'mailto:' + opts.email + "?subject=" + opts.subject.replace(/ /g, '%20') + '&body=' + opts.body.replace(/ /g, '%20')
  }
}