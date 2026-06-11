import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Users, 
  CalendarDays,
  ShoppingBag,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const revenueData = [
  { name: 'Mon', memberships: 12000, pos: 3500, walkins: 1500 },
  { name: 'Tue', memberships: 8000, pos: 2100, walkins: 900 },
  { name: 'Wed', memberships: 15000, pos: 4200, walkins: 1200 },
  { name: 'Thu', memberships: 9500, pos: 3800, walkins: 1800 },
  { name: 'Fri', memberships: 18000, pos: 5500, walkins: 2500 },
  { name: 'Sat', memberships: 22000, pos: 8000, walkins: 4500 },
  { name: 'Sun', memberships: 11000, pos: 4000, walkins: 3000 },
];

export default function AdminReports() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">Comprehensive overview of gym performance and metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 rounded-xl gap-2">
              <CalendarDays className="size-4" />
              This Month
            </Button>
            <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
              <Download className="size-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <DollarSign className="size-6" />
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-500">+14.5%</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <h3 className="text-3xl font-bold tracking-tight">₱245,800</h3>
            </CardContent>
          </Card>
          <Card className="glass border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                  <Users className="size-6" />
                </div>
                <Badge className="bg-blue-500/20 text-blue-500">+5.2%</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Active Members</p>
              <h3 className="text-3xl font-bold tracking-tight">1,429</h3>
            </CardContent>
          </Card>
          <Card className="glass border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                  <ShoppingBag className="size-6" />
                </div>
                <Badge className="bg-orange-500/20 text-orange-500">+12.1%</Badge>
              </div>
              <p className="text-sm text-muted-foreground">POS Sales</p>
              <h3 className="text-3xl font-bold tracking-tight">₱45,200</h3>
            </CardContent>
          </Card>
          <Card className="glass border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                  <TrendingUp className="size-6" />
                </div>
                <Badge className="bg-purple-500/20 text-purple-500">+8.4%</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Avg. Attendance/Day</p>
              <h3 className="text-3xl font-bold tracking-tight">284</h3>
            </CardContent>
          </Card>
        </div>

        {/* Charts Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <Card className="glass border-white/5 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
              <div>
                <CardTitle>Revenue Breakdown</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Memberships vs POS Sales vs Walk-ins</p>
              </div>
              <BarChart3 className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis 
                      stroke="#ffffff50" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `₱${value/1000}k`} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#121212', borderColor: '#ffffff10', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff', fontSize: '14px' }}
                      formatter={(value: number) => [`₱${value.toLocaleString()}`, undefined]}
                      cursor={{ fill: '#ffffff05' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
                    <Bar dataKey="memberships" name="Memberships" stackId="a" fill="#e11d48" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="pos" name="POS Sales" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="walkins" name="Walk-ins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Side Panels */}
          <div className="space-y-6">
            <Card className="glass border-white/5">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {[
                    { name: 'Whey Protein (2kg)', sales: 45, rev: '₱126,000' },
                    { name: 'Pre-Workout', sales: 38, rev: '₱45,600' },
                    { name: 'Creatine', sales: 29, rev: '₱31,900' },
                    { name: 'Shaker Bottle', sales: 24, rev: '₱8,400' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.sales} sold</p>
                      </div>
                      <span className="font-medium text-emerald-500">{item.rev}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/5">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle>Peak Hours</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { time: '5 PM - 8 PM', density: 95 },
                    { time: '6 AM - 9 AM', density: 75 },
                    { time: '12 PM - 2 PM', density: 45 }
                  ].map((slot, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{slot.time}</span>
                        <span className="text-muted-foreground">{slot.density}% capacity</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-orange-500" 
                          style={{ width: `${slot.density}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
