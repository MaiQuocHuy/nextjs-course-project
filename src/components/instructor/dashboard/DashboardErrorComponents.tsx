import { ErrorComponent } from "../commom/ErrorComponent";

export const DashboardError = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <ErrorComponent
      title="Dashboard Data Error"
      message="We couldn't load your dashboard data. This could be due to a temporary issue with the server or your connection."
      onRetry={onRetry}
      className="max-w-lg w-full"
    />
  );
};

export const TableError = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <ErrorComponent
      title="Couldn't Load Table Data"
      message="There was an error retrieving the table data. Please try refreshing."
      onRetry={onRetry}
    />
  );
};

export const ChartError = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <ErrorComponent
      title="Chart Data Error"
      message="We couldn't load the chart data. Please try again."
      onRetry={onRetry}
      className="h-[200px] flex items-center justify-center"
    />
  );
};

export const StatsCardError = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <ErrorComponent
      title="Stats Card Data Error"
      message="We couldn't load the statistics card data. Please try again."
      onRetry={onRetry}
      className="h-[200px] flex items-center justify-center"
    />
  );
};