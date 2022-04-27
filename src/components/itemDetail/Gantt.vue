<template>
  <div>
    <gantt-elastic :options="options" :tasks="tasks">
      <gantt-header slot="header" ></gantt-header>
    </gantt-elastic>
  </div>
</template>

<style>
</style>

<script>
import GanttElastic from "gantt-elastic";
import GanttHeader from "gantt-elastic-header";
import dayjs from "dayjs";

// just helper to get current dates
function getDate(hours) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const timeStamp = new Date(
    currentYear,
    currentMonth,
    currentDay,
    0,
    0,
    0
  ).getTime();
  return new Date(timeStamp + hours * 60 * 60 * 1000).getTime();
}

let options = {
  taskMapping: {
    progress: "percent",
  },
  maxRows: 100,
  maxHeight: 500,
  title: {
    label: "Your project title as html (link or whatever...)",
    html: false,
  },
  row: {
    height: 24,
  },
  calendar: {
    hour: {
      display: true,
    },
  },
  chart: {
    progress: {
      bar: false,
    },
    expander: {
      display: true,
    },
  },
  taskList: {
    expander: {
      straight: false,
    },
    columns: [
      {
        id: 1,
        label: "ID",
        value: "task_id",
        width: 40,
      },
      {
        id: 2,
        label: "Description",
        value: "task_name",
        width: 200,
        expander: true,
        html: true,
        events: {
          click({ data, column }) {
            alert("description clicked!\n" + data.label);
          },
        },
      },
      {
        id: 3,
        label: "Assigned to",
        value: "user",
        width: 130,
        html: true,
      },
      {
        id: 3,
        label: "Start",
        value: "task_start_date",
        width: 78,
      },
      {
        id: 4,
        label: "End",
        value: "task_end_date",
        width: 78,
      },
      {
        id: 5,
        label: "%",
        value: "progress",
        width: 35,
        style: {
          "task-list-header-label": {
            "text-align": "center",
            width: "100%",
          },
          "task-list-item-value-container": {
            "text-align": "center",
            width: "100%",
          },
        },
      },
    ],
  },
  locale: {
    name: "en",
    Now: "现在",
    "X-Scale": "Zoom-X",
    "Y-Scale": "Zoom-Y",
    "Task list width": "Task list",
    "Before/After": "Expand",
    "Display task list": "Task list",
  },
};

export default {
  name: "Gantt",
  components: {
    GanttElastic,
    GanttHeader,
  },
  props: ['tasks'],
  data() {
    return {
      options,
      dynamicStyle: {},
      lastId: 16,
    };
  },
  methods: {
    
  },
};
</script>
