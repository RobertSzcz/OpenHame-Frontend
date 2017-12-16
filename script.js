const API = 'https://api.hel.fi/linkedevents/v1/'
const API_EVENT = API + 'event'
const API_SEARCH_EVENT = API + 'search?type=event'
const API_SEARCH_PLACE = API + 'search?type=place'
// const API_KEY = 'API_KEY123'
// Initialize datepicker as global component
Vue.component('date-picker', VueFlatpickr);

var DS = {
  // should be DRY-ed after presentation
  getEventsByUrl: function(url, callback) {
    axios({
        method: 'get',
        url: url,
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

  getEvents: function(params, callback) {
    // var request_params = {}
    // _.merge(request_params, {
    //   api_key: API_KEY
    // }, params)
    var url = params.q ? API_SEARCH_EVENT : API_EVENT
    if (params.location) {
      locationPromise = new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: API_SEARCH_PLACE,
          params: {input: params.location}
        }).then(function(response){
          var locationId = response.data.data[0].id
          console.log(locationId)
          resolve(locationId)
        }).catch(function(error){
          console.log(error)
          reject()
        })
      })
    } else {
      locationPromise = Promise.resolve()
    }
    locationPromise.then(location => {
      requestParamsWithoutLocation = _.omit(params, ['location'])
      requestParams = _.pickBy(requestParamsWithoutLocation , _.identity)
      location ? requestParams.location = location : null
      axios({
          method: 'get',
          url: url,
          // removes empty keys
          params: requestParams
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
    })
  }
}

var searchForm = new Vue({
  el: '#searchForm',
  data: {
    start: null,
    end: null,
    page: 1,
    division: '',
    location: '',
    q: '',
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
    events: '',
    metaData: '',
    pageCount: 0,
    pageNumber: null,
    previous: '',
    next: ''
  },
  methods: {
    getResults: function(params) {
      var vm = this
      DS.getEvents(params, function(data) {
        console.log(data.meta)
        vm.events = data.data
        vm.metaData = data.meta
        vm.pageCount = Math.ceil((vm.metaData.count / 20)) //This returns the total number of pages
        data.meta.previous ? vm.previous = data.meta.previous : null
        data.meta.next ? vm.next = data.meta.next : null
        console.log("Total number of pages:", vm.pageCount)
      })
    },
    // to DRY
    getPreviousPage: function(){
      var vm = this
      DS.getEventsByUrl(vm.previous, function(data) {
        console.log(data.meta)
        vm.events = data.data
        vm.metaData = data.meta
        vm.pageCount = Math.ceil((vm.metaData.count / 20)) //This returns the total number of pages
        data.meta.previous ? vm.previous = data.meta.previous : null
        data.meta.next ? vm.next = data.meta.next : null
        console.log("Total number of pages:", vm.pageCount)
      })
    },
    getNextPage: function(){
      var vm = this
      DS.getEventsByUrl(vm.next, function(data) {
        console.log(data.meta)
        vm.events = data.data
        vm.metaData = data.meta
        vm.pageCount = Math.ceil((vm.metaData.count / 20)) //This returns the total number of pages
        data.meta.previous ? vm.previous = data.meta.previous : null
        data.meta.next ? vm.next = data.meta.next : null
        console.log("Total number of pages:", vm.pageCount)
    })
  },
  formatDate: function(unformatted) {
	if (unformatted) {
		date = new Date(unformatted);
		var result = (date.getDate()<10?'0':'') + date.getDate()+"."+(date.getMonth()<10?'0':'') + date.getMonth()+'.'+date.getFullYear()+" "+(date.getHours()<10?'0':'') + date.getHours()+"."+(date.getMinutes()<10?'0':'') + date.getMinutes();
		return result
	}
  }}
})
