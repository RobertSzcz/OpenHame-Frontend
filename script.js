const API = 'https://jsonplaceholder.typicode.com'
const API_KEY = 'API_KEY123'

var DS = {
  getIndex: function(params, callback) {
    var request_params = {}
    _.merge(request_params, {
      api_key: API_KEY
    }, params)
    axios({
        method: 'get',
        url: API + '/posts/1',
        params: request_params
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
    name: 'Vue.js',
    somedata: ''
  },
  methods: {
    greet: function(event) {
      var vm = this
      vm.somedata = 'loading...'
      DS.getIndex({
        test_param: 1
      }, function(data) {
        vm.somedata = data
      })
    }
  }
})
