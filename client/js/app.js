App = {

  api: '/api',

  geocoder: function () {
    return L.mapbox.geocoder('tutorwire.map-rbl1tiup')
  },

  // mimic the leaflet api whilst we test the service
  cloudmadeGeocoder: function() {

    var boundingBox = '-10.8,49.9;2.4,58.9'

    var queryUrl = "http://beta.geocoding.cloudmade.com/v3/db4b882af0804530bea000fe6823639d/api/geo.location.search.2?format=json&source=OSM&enc=UTF-8&limit=5&bbox=-10.8,49.9;2.4,58.9&locale=en&q=[country=United%20Kingdom]%20"

    return {
      query: function(term, cb /*err, response*/){
        var url = queryUrl + encodeURI(term)  + '&callback=?'
        console.log('Querying cloudmade geocoder', term)
        $.getJSON(url, function(data){
          console.log('Cloudmade returned', data)
          var place = data.places[0]
          var response = {
            latlng: [place.position.lat, place.position.lon]
          }

          cb(null, response)
        })
      }
    }
  },

  mapquestGeocoder: function(){
    var boundingBox = '-10.8,58.9,2.4,49.9'
    var queryUrl = "http://www.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluur21u7n9%2C7x%3Do5-90txlu&inFormat=kvp&outFormat=json&maxResults=5&boundingBox=-10.8,58.9,2.4,49.9&thumbMaps=false&adminArea1=UK&location="
    return {
      query: function(term, cb){
        var url = queryUrl + encodeURI(term) + ',UK' + '&callback=?'
        console.log('Querying mapquest geocoder', term)
        $.getJSON(url, function(data){
          console.log('mapquest returned', data)
          var place = data.results[0].locations[0]
          var response = {
            latlng: [place.latLng.lat, place.latLng.lng]
          }

          cb(null, response)
        })
      }
    }
  },

  map: null,

  initMap: function (id) {
    if (App.map) return App.map

    id = id || 'map'

    var map = App.map = L.mapbox.map(id, 'tutorwire.map-rbl1tiup',{
      attributionControl: false,
      minZoom: 6
    })

    map.zoomControl.setPosition('bottomright')
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

    App.userMarker = L.marker(location.coords, {icon: icon, title: 'You are here', bounceOnAdd: true})

    App.userMarker.addTo(App.map)

    App.map.setView(location.coords, 11)
  },

  /**
   * @param {Object} [opts]
   * @param {Boolean} [opts.force] Set true to ignore cached location data (if exists)
   * @param {Number} [opts.timeout] Max time to spend searching for user location in ms
   * @param {Function} [cb]
   * @returns {*}
   */
  locateUser: function (opts, cb) {
    if (typeof opts == "function") {
      cb = opts
      opts = {}
    } else {
      opts = opts || {}
    }

    opts.force = opts.force || false
    opts.timeout = opts.timeout || 5000

    cb = cb || function () {}

    if (App.location && !opts.force) return cb(null, App.location)

    var timeoutId = null

    function onLocationFound (e) {
      clearTimeout(timeoutId)

      App.geocoder().reverseQuery(e.latlng, function (er, response) {
        if (er) console.warn("Failed to geocode", e.latlng, er)

        // response looks like: {"query":[-0.0801,51.4657],"results":[[{"bounds":[-0.523222999999989,51.27866,0.336112,51.72023],"lat":51.5040006418191,"lon":-0.109467698133307,"name":"London","score":900001728809196.6,"type":"place","id":"mapbox-places.219827"},{"bounds":[-0.107894862857551,51.4191873235362,-0.0231455141541109,51.51158478481],"lat":51.4653860541731,"lon":-0.0636831061709452,"name":"Southwark","score":30926433.0294826,"type":"province","id":"province.2903"},{"bounds":[-13.6913559567794,49.9096161909876,1.77170536308596,60.8475532028857],"lat":54.3177967325959,"lon":-1.91064039912679,"name":"United Kingdom","population":61113205,"type":"country","id":"country.152"}]],"attribution":{"mapbox-places":"<a href='http://mapbox.com/about/maps' target='_blank'>Terms & Feedback</a>"}}
        App.location = {
          name: er ? "Unknown" : response.results[0][0].name,
          coords: App.normalizeCoords(e.latlng)
        }

        cb(null, App.location)
      })
    }

    App.map.once("locationfound", onLocationFound)

    timeoutId = setTimeout(function () {
      App.map.off("locationfound", onLocationFound)
      cb(new Error("Timed out whilst locating user"))
    }, opts.timeout)

    App.map.locate()
  },

  markers: {},

  clearMarkers: function () {
    console.log('Clearing markers', App.markers)
    Object.keys(App.markers).forEach(function (tutorId) {
      App.map.removeLayer(App.markers[tutorId])
    })
    App.markers = {}
  },

  /**
   * Clear markers on the map that don't belong to one of the tutors in the provided list
   * @param tutors
   */
  clearExitingMarkers: function (tutors) {
    var tutorIds = tutors.map(function (t) { return t._id })

    Object.keys(App.markers).forEach(function (tutorId) {
      if (tutorIds.indexOf(tutorId) == -1) {
        App.map.removeLayer(App.markers[tutorId])
        delete App.markers[tutorId]
      }
    })
  },

  showTutorsOnMap: function (tutors) {
    console.log('Showing tutors on map', tutors)
    for (var i = 0; i < tutors.length; i++) {
      App.showTutorOnMap(tutors[i])
    }
  },

  /**
   * Show tutors on the map that don't already have a marker.
   * @param tutors
   */
  showEnteringTutorsOnMap: function (tutors) {
    console.log('Showing entering tutors on map', tutors)
    for (var i = 0; i < tutors.length; i++) {
      if (!App.markers[tutors[i]._id]) {
        App.showTutorOnMap(tutors[i])
      }
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

    var lngLat = tutor.location.geometry.coordinates
    var marker = L.marker([lngLat[1], lngLat[0]], {
      title: tutor.name,
      icon: icon,
      bounceOnAdd: true
    })

    marker.bindPopup(Template.profilePopup(tutor), {maxWidth: 200})

    marker.addTo(App.map)

    App.markers[tutor._id] = marker
  },

  normalizeCoords: function (coords) {
    if (coords.geometry) {
      return {
        lat: coords.geometry.coordinates[1],
        lng: coords.geometry.coordinates[0]
      }
    }
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