const API = 'https://api.hel.fi/linkedevents/v1/'
const API_EVENT = API + 'event'
const API_PLACE = API + 'place'
const API_SEARCH = API + 'search'
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
var searchElement = new Vue({
  el: '#searchElement',
  data: {
    division: '',
    location: '',
    text: '',
    start: '',
    ascending: '',
    orderBy: '',
    end: ''
  },
  methods: {
    greet: function(event) {
		resultElement.getResults();
    }
  },
  watch: {
    location: function(val, oldVal) {
		//get suggestions
	  resultElement.getSuggestion("place",val);
    }
  }

})
var resultElement = new Vue({
  el: '#resultElement',
  data: {
    events: ''
  },
  methods: {
    getResults: function(event) {
		
      var vm = this
      vm.somedata = 'loading...'
      DS.getEvents({division:searchElement.division, location:searchElement.location, text:searchElement.text, start:searchElement.start, end:searchElement.end}, function(data) {
        vm.events = data.data
      })
    },
	    getSuggestion: function(type,val) {
		
		//search/?type=place&input=sibe
      DS.getSearch({type:type, input:val}, function(data) {
        //vm.events = data.data
		console.log(data.data);
      })
    }
  }
})