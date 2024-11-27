import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

const LineChartShare: Component = () => {
  const [legendList, setLegendList] = createSignal([]);
  const [genderData, setGenderData] = createSignal([]);
  let divRef: any;
  let rootRef: any;

  onCleanup(() => {
    if (rootRef) {
      rootRef.dispose();
    }
  });

  onMount(async () => {
    const legend = [
      {
        name: 'Male',
        color: '#41CFC6',
        field: 'Male'
      },
      {
        name: 'Female',
        color: '#FF6847',
        field: 'Female'
      },
    ];
    setLegendList(legend);

    // Fetch gender data from the backend
    const response = await fetch('http://127.0.0.1:8080/fetch_gender');
    const data = await response.json();
    setGenderData(data.map((item: any) => ({ category: item.gender, value: item.count })));

    createChart();
  });

  const createChart = () => {
    let root = am5.Root.new(divRef);
    rootRef = root;

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
        pinchZoomX: true
      })
    );

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomX"
    }));
    cursor.lineY.set("visible", true);

    let xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minGridDistance: 80,
      pan: "zoom"
    });

    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: xRenderer,
    }));

    xAxis.get("renderer").labels.template.setAll({
      fontFamily: 'Roboto',
      fontSize: "12",
      marginLeft: 10,
    });
    xAxis.set("tooltip", am5.Tooltip.new(root, {
      themeTags: ["axis"]
    }));

    xRenderer.grid.template.setAll({
      location: 1
    });

    xAxis.data.setAll(genderData());

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      min: 0,
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1,
      }),
    }));

    yAxis.get("renderer").labels.template.setAll({
      fontFamily: 'Roboto',
      fontSize: "12",
    });

    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      sequencedInterpolation: true,
      categoryXField: "category",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));

    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.data.setAll(genderData());
    series.appear(1000);
    chart.appear(1000, 100);
  };

  return (
    <div ref={divRef} style={{ width: '40vw', height: '25vh', margin: '-1vw' }}></div>
  );
}

export default LineChartShare;
