<template>
  <div id="result">
    <div id="drag" style="-webkit-app-region: drag">
      <div class="control">
        <div class="control-btn close-button" @click="closed"></div>
      </div>
    </div>
    <b-container class>
      <!-- {{ windowHeight }} -->
      <b-row>
        <!-- Coloring -->
        <b-col md="6" class="px-3">
          <h2 class="leader">
            &tau;
            <sub>c</sub>
          </h2>
          <div class="height" :style="'height:'+showHeight+'px'">
            <div v-for="(data, index) in getColorData" :key="'coloring-'+index">
              <!-- Using value -->
              <b-button
                v-b-toggle="'coloring-collapse-'+index"
                block
                variant="success"
                class="mt-2"
              >{{ Math.round(data.response_time*100000+0.5)/100000 }}</b-button>

              <!-- Element to collapse -->
              <b-collapse :id="'coloring-collapse-'+index">
                <b-card border-variant="success">
                  <!-- {{ data }} -->

                  <b-row class="mb-3">
                    <b-col cols="12" class="font-weight-bold">Time(s)</b-col>
                    <b-col cols="3" class="text-right">t<sub>0</sub>
                    </b-col>
                    <b-col cols="9">{{ data.initial_time }}</b-col>
                    <b-col cols="3" class="text-right">t<sub>f</sub>
                    </b-col>
                    <b-col cols="9">{{ data.final_time }}</b-col>
                    <b-col cols="3" class="text-right">t<sub>result</sub>
                    </b-col>
                    <b-col cols="9">{{ data.real_time }}</b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12" class="font-weight-bold">Transmittance(%)</b-col>
                    <b-col cols="3" class="text-right">T<sub>0</sub>
                    </b-col>
                    <b-col cols="9">{{ data.initial_transmittance }}</b-col>
                    <b-col cols="3" class="text-right">T<sub>f</sub>
                    </b-col>
                    <b-col cols="9">{{ data.fianl_transmittance }}</b-col>
                    <b-col cols="3" class="text-right">T<sub>cal</sub>
                    </b-col>
                    <b-col cols="9">{{ data.ideal_transmittance }}</b-col>
                    <b-col cols="3" class="text-right">T<sub>result</sub>
                    </b-col>
                    <b-col cols="9">{{ data.real_transmittance }}</b-col>
                    <b-col cols="3" class="text-right">&Delta;T
                    </b-col>
                    <b-col cols="9">{{ data.transmittance }}</b-col>
                  </b-row>
                  
                </b-card>
              </b-collapse>
            </div>
          </div>
        </b-col>

        <!-- Bleaching -->
        <b-col md="6" class="px-3">
          <h2 class="leader">
            &tau;
            <sub>b</sub>
          </h2>
          <div class="height" :style="'height:'+showHeight+'px'">
            <!-- <b-row> -->

            <div v-for="(data, index) in getBleachData" :key="'bleaching-'+index">
              <!-- Using value -->
              <b-button
                v-b-toggle="'bleaching-collapse-'+index"
                block
                variant="primary"
                class="mt-2"
              >{{ Math.round(data.response_time*100000+0.5)/100000 }}</b-button>

              <!-- Element to collapse -->
              <b-collapse :id="'bleaching-collapse-'+index">
                <b-card border-variant="primary">
                  <b-row class="mb-3">
                    <b-col cols="12" class="font-weight-bold">Time(s)</b-col>
                    <b-col cols="3" class="text-right">t<sub>0</sub>
                    </b-col>
                    <b-col cols="9">{{ data.initial_time }}</b-col>
                    <b-col cols="3" class="text-right">t<sub>f</sub>
                    </b-col>
                    <b-col cols="9">{{ data.final_time }}</b-col>
                    <b-col cols="3" class="text-right">t<sub>result</sub>
                    </b-col>
                    <b-col cols="9">{{ data.real_time }}</b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12" class="font-weight-bold">Transmittance(%)</b-col>
                    <b-col cols="3" class="text-right">T<sub>0</sub>
                    </b-col>
                    <b-col cols="9">{{ data.initial_transmittance }}</b-col>
                    <b-col cols="3" class="text-right">T<sub>f</sub>
                    </b-col>
                    <b-col cols="9">{{ data.fianl_transmittance }}</b-col>
                    <b-col cols="3" class="text-right">T<sub>cal</sub>
                    </b-col>
                    <b-col cols="9">{{ data.ideal_transmittance }}</b-col>
                    <b-col cols="3" class="text-right">T<sub>result</sub>
                    </b-col>
                    <b-col cols="9">{{ data.real_transmittance }}</b-col>
                    <b-col cols="3" class="text-right">&Delta;T
                    </b-col>
                    <b-col cols="9">{{ data.transmittance }}</b-col>
                  </b-row>
                </b-card>
              </b-collapse>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const { ipcRenderer } = require("electron");

export default {
  name: "chart-child",
  data() {
    return {
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      margin: 100,
    };
  },
  computed: {
    ...mapGetters(["getBleachData", "getColorData"]),
    checkWidth() {
      return this.windowWidth < 768;
    },
    showHeight() {
      if (this.windowWidth < 768) {
        return Math.round((this.windowHeight - this.margin) / 2);
      }
      return Math.round(this.windowHeight - this.margin);
    },
  },
  methods: {
    onResize() {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
    },
    saveChildRecord(event) {
      if (event.keyCode === 13) {
        this.$store.dispatch("addRecord");
      }
    },
    closed(){
      ipcRenderer.send('closed-child');
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("keyup", this.saveChildRecord);
  },
};
</script>

<style scoped>
.height {
  /* border: 1px solid red; */
  border-bottom: 1px solid grey;
  overflow-y: auto;
  /* height: 50%; */
}
h2.leader {
  text-align: center;
}
ul {
  list-style-position: inside;
}
ul * {
  border: 1px solid red;
}
.group * {
  border: 1px solid red;
}
.list-title,
.list-value {
  display: inline;
}
div.list-title {
  width: 20px;
  color: blue;
}
div.list-value {
  width: 50%;
}
</style>
