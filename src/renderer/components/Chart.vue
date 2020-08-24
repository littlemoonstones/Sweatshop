<template>
  <div id="chart">
    <!-- <h1>{{ $store.getters.getData.d3js }}</h1> -->
    <b-container fluid class="p-0 mt-4">
      <!-- <h2>hello {{ global_result.pecd.process }}</h2> -->
      <div id="data"></div>
    </b-container>
    <!-- <h2>{{ getData }}</h2> -->
    <b-col cols="12" class="text-center mb-3">
      <b-button variant="warning" @click="reset">Reset</b-button>
    </b-col>
  </div>
</template>

<script>
import * as d3 from "d3";
import path from "path";
import Results from "../assets/js.js";
import readFileSync from "../assets/loading-file";
import { mapGetters } from "vuex";
const { ipcRenderer } = require("electron");
// const ipc = require('electron').ipcMain
// const chart = require("../assets/js")
var results = {};

results["pecd"] = {};
var xScale1;
var yScale1;

var margin = {
  left: 75,
  top: 50,
  right: 50,
  bottom: 400,
};
var margin2 = {
  left: 75,
  top: 600,
  right: 50,
  bottom: 50,
};
var height = 900,
  width = 960;
var innerWidth = width - margin.left - margin.right,
  innerHeight = height - margin.top - margin.bottom,
  innerHeight2 = height - margin2.top - margin2.bottom;
export default {
  name: "chart",
  components: {},
  data() {
    return {
      //   people: this.$store.state.Counter.main,
      global_result: results,
      // datas: this.$store.getters.getData
    };
  },
  watch: {
    "global_result.pecd": function () {
      // console.log("pecd change");
      this.$store.dispatch("updateData", this.global_result["pecd"]);
      let process = this.global_result["pecd"]["process"];
      let time =
        Math.round(this.global_result["pecd"]["response_time"] * 100000 + 0.5) /
        100000;
      process = process.split(" ->");
      // console.log(process);
      d3.select("#title").text(process.join(" → "));

      d3.select("#title-response").text(time + " s");
    },
    getData: function (new_value, old_value) {
      console.log("new: ", new_value, ", old: ", typeof old_value.main);
      if (typeof new_value.d3js != "undefined") {
        // this.drawLineChart(this.getData);
        // console.log('@watch-getData: ', d3.max(new_value.d3js))
        // console.log('@watch-getData: ', d3.max(new_value.d3js, (d) => parseFloat(d.Time)))
      }
    },
  },
  methods: {
    saveRecord(event) {
      if (event.keyCode === 13) {
        this.$store.dispatch("addRecord");
      }
      if (event.keyCode == 78) {
        ipcRenderer.send("open-child");
        console.log("open-child");
      }
    },
    reset() {
      this.$store.dispatch("setFilesBoolFalse");
      this.$store.dispatch("clean");
      ipcRenderer.send("setWindowSizeDrag");
    },
    drawLineChart(meta_data) {
      const svg = d3.select("svg");

      const render = (datas) => {
        // down
        let cal_data = datas.main;
        let datas__ = datas.d3js;

        const xScale2 = d3.scaleLinear().range([0, innerWidth]);

        const yScale2 = d3.scaleLinear().range([innerHeight2, 0]);

        // up
        const xScale = d3.scaleLinear().range([0, innerWidth]);

        const yScale = d3.scaleLinear().range([innerHeight, 0]);

        xScale2.domain([0, d3.max(datas__, (d) => parseFloat(d.Time))]);
        yScale2.domain([
          0,
          d3.max(datas__, (d) => parseFloat(d.Transmittance)) + 1,
        ]);

        xScale.domain(xScale2.domain());
        yScale.domain(yScale2.domain());

        const line = d3
          .line()
          .x((d) => xScale(d.Time))
          .y((d) => yScale(d.Transmittance));

        const line2 = d3
          .line()
          .x((d) => xScale2(d.Time))
          .y((d) => yScale2(d.Transmittance));

        const yAxis = d3.axisLeft().scale(yScale).tickSizeOuter(0);

        const xAxis = d3.axisBottom().scale(xScale).tickSizeOuter(0);

        const yAxis2 = d3.axisLeft().scale(yScale2).tickSizeOuter(0);

        const xAxis2 = d3.axisBottom().scale(xScale2).tickSizeOuter(0);

        var zoom = d3
          .zoom()
          .scaleExtent([1, 1000])
          .translateExtent([
            [0, 0],
            [innerWidth, innerHeight],
          ])
          .extent([
            [0, 0],
            [innerWidth, innerHeight],
          ])
          .on("zoom", zoomed);

        var brush = d3
          .brushX()
          .extent([
            [0, 0],
            [innerWidth, innerHeight2],
          ])
          .on("brush end", brushed);

        console.log("@d3-context");
        const context = svg
          .append("g")
          .attr("id", "group")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const focus = svg
          .append("g")
          .attr("class", "focus")
          .attr("transform", `translate(${margin2.left}, ${margin2.top})`);

        focus
          .append("path")
          .attr("class", "line")
          .attr("d", line2(datas__))
          .attr("fill", "none")
          .attr("stroke", "blue");

        focus
          .append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + innerHeight2 + ")")
          .call(xAxis2);

        focus.append("g").call(yAxis2);

        focus
          .append("g")
          .attr("class", "brush")
          .call(brush)
          .call(brush.move, xScale2.range());

        context
          .append("g")
          .call(yAxis)
          .attr("class", "axis axis--y")
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", 0 - innerHeight / 2)
          .attr("y", 20 - margin.left)
          .attr("dy", "1em")
          .attr("fill", "#000")
          .attr("font-size", "12pt")
          .attr("font-weight", "bold")
          .attr("text-anchor", "middle")
          .text("Transmittance(%)");

        context
          .append("g")
          .attr("transform", `translate(0, ${innerHeight})`)
          .attr("class", "axis axis--x")
          .call(xAxis)
          .append("text")
          .attr("x", innerWidth / 2)
          .attr("y", 22)
          .attr("dy", "1em")
          .attr("fill", "#000")
          .attr("font-size", "12pt")
          .attr("font-weight", "bold")
          .attr("text-anchor", "middle")
          .text("Times(s)");

        // 切掉超過範圍的線
        context
          .append("defs")
          .append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("width", innerWidth)
          .attr("height", innerHeight);

        //line chart
        context
          .append("path")
          .attr("d", line(datas__))
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke", "red")
          .attr("clip-path", "url(#clip)");

        context
          .append("rect")
          .attr("width", innerWidth)
          .attr("height", innerHeight)
          .style("stroke", "black")
          .style("fill", "none");

        svg
          .append("rect")
          .attr("class", "zoom")
          .attr("width", innerWidth)
          .attr("height", innerHeight)
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          )
          .call(zoom);

        // Title
        svg
          .append("text")
          .attr("id", "title")
          .attr("x", margin.left)
          .attr("y", margin.top / 2 + 10)
          .attr("text-anchor", "left")
          .style("font-size", "30px")
          .text("");

        // Response Time
        svg
          .append("text")
          .attr("x", 630)
          .attr("y", margin.top / 2 + 10)
          .attr("text-anchor", "start")
          .style("font-size", "20px")
          .text("Response time:");
        svg
          .append("text")
          .attr("id", "title-response")
          .attr("x", 910)
          .attr("y", margin.top / 2 + 10)
          .attr("text-anchor", "end")
          .style("font-size", "20px")
          .text("");

        function brushed() {
          if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom")
            return; // ignore brush-by-zoom
          var s = d3.event.selection || xScale2.range();
          xScale.domain(s.map(xScale2.invert, xScale2));
          context.select(".line").attr("d", line(datas__));
          context.select(".axis--x").call(xAxis);
          svg
            .select(".zoom")
            .call(
              zoom.transform,
              d3.zoomIdentity
                .scale(innerWidth / (s[1] - s[0]))
                .translate(-s[0], 0)
            );
          let min = s[0],
            max = s[1];

          // console.log("down: ", {
          //   lower_range: xScale2.invert(min),
          //   upper_range: xScale2.invert(max),
          // });
          results["pecd"] = Results(
            cal_data,
            xScale2.invert(min),
            xScale2.invert(max)
          );
        }
        function zoomed() {
          if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush")
            return; // ignore zoom-by-brush
          var t = d3.event.transform;
          xScale.domain(t.rescaleX(xScale2).domain());
          context.select(".line").attr("d", line(datas__));
          context.select(".axis--x").call(xAxis);
          focus
            .select(".brush")
            .call(brush.move, xScale2.range().map(t.invertX, t));

          var s = d3.event.selection || xScale2.range();
          let min = s[0],
            max = s[1];

          results["pecd"] = Results(
            cal_data,
            xScale.invert(min),
            xScale.invert(max)
          );

          results["test"] = !results["test"];
        }
      };
      render(meta_data);
    },
  },
  computed: {
    ...mapGetters(["getData", "getFilesBool"]),
    results_pecd() {
      return results;
    },
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.saveRecord);
  },
  mounted() {
    window.addEventListener("keyup", this.saveRecord);
    if (this.getFilesBool == true) {
      ipcRenderer.send("open-child", (event, error) => {
        console.log("open");
      });
    }

    this.$store.dispatch("clean");

    console.log(`height:${innerHeight}, height2:${innerHeight2}`);

    d3.select("#data")
      .append("svg")
      .style("background-color", "white")
      .attr("width", width)
      .attr("height", height);

    this.drawLineChart(this.getData);
  },
};
</script>


<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.zoom {
  cursor: move;
  fill: none;
  pointer-events: all;
}
</style>
