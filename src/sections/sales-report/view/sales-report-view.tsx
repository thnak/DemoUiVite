import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { StatCard } from '../stat-card';
import { CustomerGrowth } from '../customer-growth';
import { CustomerHabits } from '../customer-habits';
import { ProductStatistic } from '../product-statistic';
import {
  statCardsData,
  customerGrowthData,
  customerHabitsData,
  productStatisticData,
  customerHabitsSummary,
} from '../sales-report-data';

// ----------------------------------------------------------------------

export function SalesReportView() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Sales Report
      </Typography>

      <Grid container spacing={3}>
        {/* Stat Cards - 2x2 grid on left side */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Grid container spacing={3}>
            {statCardsData.map((stat) => (
              <Grid key={stat.id} size={{ xs: 12, sm: 6 }}>
                <StatCard stat={stat} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Product Statistic - right side */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <ProductStatistic data={productStatisticData} />
        </Grid>

        {/* Customer Habits - bottom left */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <CustomerHabits data={customerHabitsData} summary={customerHabitsSummary} />
        </Grid>

        {/* Customer Growth - bottom right */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <CustomerGrowth data={customerGrowthData} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
