
export default function WarehouseBK() {
  const warehouseLayout = {
    left: [401, 301, 201, 101, 1],
    right: [402, 302, 202, 102, 2],
  };
  const columns = Array.from({ length: 50 }, (_, i) => i * 2 + 1);
  const mockData = {
    BK001: { status: "occupied", frequency: 1 },
    BK003: { status: "free", frequency: 3 },
    BK005: { status: "occupied", frequency: 7 },
    BK007: { status: "free", frequency: 10 },
  };

  function getColor(status, frequency, mode) {
    if (mode === "status") {
      return status === "occupied" ? "lightcoral" : "lightgreen";
    } else {
      if (frequency >= 10) return "purple";
      if (frequency >= 8) return "orangered";
      if (frequency >= 6) return "orange";
      if (frequency >= 4) return "gold";
      if (frequency >= 2) return "lightyellow";
      return "lightgray";
    }
  }

  const [selected, setSelected] = React.useState(null);
  const [slotData, setSlotData] = React.useState({});

  React.useEffect(() => {
    setSlotData(mockData);
  }, []);

  const renderRack = (side, mode = "status") =>
    warehouseLayout[side].map((rowBase) =>
      React.createElement("div", { key: rowBase, style: { display: "flex", gap: "4px", marginBottom: "4px" } },
        columns.map((col) => {
          const slotNumber = side === "left" ? rowBase + col - 1 : rowBase + col;
          const code = `BK${slotNumber.toString().padStart(3, "0")}`;
          const info = slotData[code] || { status: "free", frequency: 0 };
          const color = getColor(info.status, info.frequency, mode);
          return React.createElement("div", {
            key: code,
            onClick: () => alert(`${code}\n状态: ${info.status}\n频率: ${info.frequency}`),
            style: {
              width: "48px",
              height: "48px",
              backgroundColor: color,
              fontSize: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              border: "1px solid #ccc"
            }
          }, code);
        })
      )
    );

  return React.createElement("div", null,
    React.createElement("h2", { style: { fontSize: "20px", marginBottom: "10px" } }, "BK区库位可视化图"),
    React.createElement("div", { style: { display: "flex", gap: "20px", marginBottom: "10px" } },
      React.createElement("button", { onClick: () => setSelected("status") }, "当前库存状态"),
      React.createElement("button", { onClick: () => setSelected("heatmap") }, "热力图视图")
    ),
    React.createElement("div", { style: { display: "flex", gap: "40px", overflowX: "auto" } },
      React.createElement("div", null,
        React.createElement("h4", null, "左侧（单数）"),
        renderRack("left", selected || "status")
      ),
      React.createElement("div", null,
        React.createElement("h4", null, "右侧（双数）"),
        renderRack("right", selected || "status")
      )
    )
  );
}
