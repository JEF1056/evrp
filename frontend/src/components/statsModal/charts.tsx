import { Card } from "react-daisyui";
import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { getFramesInOrder } from "../../utils/tripFrameStorage";
import { vehicleData } from "../../utils/types";
import { getAvgEfficiency } from "../../utils/computeStatistics";
Chart.register(...registerables);

function StatsChartsComponent() {
  const frames = getFramesInOrder(
    (frame: vehicleData) => frame.evStateOfChargeChanged === true
  );

  const getOptions = (title: string, legend?: boolean) => ({
    plugins: {
      title: {
        display: true,
        text: title,
      },
      legend: {
        display: legend || false,
      }
    },
    scales: {
      x: {
        display: false,
      },
    },
    responsive: true,
    showLine: true,
  });

  let stateofChargeData = {
    datasets: [
      {
        label: "State of Charge",
        data: frames.map((frame: vehicleData) => ({
          y: frame.evStateOfChargeMilliPercent / 1000,
          x: frame.timestamp,
        })),
        borderColor: "#eab308",
        tension: 0.5,
      },
    ],
  };

  let efficiencyData = {
    datasets: [
      {
        label: "Efficiency (wh/mi)",
        data: frames.map((frame: vehicleData) => ({
          y: frame.efficiency,
          x: frame.timestamp,
        })),
        borderColor: "#eab308",
        tension: 0.5,
      },
      {
        label: "Average Efficiency (wh/mi)",
        data: frames.map((frame: vehicleData) => ({
          y: frame.avgEfficiency,
          x: frame.timestamp,
        })),
        borderColor: "#fca5a5",
        tension: 0.5,
      },
    ],
  };

  return (
    <Card
      bordered={false}
      className="no-scrollbar rounded-none bg-base-100 overflow-y-scroll max-h-[14rem] md:max-h-[100rem]"
    >
      <Card.Body>
        <Scatter className="h-[14rem] overflow-y-scroll"
          options={getOptions("State of Charge (%)")}
          data={stateofChargeData}
        />
        <Scatter className="h-[14rem] overflow-y-scroll"
          options={getOptions("Efficiency (wh/mi)", true)}
          data={efficiencyData}
        />
      </Card.Body>
    </Card>
  );
}

export default StatsChartsComponent;
