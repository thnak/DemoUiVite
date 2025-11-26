import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { MetricCard } from '../metric-card';
import { YearlySalesChart } from '../yearly-sales-chart';
import { BestSalesmanTable } from '../best-salesman-table';
import { CircularRingsChart } from '../circular-rings-chart';
import { LatestProductsList } from '../latest-products-list';
import { SalesOverview, CurrentBalanceCard } from '../sales-overview';
import {
  metricCardsData,
  genderSalesData,
  yearlySalesData,
  bestSalesmenData,
  salesOverviewData,
  latestProductsData,
  currentBalanceData,
} from '../demo-dashboard-data';

// ----------------------------------------------------------------------

export function DemoDashboardView() {
  const genderTotal = genderSalesData.reduce((acc, item) => acc + item.value, 0);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        E-commerce Dashboard Demo
      </Typography>

      <Grid container spacing={3}>
        {/* Metric Cards */}
        {metricCardsData.map((metric) => (
          <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <MetricCard metric={metric} />
          </Grid>
        ))}

        {/* Sale by Gender Chart */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <CircularRingsChart
            title="Sale by gender"
            subheader="Sales distribution by customer gender"
            data={genderSalesData}
            total={genderTotal}
          />
        </Grid>

        {/* Yearly Sales Chart */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <YearlySalesChart
            title="Yearly sales"
            subheader="(+43%) than last year"
            data={yearlySalesData}
          />
        </Grid>

        {/* Sales Overview */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <SalesOverview
            title="Sales overview"
            subheader="Overview of current sales metrics"
            data={salesOverviewData}
          />
        </Grid>

        {/* Current Balance Card */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <CurrentBalanceCard
            title="Current balance"
            balance={currentBalanceData.currentBalance}
            currency={currentBalanceData.currency}
          />
        </Grid>

        {/* Best Salesman Table */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <BestSalesmanTable
            title="Best salesman"
            subheader="Top performing sales representatives"
            data={bestSalesmenData}
          />
        </Grid>

        {/* Latest Products */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <LatestProductsList
            title="Latest products"
            subheader="Recently added products"
            data={latestProductsData}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
