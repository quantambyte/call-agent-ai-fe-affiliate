import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, DollarSign, Filter, Search } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { affiliateService } from '@/services';
import {
  COMMISSION_STATUS_OPTIONS,
  COMMISSION_TYPE_OPTIONS,
} from '@/constants';
import { CommissionInsightsWidget } from '@/components/commissions/commission-insights-widget';

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'default';
    case 'APPROVED':
      return 'secondary';
    case 'CALCULATED':
      return 'outline';
    case 'DISPUTED':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const CommissionsPage = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: affiliate, isLoading } = useQuery({
    queryKey: ['affiliate', 'profile'],
    queryFn: affiliateService.getProfile,
  });

  const commissions = affiliate?.commissions || [];

  const filteredCommissions = commissions.filter((commission) => {
    const commissionYear = new Date(commission.createdAt).getFullYear();
    const matchesYear = commissionYear === selectedYear;

    const matchesStatus =
      statusFilter === 'all' || commission.status === statusFilter;
    const matchesType =
      typeFilter === 'all' || commission.commissionType === typeFilter;

    const matchesSearch =
      commission.organization?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      commission.organization?.businessName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesYear && matchesStatus && matchesType && matchesSearch;
  });

  const totalCommissionsEarned = filteredCommissions.reduce(
    (sum, commission) => sum + Number(commission.commissionAmount || 0),
    0
  );

  const paidCommissions = filteredCommissions
    .filter((c) => c.status === 'PAID')
    .reduce(
      (sum, commission) => sum + Number(commission.commissionAmount || 0),
      0
    );

  const pendingCommissions = filteredCommissions
    .filter((c) => c.status !== 'PAID')
    .reduce(
      (sum, commission) => sum + Number(commission.commissionAmount || 0),
      0
    );

  const stats = [
    {
      title: 'Total Earnings',
      value: `$${totalCommissionsEarned.toFixed(2)}`,
      description: `Total for ${selectedYear}`,
      icon: DollarSign,
      loading: isLoading,
    },
    {
      title: 'Paid Commissions',
      value: `$${paidCommissions.toFixed(2)}`,
      description: 'Received payments',
      icon: Calendar,
      loading: isLoading,
    },
    {
      title: 'Pending Commissions',
      value: `$${pendingCommissions.toFixed(2)}`,
      description: 'Awaiting payment',
      icon: Calendar,
      loading: isLoading,
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCommissionType = (type: string) => {
    return type
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commissions</h1>
          <p className="text-muted-foreground">
            Track your commission earnings and payment history
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => currentYear - i).map(
                (year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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

      <CommissionInsightsWidget
        commissions={commissions || []}
        isLoading={isLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
          <CardDescription>
            Detailed breakdown of your commission earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {COMMISSION_STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {COMMISSION_TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">
                Loading commissions...
              </p>
            </div>
          ) : filteredCommissions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCommissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {commission.organization?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {commission.organization?.businessName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatCommissionType(commission.commissionType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{formatDate(commission.periodStart)}</p>
                          <p className="text-muted-foreground">
                            to {formatDate(commission.periodEnd)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        ${Number(commission.organizationRevenue).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {(Number(commission.commissionRate) * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="font-medium">
                        ${Number(commission.commissionAmount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(commission.status)}
                        >
                          {commission.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No commissions found for the selected criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
