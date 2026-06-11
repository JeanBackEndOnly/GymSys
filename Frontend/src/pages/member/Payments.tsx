import React from 'react';
import { MemberLayout } from '@/components/layout/MemberLayout';
import { CreditCard, Eye, FileText, Calendar, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const paymentHistory = [
  { id: 'TRX-9821', date: 'May 01, 2026', time: '10:15 AM', type: 'Monthly Plan', amount: '₱1,500.00', method: 'GCash', refCode: '10002349012', status: 'Completed' },
  { id: 'TRX-8344', date: 'Apr 01, 2026', time: '11:30 AM', type: 'Monthly Plan', amount: '₱1,500.00', method: 'Cash', refCode: '-', status: 'Completed' },
  { id: 'TRX-7712', date: 'Mar 10, 2026', time: '09:00 AM', type: 'Weekly Plan', amount: '₱400.00', method: 'GCash', refCode: '10009871234', status: 'Completed' },
];

export default function MemberPayments() {
  return (
    <MemberLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Payment History</h1>
          <p className="text-muted-foreground mt-1">View your past transactions and receipts.</p>
        </div>

        {/* History Table */}
        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="text-xl">Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/5 border-b-0">
                  <TableRow className="border-b-0 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-muted-foreground">Description</TableHead>
                    <TableHead className="text-muted-foreground">Amount</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-right text-muted-foreground">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-medium text-white">{payment.date}</TableCell>
                      <TableCell className="text-muted-foreground">{payment.type}</TableCell>
                      <TableCell className="text-white font-medium">{payment.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-normal">
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 hover:bg-white/10 text-muted-foreground hover:text-white" title="View Details">
                              <Eye className="size-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="matte-surface border-white/10 sm:max-w-[400px]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <FileText className="size-5 text-primary" /> 
                                Transaction Receipt
                              </DialogTitle>
                              <DialogDescription>
                                Payment details for {payment.id}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="mt-4 space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
                              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-muted-foreground text-sm">Amount Paid</span>
                                <span className="text-2xl font-bold text-white">{payment.amount}</span>
                              </div>
                              
                              <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground flex items-center gap-2"><CreditCard className="size-4"/> Method</span>
                                  <span className="text-white font-medium">{payment.method}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground flex items-center gap-2"><Calendar className="size-4"/> Date</span>
                                  <span className="text-white">{payment.date} {payment.time}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground flex items-center gap-2"><Hash className="size-4"/> Reference Code</span>
                                  <span className="text-white font-mono">{payment.refCode}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 text-center">
                              <p className="text-xs text-muted-foreground">
                                Payments can only be processed face-to-face at the front desk.
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </MemberLayout>
  );
}
