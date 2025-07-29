
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const warehouseLayout = {
  left: [401, 301, 201, 101, 1],
  right: [402, 302, 202, 102, 2],
};

const columns = Array.from({ length: 50 }, (_, i) => i * 2 + 1); // 1, 3, ..., 99

const mockData = {
  BK001: { status: "occupied", frequency: 1 },
  BK003: { status: "free", frequency: 3 },
  BK005: { status: "occupied", frequency: 7 },
  BK007: { status: "free", frequency: 10 },
};

function getStatusColor(status) {
  return status === "occupied"
    ? "bg-red-300 hover:bg-red-400"
    : "bg-green-200 hover:bg-green-300";
}

function getHeatmapColor(frequency) {
  if (frequency >= 10) return "bg-purple-700 hover:bg-purple-800";
  if (frequency >= 8) return "bg-orange-600 hover:bg-orange-700";
  if (frequency >= 6) return "bg-orange-400 hover:bg-orange-500";
  if (frequency >= 4) return "bg-yellow-400 hover:bg-yellow-500";
  if (frequency >= 2) return "bg-yellow-200 hover:bg-yellow-300";
  return "bg-gray-200 hover:bg-gray-300";
}

export default function WarehouseBK() {
  const [selected, setSelected] = useState(null);
  const [slotData, setSlotData] = useState({});

  useEffect(() => {
    setSlotData(mockData);
  }, []);

  const renderRack = (side, mode = "status") => {
    return warehouseLayout[side].map((rowBase) => (
      <div key={rowBase} className="flex gap-1">
        {columns.map((col) => {
          const slotNumber = side === "left" ? rowBase + col - 1 : rowBase + col;
          const code = `BK${slotNumber.toString().padStart(3, "0")}`;
          const info = slotData[code] || { status: "free", frequency: 0 };
          const colorClass = mode === "status"
            ? getStatusColor(info.status)
            : getHeatmapColor(info.frequency);

          return (
            <Dialog key={code}>
              <DialogTrigger asChild>
                <div
                  onClick={() => setSelected(code)}
                  className={`w-12 h-12 border text-[10px] flex items-center justify-center cursor-pointer ${colorClass}`}
                >
                  {code}
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>库位信息 - {code}</DialogTitle>
                <Card>
                  <CardContent className="p-2 text-sm">
                    <p><strong>状态:</strong> {info.status === "occupied" ? "占用" : "空闲"}</p>
                    <p><strong>使用频率:</strong> {info.frequency} 次</p>
                    <p><strong>备注:</strong> -</p>
                  </CardContent>
                </Card>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">BK区库位可视化图</h2>
      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">当前库存状态</TabsTrigger>
          <TabsTrigger value="heatmap">热力图视图</TabsTrigger>
        </TabsList>
        <TabsContent value="status">
          <div className="flex gap-8 overflow-x-auto">
            <div>
              <h3 className="font-medium mb-2">左侧（单数）</h3>
              {renderRack("left", "status")}
            </div>
            <div>
              <h3 className="font-medium mb-2">右侧（双数）</h3>
              {renderRack("right", "status")}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="heatmap">
          <div className="flex gap-8 overflow-x-auto">
            <div>
              <h3 className="font-medium mb-2">左侧（单数）</h3>
              {renderRack("left", "heatmap")}
            </div>
            <div>
              <h3 className="font-medium mb-2">右侧（双数）</h3>
              {renderRack("right", "heatmap")}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
