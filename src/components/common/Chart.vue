<template>
<v-container fluid>
  <div class="svgContainer"></div>
</v-container>
</template>

<style lang="css">
.rootDom {
  background-color: #BDBDBD;
  height: 100%;
  font-size: 50px;
  border: 1px solid #BDBDBD;
  border-radius: 25px;
  justify-content: start;
  align-items: center;
  display: flex;
}

.domKrStyle {
  position: relative;
  height: 100%;
  background-color: #90CAF9;
  color: black;
  border: 1px solid #039BE5;
  border-radius: 25px;

  * {
    display: inline-block;
    font-weight: bold;
    font-size: 40px;
  }
}

.domStyle {
  position: relative;
  height: 100%;
  background-color: white;
  color: black;
  border: 1px solid #039BE5;
  border-radius: 25px;

  * {
    display: inline-block;
    font-weight: bold;
    font-size: 40px;
  }
}

.chart-title {
  position: absolute;
  left: 30px;
  top: 40px;
  width: 250px;
}

.chart-progress {
  position: absolute;
  display: flex;
  right: 0px;
  width: 100px;
  height: 90px;
  align-items: center;
  justify-content: center;
  color: #29B6F6;
  border: 4px solid #039BEE;
  border-radius: 0px 20px 0px 50px;
}

.chart-user {
  position: absolute;
  display: flex;
  bottom: 30px;
  left: 30px;
  align-items: center;
}

.chart-avatar {
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-user-name {
  padding-left: 10px;
  font-size: 30px;
}
.label-cycle {
  background-color: lightGrey;
  padding: 20px;
  border-radius: 40px;
}
</style>

<script>
import OrgTree from "d3-org-tree";
const d3 = require("d3")
export default {
  name: "Chart",
  props: ["data", "isHorizontal"],
  computed: {
    orientation: function() {
      return this.isHorizontal ? "left-to-right" : "top-to-bottom"
    }
  },
  data() {
    return {
      chartReference: null,
      orientations: ["top-to-bottom", "bottom-to-top", "left-to-right", "right-to-left"],
      straights: [{
        text: "straight",
        value: true
      }, {
        text: "curve",
        value: false
      }],
      straight: {
        text: "curve",
        value: false
      },
      displayArrow: false,
      straightLink: false,
    };
  },
  watch: {
    data(value) {
      this.renderChart(value);
    }
  },
  mounted() {
    this.renderChart(this.data)
  },
  methods: {
    renderChart(data) {
      if (!this.chartReference) {
        this.chartReference = new OrgTree();
      }
      this.chartReference
        .container('.svgContainer')
        .backgroundColor("#E0E0E0")
        // .svgWidth(1600)
        .svgHeight(800)
        .data(data)
        .highlight({
            "borderWidth": 20,
            "borderRadius": 15,
            "borderColor": {"red": 50,"green": 255,"blue": 30,"alpha": 1},
            "backgroundColor": {"red": 20,"green": 100,"blue": 40,"alpha": 1}
        })
        .linkColor({
          "red": 110,
          "green": 110,
          "blue": 108,
          "alpha": 0.6
        })
        .current(null)
        .displayArrow(this.displayArrow)
        .straightLink(this.straightLink)
        .initialZoom(.2)
        .orientation(this.orientation)
        .collapsible(true)
        .onNodeClick(d => {
          this.$emit('pick', d.slice(3))
        })
        .onNodeAdd(d => {
          this.chartReference.addNode(fetchDataMock())
        })
        .onNodeRemove(d => {
          this.chartReference.removeNode(d)
        })
        .render()
    },
    transformLayout(direction) {
      this.chartReference.transformLayout(direction)
    },
    transformStraightLink(straight) {
      this.chartReference.transformStraightLink(straight)
    },
    toggleArrow(displayArrow) {
      this.chartReference.toggleArrow(displayArrow)
    }
  }
}
</script>
