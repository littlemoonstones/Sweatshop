<template>
  <div id="home">
    <div id="drag" style="-webkit-app-region: drag">
      <div class="control">
        <div class="control-btn close-button" @click="closed"></div>
        <div class="control-btn min-button" @click="minimize"></div>
        <div class="control-btn about-button"  @click="about"></div>
      </div>
    </div>
    <div class="main">
      <DragDrop v-if="getFilesBool == false"></DragDrop>
      <Chart v-else></Chart>
    </div>
  </div>
</template>

<script>
import DragDrop from "./DragDrop";
import Chart from "./Chart";
import { mapGetters } from "vuex";
const { ipcRenderer } = require("electron");


// const win = remote.getCurrentWindow();

export default {
  name: "home",
  data() {
    return {
      
    };
  },
  components: {
    DragDrop,
    Chart,
  },
  methods: {
    minimize() {
      ipcRenderer.send("minimize");
    },
    closed() {
      ipcRenderer.send("closed");
    },
    about(){
      console.log('@main: open-about')
      ipcRenderer.send("open-about");
    }
  },
  computed: {
    ...mapGetters(["getFilesBool"]),
  },
  mounted() {
    this.$store.dispatch("setFilesBoolFalse");
  },
};
</script>

<style>
@font-face {
    font-family: 'NotoSans';
    src: url('../assets/font/NotoSans-Regular.ttf');
}
*{
  font-family: NotoSans;
}
#drag {
  /* border: 1px solid blue; */
  width: 100%;
  height: 30px;
  position: fixed;
  z-index: 10;
  top: 0;
  left: 5px;
}
.control-btn {
  display: inline-block;
  position: relative;
  top: 0;
  transform: translateY(50%);
  margin-left: 5px;
}
.control {
  /* border: 1px solid red; */
  position: relative;
  top: 0;
  left: 0;
  height: 100%;
  width: 100px;
}
.about-button {
  width: 11px;
  height: 11px;
  background-color: rgb(143, 143, 143);
  border: 0.5px solid rgb(61, 61, 61);
  border-radius: 100%;
  -webkit-app-region: no-drag;
}
.close-button {
  width: 11px;
  height: 11px;
  background-color: #ff605c;
  border: 0.5px solid rgb(179, 53, 50);
  border-radius: 100%;
  -webkit-app-region: no-drag;
}
.min-button {
  width: 11px;
  height: 11px;
  background-color: #ffbd44;
  border: 0.5px solid rgb(222, 162, 53);
  border-radius: 100%;
  -webkit-app-region: no-drag;
}
</style>
