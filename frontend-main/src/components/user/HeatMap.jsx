import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

// Function to generate random activity
const generateActivityData = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const count = Math.floor(Math.random() * 50);
    if (count > 10) {
      data.push({
        date: currentDate.toISOString().split("T")[0],
        count: count,
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

const getPanelColors = (maxCount) => {
  return {
    0: "#2d3449", 
    8: "#004395", 
    20: "#4d8eff", 
    40: "#adc6ff" 
  };
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);
  const [panelColors, setPanelColors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // Use current year data for a more realistic look
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 11);
      
      const startDate = start.toISOString().split("T")[0];
      const endDate = end.toISOString().split("T")[0];
      
      const data = generateActivityData(startDate, endDate);
      setActivityData(data);

      const maxCount = Math.max(...data.map((d) => d.count), 50);
      setPanelColors(getPanelColors(maxCount));
    };

    fetchData();
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <HeatMap
        className="HeatMapProfile"
        style={{ width: "100%", height: "auto", color: "var(--color-on-surface-variant, #c2c6d6)" }}
        value={activityData}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        startDate={new Date(new Date().setMonth(new Date().getMonth() - 11))}
        rectSize={12}
        space={4}
        rectProps={{
          rx: 2,
        }}
        panelColors={panelColors}
      />
    </div>
  );
};

export default HeatMapProfile;
