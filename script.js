var api = 'https://jsonplaceholder.typicode.com';

var DS = {
  getIndex: function(params, callback){
    axios.get(api + params)
      .then(function (response) {
        callback(response.data)
      })
      .catch(function (error) {
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
    greet: function (event) {
      vm = this
      DS.getIndex('/posts/1', function(data){
        vm.somedata = data
      })
      console.log(vm.somedata)
    }
  }
})
