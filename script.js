var api = 'https://jsonplaceholder.typicode.com';

var DS = new Vue({
  methods: {
    getIndex: function(){
      axios.get(api + '/posts/1')
        .then(function (response) {
          return response
        })
        .catch(function (error) {
          return error
        })
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    name: 'Vue.js',
  },
  // define methods under the `methods` object
  methods: {
    greet: function (event) {
      //boundFn - should return object instead
      var data = DS.getIndex
      console.log(data)
    }
  }
})
