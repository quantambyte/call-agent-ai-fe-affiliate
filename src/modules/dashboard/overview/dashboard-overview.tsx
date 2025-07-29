import { useQuery } from '@tanstack/react-query';
import {
  DollarSign,
  Building2,
  TrendingUp,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { affiliateService } from '@/services';

export const DashboardOverview = () => {
  const {
    data: affiliate,
    isLoading: affiliateLoading,
    error: affiliateError,
  } = useQuery({
    queryKey: ['affiliate', 'profile'],
    queryFn: affiliateService.getProfile,
  });

  if (affiliateError) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">
                Failed to load affiliate data. Please try refreshing the page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (affiliateLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <div className="h-8 bg-muted rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-muted rounded mb-1"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No affiliate data found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const organizations = affiliate.organizations || [];
  const commissions = affiliate.commissions || [];
  const soldSubscriptions = affiliate.soldSubscriptions || [];

  const totalCommissionsEarned = commissions.reduce(
    (sum, commission) => sum + Number(commission.commissionAmount || 0),
    0
  );

  const stats = [
    {
      title: 'Total Earnings',
      value: `$${totalCommissionsEarned.toFixed(2)}`,
      description: 'Commission earnings',
      icon: DollarSign,
    },
    {
      title: 'Organizations',
      value: organizations.length.toString(),
      description: 'Active organizations',
      icon: Building2,
    },
    {
      title: 'Subscriptions Sold',
      value: soldSubscriptions.length.toString(),
      description: 'Total subscriptions',
      icon: TrendingUp,
    },
    {
      title: 'Account Balance',
      value: `$${Number(affiliate.accountBalance).toFixed(2)}`,
      description: 'Current balance',
      icon: Calendar,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome back, {affiliate.name}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your affiliate account and view your commissions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 text-muted-foreground`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {organizations.length > 0 && (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
            <CardDescription>
              Organizations you're affiliated with
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {organizations.slice(0, 3).map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {org.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {org.industryType} • {org.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {org._count?.users || 0} users
                    </p>
                  </div>
                </div>
              ))}
              {organizations.length > 3 && (
                <p className="text-sm text-muted-foreground text-center">
                  And {organizations.length - 3} more organizations...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
