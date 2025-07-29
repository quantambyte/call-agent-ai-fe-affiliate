import { useQuery } from '@tanstack/react-query';
import { DollarSign, Building2, TrendingUp, Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { affiliateService } from '@/services';

export const DashboardOverview = () => {
  const currentYear = new Date().getFullYear();

  const { data: organizations = [], isLoading: organizationsLoading } =
    useQuery({
      queryKey: ['affiliate', 'organizations'],
      queryFn: affiliateService.getOrganizations,
    });

  const { data: commissionSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['affiliate', 'commission-summary', currentYear],
    queryFn: () => affiliateService.getCommissionSummary(currentYear),
  });

  const { data: affiliate, isLoading: affiliateLoading } = useQuery({
    queryKey: ['affiliate', 'profile'],
    queryFn: affiliateService.getProfile,
  });

  const stats = [
    {
      title: 'Total Earnings',
      value: commissionSummary?.totalCommissionsEarned
        ? `$${commissionSummary.totalCommissionsEarned.toFixed(2)}`
        : '$0.00',
      description: `Earnings for ${currentYear}`,
      icon: DollarSign,
      loading: summaryLoading,
    },
    {
      title: 'Paid Commissions',
      value: commissionSummary?.totalCommissionsPaid
        ? `$${commissionSummary.totalCommissionsPaid.toFixed(2)}`
        : '$0.00',
      description: 'Commissions received',
      icon: TrendingUp,
      loading: summaryLoading,
    },
    {
      title: 'Organizations',
      value: organizations.length.toString(),
      description: 'Active organizations',
      icon: Building2,
      loading: organizationsLoading,
    },
    {
      title: 'Account Balance',
      value: affiliate?.accountBalance
        ? `$${affiliate.accountBalance.toFixed(2)}`
        : '$0.00',
      description: 'Current balance',
      icon: Calendar,
      loading: affiliateLoading,
    },
  ];

  const recentOrganizations = organizations.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your affiliate performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {stat.loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded mb-1"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Organizations</CardTitle>
            <CardDescription>
              Organizations you're affiliated with
            </CardDescription>
          </CardHeader>
          <CardContent>
            {organizationsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded mb-1"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : recentOrganizations.length > 0 ? (
              <div className="space-y-4">
                {recentOrganizations.map((org) => (
                  <div key={org.id} className="flex items-center space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {org.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {org.industryType} • {org.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No organizations found.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commission Breakdown</CardTitle>
            <CardDescription>
              Commissions by type for {currentYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded mb-1"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : commissionSummary?.commissionsByType ? (
              <div className="space-y-4">
                {Object.entries(commissionSummary.commissionsByType).map(
                  ([type, amount]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <p className="text-sm font-medium">
                        {type
                          .replace('_', ' ')
                          .toLowerCase()
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${amount.toFixed(2)}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No commission data available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
