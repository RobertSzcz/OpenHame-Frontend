const API = 'https://api.hel.fi/linkedevents/v1/'
const API_EVENT = API + 'event'
const API_PLACE = API + 'place'
const API_KEY = 'API_KEY123'

var DS = {
  getEvents: function(params, callback) {
	axios({
        method: 'get',
        url: API_EVENT,
        params: params
      })
      .then(function(response) {
        callback(response.data)
      })
      .catch(function(error) {
        console.log(error)
        callback(error)
      })
  },

  getPlaces: function(callback) {
    axios({
        method: 'get',
        url: API_PLACE,
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

var app = new Vue({
  el: '#app',
  data: {
    division: '',
    text: '',
    start: '',
    end: '',
    events: ''
  },
  methods: {
    greet: function(event) {
      var vm = this
      vm.somedata = 'loading...'
      DS.getEvents({division:vm.division, text:vm.text, start:vm.start, end:vm.end}, function(data) {
        vm.events = data.data
      })
	  
	  
	  
	  
    }
  }
})