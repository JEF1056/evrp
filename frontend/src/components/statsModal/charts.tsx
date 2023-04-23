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
        borderColor: "rgba(255, 99, 132)",
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
        borderColor: "rgba(255, 99, 132)",
        tension: 0.5,
      },
      {
        label: "Average Efficiency (wh/mi)",
        data: frames.map((frame: vehicleData) => ({
          y: frame.avgEfficiency,
          x: frame.timestamp,
        })),
        borderColor: "rgba(0, 99, 132)",
        tension: 0.5,
      },
    ],
  };

  return (
    <Card
      bordered={false}
      className="rounded-none bg-base-100 stats-vertical max-h-32 md:max-h-[22rem]"
    >
      <Card.Body>
        <Scatter
          options={getOptions("State of Charge (%)")}
          data={stateofChargeData}
        />
        <Scatter
          options={getOptions("Efficiency (wh/mi)", true)}
          data={efficiencyData}
        />
      </Card.Body>
    </Card>
  );
}

export default StatsChartsComponent;
