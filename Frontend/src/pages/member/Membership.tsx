import React from 'react';
import { MemberLayout } from '@/components/layout/MemberLayout';
import { CreditCard, Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const membershipHistory = [
  { id: 1, type: 'Monthly Plan', startDate: 'May 15, 2026', endDate: 'Jun 15, 2026', status: 'Active' },
  { id: 2, type: 'Monthly Plan', startDate: 'Apr 15, 2026', endDate: 'May 15, 2026', status: 'Expired' },
  { id: 3, type: 'Weekly Plan', startDate: 'Mar 10, 2026', endDate: 'Mar 17, 2026', status: 'Expired' },
];

export default function MemberMembership() {
  return (
    <MemberLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Membership details</h1>
          <p className="text-muted-foreground mt-1">View your current status and plan history.</p>
        </div>

        {/* Current Status Card */}
        <div className="glass-card rounded-3xl p-8 border-l-4 border-l-emerald-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <CreditCard className="size-48 -mr-12 -mt-12 transform rotate-12" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="size-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="size-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Current Status</h3>
                  <p className="text-emerald-500 font-semibold">Active Membership</p>
                </div>
              </div>
              
              <div className="space-y-1 mb-8">
                <div className="text-4xl font-bold text-white tracking-tight">Monthly Plan</div>
                <p className="text-muted-foreground">Unlimited gym access and equipment use.</p>
              </div>

              <div className="flex items-center gap-2 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 w-fit">
                <AlertCircle className="size-5 shrink-0" />
                <span className="text-sm font-medium">To renew your plan, please visit the cashier at the front desk.</span>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-6 md:pl-8 md:border-l border-white/10">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                  <Calendar className="size-4" /> Start Date
                </p>
                <p className="text-xl font-semibold text-white">May 15, 2026</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                  <Clock className="size-4" /> Expiration Date
                </p>
                <p className="text-xl font-semibold text-white">Jun 15, 2026</p>
                <p className="text-sm text-emerald-500 mt-1">15 days remaining</p>
              </div>
            </div>
          </div>
        </div>

        {/* History Table */}
        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="text-xl">Membership History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-white/5 border-b-0">
                <TableRow className="border-b-0 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Plan Type</TableHead>
                  <TableHead className="text-muted-foreground">Start Date</TableHead>
                  <TableHead className="text-muted-foreground">End Date</TableHead>
                  <TableHead className="text-right text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membershipHistory.map((history) => (
                  <TableRow key={history.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium text-white">{history.type}</TableCell>
                    <TableCell className="text-muted-foreground">{history.startDate}</TableCell>
                    <TableCell className="text-muted-foreground">{history.endDate}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={history.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-white/5 text-muted-foreground border-white/10'
                      }>
                        {history.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </MemberLayout>
  );
}
