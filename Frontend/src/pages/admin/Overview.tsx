import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { cn } from '@/lib/utils';
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  UserMinus,
  Footprints,
  ShoppingBag,
  ClipboardCheck,
  RefreshCw,
  QrCode,
  UserPlus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QRScannerModal } from '@/components/QRScannerModal';
import { toast } from 'sonner';

const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const attendanceData = [
  { name: 'Mon', count: 240 },
  { name: 'Tue', count: 198 },
  { name: 'Wed', count: 300 },
  { name: 'Thu', count: 208 },
  { name: 'Fri', count: 480 },
  { name: 'Sat', count: 380 },
  { name: 'Sun', count: 430 },
];

const growthData = [
  { month: 'Jan', members: 1000 },
  { month: 'Feb', members: 1050 },
  { month: 'Mar', members: 1120 },
  { month: 'Apr', members: 1250 },
  { month: 'May', members: 1284 },
];

const stats = [
  { label: 'Total Members', value: '1,284', trend: '+12.5%', up: true, icon: Users, color: 'text-blue-500' },
  { label: 'Active Memberships', value: '1,150', trend: '+5.2%', up: true, icon: UserCheck, color: 'text-emerald-500' },
  { label: 'Expired Memberships', value: '134', trend: '-2.1%', up: true, icon: UserMinus, color: 'text-red-500' },
  { label: 'Monthly Revenue', value: '₱42,500', trend: '+8.2%', up: true, icon: CreditCard, color: 'text-emerald-500' },
  { label: 'Walk-ins Today', value: '28', trend: '+14.5%', up: true, icon: Footprints, color: 'text-orange-500' },
  { label: 'Product Sales', value: '₱5,200', trend: '+3.4%', up: true, icon: ShoppingBag, color: 'text-purple-500' },
  { label: 'Attendance Today', value: '342', trend: '+12.1%', up: true, icon: ClipboardCheck, color: 'text-blue-400' },
  { label: 'Renewals (This Month)', value: '89', trend: '+2.4%', up: true, icon: RefreshCw, color: 'text-emerald-400' },
];

export default function AdminOverview() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">Welcome back. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <QRScannerModal onScan={(result) => toast.success(`Scanned QR: ${result}`)} />
            <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
              <UserPlus className="size-4" />
              Add Member
            </Button>
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
              <CardTitle className="text-lg">Revenue Analytics</CardTitle>
              <p className="text-sm text-muted-foreground">Weekly gross revenue</p>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#ffffff10', borderRadius: '12px', color: '#fff' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Analytics */}
          <Card className="glass border-white/5">
            <CardHeader>
              <CardTitle className="text-lg">Attendance Analytics</CardTitle>
              <p className="text-sm text-muted-foreground">Weekly member check-ins</p>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#ffffff10', borderRadius: '12px', color: '#fff', cursor: 'transparent' }} cursor={{fill: '#ffffff05'}} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Membership Growth */}
          <Card className="glass border-white/5 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Membership Growth</CardTitle>
              <p className="text-sm text-muted-foreground">Monthly active members count</p>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#ffffff10', borderRadius: '12px', color: '#fff' }} />
                    <Line type="monotone" dataKey="members" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AdminLayout>
  );
}
