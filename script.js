const API = 'https://api.hel.fi/linkedevents/v1/'
const API_EVENT = API + 'event'
const API_KEY = 'API_KEY123'

var DS = {
  getEvents: function(params, callback) {
    var request_params = {}
    _.merge(request_params, {
      api_key: API_KEY
    }, params)
    axios({
        method: 'get',
        url: API_EVENT,
        params: request_params
      })
      .then(function(response) {
        var eventsData = response.data.data
        var locationsUrlList = []
        var locationsDependencyHash = {}
        //build dependency hash
        _.forEach(eventsData, function(event) {
          locationsUrlList.push(event.location["@id"])
        })
        locationsUrlList = _.uniq(locationsUrlList)
        //build promises array of dependent locations
        promises = _.map(locationsUrlList, function(url){
          return axios({
            method: 'get',
            url: url
          })
        })
        //retrieve dependent locations and add them to response data
        Promise.all(promises)
          .then(promiseResponses => {
            console.log(promiseResponses)
            // fill the dependency hash
            _.forEach(promiseResponses, function(promiseResponse) {
              locationsDependencyHash[promiseResponse.data["@id"]] = promiseResponse.data
            })
            // this changes the content of response.data.data - im not sure about this solution, it might be refactored to more functional way
             _.map(eventsData, function(event) {
              event.location = locationsDependencyHash[event.location["@id"]]
            })
            // run callback
            callback(response.data)
          })
      })
      .catch(function(error) { callback(error) })
  }
}

var app = new Vue({
  el: '#app',
  data: {
    name: 'Vue.js',
    events: ''
  },
  methods: {
    greet: function(event) {
      var vm = this
      vm.somedata = 'loading...'
      DS.getEvents({}, function(data) {
        vm.events = data.data
      })
    }
  }
})
