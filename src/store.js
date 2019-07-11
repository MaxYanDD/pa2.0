import Vue from 'vue'

const store = Vue.observable({
  Toolbar:{
    fillColor: "#409EFF",
    borderColor: "#409EFF",
    selectedFontSize: '',
    selectedFontFamily: ''
  }
})

export default store