import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Percent,
  Target,
  Clock,
} from 'lucide-react';
import type { Commission } from '@/types/affiliate';

interface CommissionInsightsWidgetProps {
  commissions: Commission[];
  isLoading?: boolean;
}

// Simple progress bar component
const SimpleProgressBar = ({
  value,
  className = '',
}: {
  value: number;
  className?: string;
}) => (
  <div className={`w-full bg-muted rounded-full h-2 ${className}`}>
    <div
      className="bg-primary h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

export const CommissionInsightsWidget = ({
  commissions,
  isLoading = false,
}: CommissionInsightsWidgetProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse h-4 bg-muted rounded"></div>
            <div className="animate-pulse h-4 bg-muted rounded w-3/4"></div>
            <div className="animate-pulse h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate various metrics
  const totalCommissions = commissions.reduce(
    (sum, c) => sum + Number(c.commissionAmount || 0),
    0
  );
  const paidCommissions = commissions.filter((c) => c.status === 'PAID');
  const pendingCommissions = commissions.filter((c) => c.status !== 'PAID');
  const totalPaid = paidCommissions.reduce(
    (sum, c) => sum + Number(c.commissionAmount || 0),
    0
  );
  const totalPending = pendingCommissions.reduce(
    (sum, c) => sum + Number(c.commissionAmount || 0),
    0
  );

  // Commission type breakdown
  const typeBreakdown = commissions.reduce(
    (acc, commission) => {
      const type = commission.commissionType;
      if (!acc[type]) {
        acc[type] = { count: 0, amount: 0 };
      }
      acc[type].count += 1;
      acc[type].amount += Number(commission.commissionAmount || 0);
      return acc;
    },
    {} as Record<string, { count: number; amount: number }>
  );

  // Organization breakdown (top 5)
  const orgBreakdown = commissions.reduce(
    (acc, commission) => {
      const orgName = commission.organization?.name || 'Unknown';
      if (!acc[orgName]) {
        acc[orgName] = {
          count: 0,
          amount: 0,
          businessName: commission.organization?.businessName,
        };
      }
      acc[orgName].count += 1;
      acc[orgName].amount += Number(commission.commissionAmount || 0);
      return acc;
    },
    {} as Record<
      string,
      { count: number; amount: number; businessName?: string }
    >
  );

  const topOrganizations = Object.entries(orgBreakdown)
    .sort(([, a], [, b]) => b.amount - a.amount)
    .slice(0, 5);

  // Calculate payment success rate
  const paymentRate =
    commissions.length > 0
      ? (paidCommissions.length / commissions.length) * 100
      : 0;

  // Average commission per transaction
  const avgCommission =
    commissions.length > 0 ? totalCommissions / commissions.length : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatCommissionType = (type: string) => {
    return type
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Payment Success Rate */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Payment Success Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {paymentRate.toFixed(1)}%
              </span>
              <Badge variant={paymentRate >= 80 ? 'default' : 'destructive'}>
                {paidCommissions.length}/{commissions.length}
              </Badge>
            </div>
            <SimpleProgressBar value={paymentRate} />
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalPaid)} paid of{' '}
              {formatCurrency(totalCommissions)} total
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Average Commission */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Percent className="h-4 w-4 mr-2" />
            Average Commission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatCurrency(avgCommission)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per transaction ({commissions.length} total)
            </p>
            {commissions.length > 1 && (
              <div className="flex items-center text-xs">
                {avgCommission > totalCommissions / commissions.length ? (
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className="text-muted-foreground">vs last period</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Amount */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Pending Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatCurrency(totalPending)}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingCommissions.length} commission
              {pendingCommissions.length !== 1 ? 's' : ''} awaiting payment
            </p>
            {totalCommissions > 0 && (
              <div className="flex items-center text-xs">
                <span className="text-muted-foreground">
                  {((totalPending / totalCommissions) * 100).toFixed(1)}% of
                  total earnings
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Commission Type Breakdown */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Commission Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(typeBreakdown).map(([type, data]) => (
              <div key={type} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {formatCommissionType(type)}
                  </span>
                  <span className="text-muted-foreground">
                    {formatCurrency(data.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {data.count} transaction{data.count !== 1 ? 's' : ''}
                  </span>
                  <span>
                    {totalCommissions > 0
                      ? ((data.amount / totalCommissions) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <SimpleProgressBar
                  value={
                    totalCommissions > 0
                      ? (data.amount / totalCommissions) * 100
                      : 0
                  }
                  className="h-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Organizations */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            Top Organizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topOrganizations.length > 0 ? (
              topOrganizations.map(([orgName, data], index) => (
                <div key={orgName} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{orgName}</p>
                    {data.businessName && (
                      <p className="text-xs text-muted-foreground truncate">
                        {data.businessName}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(data.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {data.count} transaction{data.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No organization data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
