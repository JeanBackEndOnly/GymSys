import React from 'react';
import { 
  CreditCard, 
  Dumbbell, 
  CalendarCheck, 
  QrCode, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Activity,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { MemberLayout } from '@/components/layout/MemberLayout';

const recentAttendance = [
  { id: 1, date: 'Today', timeIn: '08:15 AM', type: 'Check In' },
  { id: 2, date: 'Yesterday', timeIn: '06:30 PM', type: 'Check In' },
  { id: 3, date: 'May 27, 2026', timeIn: '07:00 AM', type: 'Check In' },
];

const recentPayments = [
  { id: 1, date: 'May 01, 2026', amount: '₱1,500.00', type: 'Monthly Plan', status: 'Paid' },
  { id: 2, date: 'Apr 01, 2026', amount: '₱1,500.00', type: 'Monthly Plan', status: 'Paid' },
];

export default function MemberOverview() {
  return (
    <MemberLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, Alex!</h1>
          <p className="text-muted-foreground mt-1">Here is what's happening with your membership today.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6">
              <QrCode className="size-5" />
              <span className="font-semibold text-base">Show QR Code</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="matte-surface border-white/10 sm:max-w-md text-center">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">Your Access QR Code</DialogTitle>
              <DialogDescription className="text-center">
                Scan this at the front desk to log your attendance.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              <div className="bg-white p-4 rounded-2xl w-48 h-48 flex items-center justify-center">
                {/* Placeholder for actual QR code image */}
                <QrCode className="size-32 text-black" />
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1 text-sm">
                Membership Active
              </Badge>
              <p className="text-sm text-muted-foreground">
                Code refreshes every 30 seconds for security.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Membership Status */}
        <div className="glass-card rounded-2xl p-6 border-l-4 border-l-emerald-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard className="size-24 -mr-6 -mt-6 transform rotate-12" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-medium text-white">Membership Status</h3>
              <p className="text-emerald-500 text-sm font-semibold">Active - Monthly Plan</p>
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-bold text-white tracking-tight mb-1">
              15 Days
            </div>
            <p className="text-sm text-muted-foreground">
              remaining until renewal on Jun 15, 2026
            </p>
          </div>
        </div>

        {/* Workout Plan */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Dumbbell className="size-24 -mr-6 -mt-6 transform -rotate-12" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Calendar className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-white">Today's Workout</h3>
              <p className="text-primary text-sm font-semibold">Leg Day Focus</p>
            </div>
          </div>
          <div className="relative z-10 flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-white tracking-tight mb-1">
                4 Exercises
              </div>
              <p className="text-sm text-muted-foreground">
                Squats, Leg Press, Lunges...
              </p>
            </div>
            <Button variant="ghost" size="icon" className="size-8 rounded-full bg-white/5 hover:bg-white/10" asChild>
              <Link to="/member/planner">
                <ArrowRight className="size-4 text-white" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="size-24 -mr-6 -mt-6 transform rotate-6" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="size-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="size-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-white">Attendance Summary</h3>
              <p className="text-blue-500 text-sm font-semibold">This Month</p>
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-bold text-white tracking-tight mb-1">
              12 Visits
            </div>
            <p className="text-sm text-muted-foreground">
              You are in the top 20% of active members!
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Attendance */}
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="size-5 text-primary" />
              <h2 className="font-semibold text-lg text-white">Recent Attendance</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-8 text-muted-foreground hover:text-white" asChild>
              <Link to="/member/attendance">View All</Link>
            </Button>
          </div>
          <div className="p-0">
            <Table>
              <TableHeader className="bg-white/5 border-b-0">
                <TableRow className="border-b-0 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Time In</TableHead>
                  <TableHead className="text-right text-muted-foreground">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAttendance.map((record) => (
                  <TableRow key={record.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium text-white">{record.date}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="size-3 text-muted-foreground/70" />
                        {record.timeIn}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="bg-white/5 border-white/10 font-normal">
                        {record.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="size-5 text-emerald-500" />
              <h2 className="font-semibold text-lg text-white">Recent Payments</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-8 text-muted-foreground hover:text-white" asChild>
              <Link to="/member/payments">View All</Link>
            </Button>
          </div>
          <div className="p-0">
            <Table>
              <TableHeader className="bg-white/5 border-b-0">
                <TableRow className="border-b-0 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Description</TableHead>
                  <TableHead className="text-right text-muted-foreground">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium text-white">{payment.date}</TableCell>
                    <TableCell className="text-muted-foreground">{payment.type}</TableCell>
                    <TableCell className="text-right text-white font-medium">
                      {payment.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
      </div>
    </MemberLayout>
  );
}
