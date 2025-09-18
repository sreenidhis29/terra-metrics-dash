import FieldMap from "../components/FieldMap";
import HealthSummaryCard from "../components/HealthSummaryCard";
import AlertsCard from "../components/AlertsCard";
import SensorDataCard from "../components/SensorDataCard";
import TrendsChart from "../components/TrendsChart";

const Index = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[500px]">
        {/* Large field map takes most space */}
        <div className="lg:col-span-3">
          <FieldMap />
        </div>
        
        {/* Right sidebar with key metrics */}
        <div className="space-y-4">
          <HealthSummaryCard />
          <SensorDataCard />
        </div>
      </div>

      {/* Second row with alerts and trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AlertsCard />
        </div>
        <div className="lg:col-span-2">
          <TrendsChart />
        </div>
      </div>
    </div>
  );
};

export default Index;
