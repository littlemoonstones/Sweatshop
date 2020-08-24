
<template>
  <div id="wrapper" :class="{ dragging: isDragging }">
    <b-alert
    class="alert-dialog"
      :show="dismissCountDown"
      dismissible
      variant="danger"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
    <div v-if="dismissShow==true">Warning: Your selected {{ file_number }} files.</div>
    <div v-else>Wrong file extension</div>
    </b-alert>
    <div class="drag-font">
      <b-icon-download scale="2" />
      <p>Drag your file here</p>
    </div>
    <div
      class="uploader"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover.prevent
      @drop="onDrop"
    ></div>

    <!-- <div v-if="file_name != ''">
      <p>File Name: {{ file_name }}</p>
      <p>Extension: {{ file_extension }}</p>
    </div>-->
  </div>
</template>

<script>
import readFileSync from "../assets/loading-file";
import path from "path";
import { mapGetters } from "vuex";
const { ipcRenderer } = require("electron");

export default {
  name: "home",
  components: {},
  data() {
    return {
      isDragging: false,
      dragCounter: 0,
      file_name: "",
      file_extension: "",
      file_number: 0,
      dismissShow: true,
      dismissSecs: 3,
      dismissCountDown: 0,
    };
  },
  computed: {
    ...mapGetters(["getPath"]),
  },
  methods: {
    countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert() {
        this.dismissCountDown = this.dismissSecs
      },
    onDragEnter(e) {
      e.preventDefault();
      this.isDragging = true;
      // this.dragCounter++;
      console.log("enter");
      // return false;
    },
    onDragLeave(e) {
      e.preventDefault();
      this.dragCounter -= 10;
      if (this.dragCounter <= 0) {
        // this.isDragging = false;
      }
      this.isDragging = false;
      console.log("leave");
    },
    onDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      this.isDragging = false;
      const files = e.dataTransfer.files;
      this.file_number = files.length
      if (this.file_number > 0) {
        // console.log(files[0].path);
        // const content = readFileSync(files[0].path)
        if (this.file_number > 1) {
          this.dismissShow = true
          this.showAlert()
        } else {
          let file_path = files[0].path;          
          this.file_name = path.basename(file_path);
          this.file_extension = path.extname(file_path);

          // Check file extension if .txt or .时间序列
          if(this.file_extension == '.txt' || this.file_extension == ".时间序列"){
            this.$store.dispatch("readData", file_path);
            this.$store.dispatch("setFilesBoolTrue");
            ipcRenderer.send("setWindowSizeChart");
          }
          // show Error
          else{
            this.dismissShow = false;
            this.showAlert()
          }

          
        }
      }
      console.log(files);
    },
  },
  mounted() {
    this.$store.dispatch("cleanData");
  },
};
</script>ƒ

<style scoped>
#wrapper {
  position: relative;
  background-color: white;
  width: 600px;
  height: 620px;
}
.uploader {
  width: 100%;
  height: 580px;
  position: absolute;
  outline: 10px dashed black;
  outline-offset: -30px;
  top: 20px;
  /* transform: translateY(-20px); */
  /* 960x960 */
}

.no-drag {
  /* border: 10px dashed rgba(76, 175, 79, 0.3); */
  border-radius: 10px;
}

#wrapper.dragging {
  background-color: grey;
  /* outline: 10px dashed white; */
  /* border: 10px dashed #4caf50 !important; */
  transition: background-color 0.3s ease;
}

.dragging .drag-font {
  color: white;
}
.dragging .uploader{
  outline: 10px dashed white;
  transition: background-color 0.3s ease;
}

.drag-font {
  width: 100%;
  text-align: center;
  color: black;
  font-size: 50px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.alert-dialog{
  position: absolute;
  width: 100%;
  z-index: 100;
  /* border: lightcoral 2px solid; */
  top: 0;
}
</style>
