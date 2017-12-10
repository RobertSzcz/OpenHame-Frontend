const API = 'https://api.hel.fi/linkedevents/v1/'
const API_EVENT = API + 'event'
const API_SEARCH = API + 'search'
// const API_KEY = 'API_KEY123'
// Initialize datepicker as global component
Vue.component('date-picker', VueFlatpickr);

var DS = {
  getEvents: function(params, callback) {
    // var request_params = {}
    // _.merge(request_params, {
    //   api_key: API_KEY
    // }, params)
    axios({
        method: 'get',
        url: API_EVENT,
        // removes empty keys
        params: _.pickBy(params, _.identity)
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
        promises = _.map(locationsUrlList, function(url) {
          return axios({
            method: 'get',
            url: url
          })
        })
        //retrieve dependent locations and add them to response data
        Promise.all(promises)
          .then(promiseResponses => {
            //  console.log(promiseResponses)
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
      .catch(function(error) {
        callback(error)
      })
  },
  getSearch: function(callback) {
    axios({
        method: 'get',
        url: API_SEARCH,
      })
      .then(function(response) {
        callback(response.data)
      })
      .catch(function(error) {
        console.log(error)
        callback(error)
      })
  }
}

var searchForm = new Vue({
  el: '#searchForm',
  data: {
    start: null,
    end: null,
    division: '',
    location: '',
    text: '',
    ascending: '',
    orderBy: '',
    location: '',
    config: {
      altInput: true
    }
  },
  methods: {
    getResults: function(event) {
      var vm = this
      console.log(_.omit(vm.$data, ['config']))
      eventsResult.getResults(
        _.omit(vm.$data, ['config'])
      )
    }
  }
})

var eventsResult = new Vue({
  el: '#eventsResult',
  data: {
    events: ''
  },
  methods: {
    getResults: function(params) {
      var vm = this
      DS.getEvents(params, function(data) {
        vm.events = data.data
      })
    }
  }
})
