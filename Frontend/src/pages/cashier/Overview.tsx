import React, { useState } from 'react';
import { CashierLayout } from '@/components/layout/CashierLayout';
import { cn } from '@/lib/utils';
import { 
  Users, 
  CreditCard, 
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  Footprints,
  RefreshCw,
  QrCode,
  UserPlus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QRScannerModal } from '@/components/QRScannerModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { attendanceService } from '@/services/attendance.service';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const revenueData = [
  { name: 'Mon', revenue: 2000 },
  { name: 'Tue', revenue: 1500 },
  { name: 'Wed', revenue: 3200 },
  { name: 'Thu', revenue: 1800 },
  { name: 'Fri', revenue: 2100 },
  { name: 'Sat', revenue: 4500 },
  { name: 'Sun', revenue: 3800 },
];

const walkinsData = [
  { time: '8am', count: 5 },
  { time: '10am', count: 12 },
  { time: '12pm', count: 8 },
  { time: '2pm', count: 15 },
  { time: '4pm', count: 22 },
  { time: '6pm', count: 35 },
  { time: '8pm', count: 18 },
];

const stats = [
  { label: "Today's Revenue", value: '₱12,500', trend: '+15.2%', up: true, icon: CreditCard, color: 'text-emerald-500' },
  { label: "Today's Walk-ins", value: '45', trend: '+5.4%', up: true, icon: Footprints, color: 'text-orange-500' },
  { label: 'Membership Renewals', value: '12', trend: '+2.1%', up: true, icon: RefreshCw, color: 'text-blue-500' },
  { label: 'Active Members', value: '1,150', trend: '+1.2%', up: true, icon: UserCheck, color: 'text-purple-500' },
];

const recentTransactions = [
  { id: 'TRX-001', member: 'John Doe', type: 'Membership Renewal', amount: '₱1,500', time: '10:45 AM', status: 'Completed' },
  { id: 'TRX-002', member: 'Walk-in User', type: 'Daily Pass', amount: '₱150', time: '10:30 AM', status: 'Completed' },
  { id: 'TRX-003', member: 'Jane Smith', type: 'Product Purchase', amount: '₱450', time: '09:45 AM', status: 'Completed' },
  { id: 'TRX-004', member: 'Mike Johnson', type: 'New Membership', amount: '₱2,000', time: '08:45 AM', status: 'Completed' },
  { id: 'TRX-005', member: 'Walk-in User', type: 'Daily Pass', amount: '₱150', time: '07:45 AM', status: 'Completed' },
];

export default function CashierOverview() {
  const queryClient = useQueryClient();
  const [scanResult, setScanResult] = React.useState<{ user: any, status: string, message: string } | null>(null);

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers({ per_page: 1000 })
  });

  const recordAttendanceMutation = useMutation({
    mutationFn: (data: any) => attendanceService.recordAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-attendance'] });
      toast.success("Attendance logged successfully!");
    },
    onError: () => toast.error("Failed to log attendance")
  });

  const handleScan = (result: string) => {
    const extractBase = (qrString: string) => {
      if (!qrString) return '';
      return qrString.split('/').pop() || qrString;
    };
    
    const scanId = extractBase(result);
    const matchedUser = users.find((u: any) => extractBase(u.qr_code) === scanId);
    
    if (!matchedUser) {
      toast.error("Invalid QR Code: Member not found.");
      return;
    }

    let status = 'active';
    let message = '';
    const contract = matchedUser.contract;

    if (!contract) {
      status = 'newbie';
      message = 'No active contract yet. Newbie member.';
    } else if (contract.status === 'expired') {
      status = 'expired';
      message = `Contract expired on ${new Date(contract.end_date as string).toLocaleDateString()}.`;
    } else if (contract.status === 'active') {
      const isExpired = new Date(contract.end_date as string) < new Date();
      if (isExpired) {
        status = 'expired';
        message = `Contract is overdue since ${new Date(contract.end_date as string).toLocaleDateString()}.`;
      } else {
        status = 'active';
        message = `Contract is active until ${new Date(contract.end_date as string).toLocaleDateString()}.`;
      }
    } else {
      status = 'inactive';
      message = 'Contract is not currently active.';
    }

    setScanResult({ user: matchedUser, status, message });

    const now = new Date();
    const time_in = now.toISOString().slice(0, 19).replace('T', ' ');

    recordAttendanceMutation.mutate({
      user_id: matchedUser.id,
      time_in: time_in,
    });
  };

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentType, setPaymentType] = useState('walkin');
  return (
    <CashierLayout>
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Cashier Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage today's transactions, walk-ins, and renewals.</p>
          </div>
          <div className="flex items-center gap-3">
            <QRScannerModal onScan={handleScan} />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
                  <UserPlus className="size-4" />
                  Process Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] border-white/10 bg-[#0a0a0a]">
                <DialogHeader>
                  <DialogTitle className="text-xl">Process Payment</DialogTitle>
                  <DialogDescription>Record a face-to-face transaction</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Transaction Type</Label>
                    <Select value={paymentType} onValueChange={setPaymentType}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="walkin">Walk-in Fee</SelectItem>
                        <SelectItem value="new">New Membership</SelectItem>
                        <SelectItem value="renewal">Membership Renewal</SelectItem>
                        <SelectItem value="product">Product Purchase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {paymentType !== 'product' && (
                    <div className="grid gap-2 animate-in fade-in zoom-in-95 duration-200">
                      <Label htmlFor="client">Client / Member Name</Label>
                      <Select>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue placeholder="Select a member or client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john_doe">John Doe</SelectItem>
                          <SelectItem value="jane_smith">Jane Smith</SelectItem>
                          <SelectItem value="mike_johnson">Mike Johnson</SelectItem>
                          <SelectItem value="walkin_user">Walk-in Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (₱)</Label>
                    <Input id="amount" type="number" placeholder="0.00" className="bg-white/5 border-white/10" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="method">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="gcash">GCash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {paymentMethod !== 'cash' && (
                    <div className="grid gap-2 animate-in fade-in zoom-in-95 duration-200">
                      <Label htmlFor="reference">Reference Code</Label>
                      <Input id="reference" placeholder="Enter reference number" className="bg-white/5 border-white/10" />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full rounded-xl">Complete Payment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="glass border-white/5 overflow-hidden group hover:border-white/10 transition-all">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div className={cn("p-2.5 rounded-2xl bg-white/5", stat.color)}>
                    <stat.icon className="size-5" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    stat.up ? "text-emerald-500" : "text-destructive"
                  )}>
                    {stat.trend}
                    {stat.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  <h3 className="text-xl md:text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Revenue Analytics */}
          <Card className="glass border-white/5">
            <CardHeader>
              <CardTitle className="text-lg">Today's Revenue Trend</CardTitle>
              <p className="text-sm text-muted-foreground">Hourly gross revenue for today</p>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenueCashier" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#ffffff10', borderRadius: '12px', color: '#fff' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenueCashier)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Walk-ins Trend */}
          <Card className="glass border-white/5">
            <CardHeader>
              <CardTitle className="text-lg">Walk-ins Today</CardTitle>
              <p className="text-sm text-muted-foreground">Hourly distribution of walk-in customers</p>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={walkinsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#ffffff10', borderRadius: '12px', color: '#fff' }} />
                    <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="glass border-white/5 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <p className="text-sm text-muted-foreground">Latest payments processed today</p>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-white/5">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg font-medium">Transaction ID</th>
                      <th className="px-4 py-3 font-medium">Member/Client</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Time</th>
                      <th className="px-4 py-3 rounded-r-lg font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((trx, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-4 font-medium text-white">{trx.id}</td>
                        <td className="px-4 py-4">{trx.member}</td>
                        <td className="px-4 py-4 text-muted-foreground">{trx.type}</td>
                        <td className="px-4 py-4 font-medium text-emerald-400">{trx.amount}</td>
                        <td className="px-4 py-4 text-muted-foreground">{trx.time}</td>
                        <td className="px-4 py-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            {trx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Shared Scan Result Dialog */}
      <Dialog open={!!scanResult} onOpenChange={(open) => !open && setScanResult(null)}>
        <DialogContent className="sm:max-w-md border-white/10 bg-[#0a0a0a]">
          <DialogHeader>
            <DialogTitle>Member Scan Result</DialogTitle>
          </DialogHeader>
          {scanResult && (
            <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
              <Avatar className="size-24 border border-white/10 mb-2">
                <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                  {scanResult.user.firstname.charAt(0)}{scanResult.user.lastname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-bold text-white">{scanResult.user.firstname} {scanResult.user.lastname}</h3>
              
              <Badge variant="outline" className={cn(
                "px-4 py-1 text-sm border",
                scanResult.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                scanResult.status === 'expired' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                "bg-orange-500/10 text-orange-500 border-orange-500/20"
              )}>
                {scanResult.status.toUpperCase()}
              </Badge>
              
              <p className={cn(
                "text-sm font-medium",
                scanResult.status === 'active' ? "text-emerald-500/80" : 
                scanResult.status === 'expired' ? "text-rose-500/80" : "text-orange-500/80"
              )}>
                {scanResult.message}
              </p>

              <Button onClick={() => setScanResult(null)} variant="outline" className="mt-4 w-full rounded-xl border-white/10 hover:bg-white/5">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </CashierLayout>
  );
}
