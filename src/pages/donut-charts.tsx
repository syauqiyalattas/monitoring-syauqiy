import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";

const DonutCharts: Component = () => {
  const [legendList, setLegendList] = createSignal([]);
  let divRef: any;
  let rootRef: any;

  onCleanup(() => {
    if (rootRef) {
      rootRef.dispose();
    }
  });

  onMount(() => {
    const legend = [
        { name: 'A', color: '#FF5733', field: 'A' },
        { name: 'B', color: '#75FF33', field: 'B' },
        { name: 'AB', color: '#3375FF', field: 'AB' },
        { name: 'O', color: '#FF33A1', field: 'O' },
    ];
    setLegendList(legend);
    fetchBloodTypeData();
  });

  const fetchBloodTypeData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/fetch_bloodtype'); // Adjust the URL as needed
      if (!response.ok) {
        throw new Error('Failed to fetch blood type data');
      }
      const data = await response.json();
      createChart(data);
    } catch (error) {
      console.error(error);
    }
  };

  const createChart = (data) => {
    let root = am5.Root.new(divRef);
    rootRef = root;

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    let series = chart.series.push(am5percent.PieSeries.new(root, {
      name: "Series",
      valueField: "count",
      categoryField: "blood_type",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{category}: {value}"
      })
    }));

    series.slices.template.setAll({
      cornerRadius: 5,
      stroke: am5.color(0xffffff),
      strokeWidth: 2
    });

    series.labels.template.setAll({
      fontFamily: 'Roboto',
      fontSize: "12px",
      text: "{category}: {value}"
    });

    series.data.setAll(data);

    chart.appear(1000, 100);
  };

  return (
    <div ref={divRef} style={{ width: '40vw', height: '25vh', margin: '-1vw' }}></div>
  );
}

export default DonutCharts;
