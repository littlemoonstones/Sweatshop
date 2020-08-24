<template>
  <div id="about">
    <div id="drag" style="-webkit-app-region: drag">
      <div class="control">
        <div class="control-btn close-button" @click="closed"></div>
      </div>
    </div>
    <div id="sweatshop">
            <div>
                <!-- <img src="./assets/icon/icon.png" alt=""> -->
                <div class="img"></div>
                <div class="title">Sweatshop</div>
            </div>
            <div class="info">
                <div class="info-row">
                    <div class="title-key">Version</div>
                    <div class="value">0.1</div>
                </div>
                <div class="info-row">
                    <div class="title-key">Author</div>
                    <div class="value">Cary</div>
                </div>
            </div>
        </div>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
export default {
  name: "about",
  components: {},
  methods: {
    closed() {
      ipcRenderer.send("closed-about");
    },
  },
};
</script>

<style scoped>
@font-face {
    font-family: 'sweatshop';
    src: url('../assets/font/BalsamiqSans-Regular.ttf');
}
#about {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  background-color: black;
}
#sweatshop {
    width: 100%;
    margin-top: 30px;
}

#sweatshop img {
    /* border: 1px solid red; */
    position: relative;
    /* left: 50%;
    transform: translateX(-50%); */
    width: 200px;
    display: block;
    margin: auto;
}

.img {
    /* border: 1px solid red; */
    height: 200px;
    width: 200px;
    background-image: url('../../../static/icon.png');
    /* position: relative; */
    margin: auto;
}

.title {
    text-align: center;
    font-size: 32px;
    font-family: sweatshop !important;
    color: white;
}

.info {
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    margin-top: 20px;
    margin-left: 20px;
}

.info-row {
    display: inline-flex;
    width: 100%;
    /* border: 3px solid brown; */    
    margin: 5px 0px;
}
.info-row div{
    padding: 2px 1.5px;
}
.title-key {
    border-radius: 10px 0px 0px 10px;
    background-color: white;
    color: black;
    width: 80px;
    text-align: center;
    margin-left: 20px;
}

.value {
    width: 60%;
    text-align: left;
    margin-left: 10px;
    color: white;
}
</style>
