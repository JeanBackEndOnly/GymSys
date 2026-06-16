import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { cn } from '@/lib/utils';
import { 
  Wallet,
  Search, 
  Plus, 
  CreditCard,
  Banknote,
  MoreHorizontal,
  CheckCircle2,
  Package,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contractService } from '@/services/contract.service';
import { walkinService } from '@/services/walkin.service';
import { productService } from '@/services/product.service';
import { userService } from '@/services/user.service';

export default function AdminPayments() {
  const [filter, setFilter] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [transactionType, setTransactionType] = useState('misc');
  const [transactionId, setTransactionId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: async (data: { id: number, type: string }) => {
      if (data.type === 'Renewal' || data.type === 'Membership') {
        return contractService.updateContract(data.id, {
          status: 'active',
          payment_status: 'paid'
        } as any);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contracts'] });
      toast.success('Payment approved and contract activated!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve payment');
    }
  });

  // Fetch all related data
  const { data: contracts = [] } = useQuery({ queryKey: ['admin-contracts'], queryFn: contractService.getAllContracts });
  const { data: walkins = [] } = useQuery({ queryKey: ['admin-walkin-attendance'], queryFn: walkinService.getWalkinAttendance });
  const { data: paychecks = [] } = useQuery({ queryKey: ['admin-paychecks'], queryFn: productService.getPaychecks });
  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: () => userService.getAllUsers({ role: 'member' }) });
  const { data: walkinProfiles = [] } = useQuery({ queryKey: ['admin-walkin-profiles'], queryFn: walkinService.getWalkins });

  // Map contracts
  const contractPayments = contracts.filter((c: any) => c.payment).map((c: any) => ({
    id: `CTR-${c.id}`,
    rawId: c.id,
    or_number: c.payment?.or_number || 'N/A',
    name: c.user ? `${c.user.firstname} ${c.user.lastname}` : 'Unknown Member',
    type: c.contract_type === 'renewal' ? 'Renewal' : 'Membership',
    amount: `₱${Number(c.payment?.payment_amount || 0).toLocaleString()}`,
    status: c.payment?.payment_status === 'paid' ? 'Completed' : 'Pending',
    date: c.payment?.paid_at ? new Date(c.payment.paid_at) : new Date(c.created_at),
    method: c.payment?.payment_type === 'gcash' ? 'GCash' : 'Cash'
  }));

  // Map walkins
  const walkinPayments = walkins.map((w: any) => {
    const profile = walkinProfiles.find((p: any) => p.id === w.walk_in_id);
    return {
      id: `WLK-${w.id}`,
      rawId: w.id,
      or_number: 'N/A',
      name: profile ? `${profile.firstname} ${profile.lastname}` : (w.walk_in_info ? `${w.walk_in_info.firstname} ${w.walk_in_info.lastname}` : 'Walk-in User'),
      type: 'Walk-in',
      amount: `₱${Number(w.fee_paid || 0).toLocaleString()}`,
      status: 'Completed',
      date: new Date(w.created_at),
      method: 'Cash'
    };
  });

  // Map products
  const productPayments = paychecks.map((p: any) => ({
    id: `POS-${p.id}`,
    rawId: p.id,
    or_number: p.or_number || 'N/A',
    name: p.paid_by_name || 'Walk-in Customer',
    type: 'Product',
    amount: `₱${Number(p.total_price || 0).toLocaleString()}`,
    status: p.payment_status === 'paid' ? 'Completed' : 'Pending',
    date: new Date(p.created_at),
    method: p.payment_type === 'gcash' ? 'GCash' : 'Cash'
  }));

  // Map registration fees
  const regFees = users.filter((u: any) => u.membership_fee).map((u: any) => ({
    id: `REG-${u.membership_fee.id}`,
    rawId: u.membership_fee.id,
    or_number: u.membership_fee.or_number || 'N/A',
    name: `${u.firstname} ${u.lastname}`,
    type: 'Registration',
    amount: `₱${Number(u.membership_fee.payment_amount || 0).toLocaleString()}`,
    status: u.membership_fee.payment_status === 'paid' ? 'Completed' : 'Pending',
    date: u.membership_fee.paid_at ? new Date(u.membership_fee.paid_at) : new Date(u.membership_fee.created_at),
    method: u.membership_fee.payment_type === 'gcash' ? 'GCash' : 'Cash'
  }));

  // Combine and sort
  const allPayments = [...contractPayments, ...walkinPayments, ...productPayments, ...regFees].sort((a, b) => b.date.getTime() - a.date.getTime());

  const filteredData = allPayments.filter(p => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'memberships' && (p.type === 'Membership' || p.type === 'Renewal' || p.type === 'Registration')) ||
      (filter === 'walkins' && p.type === 'Walk-in') ||
      (filter === 'products' && p.type === 'Product');

    const matchesSearch = 
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.or_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    if (type === 'Membership' || type === 'Renewal') return <CreditCard className="size-3.5" />;
    if (type === 'Walk-in') return <Banknote className="size-3.5" />;
    if (type === 'Product') return <Package className="size-3.5" />;
    return <Wallet className="size-3.5" />;
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Payments</h1>
            <p className="text-muted-foreground mt-1">Master ledger for all gym transactions.</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
                  <Plus className="size-4" />
                  Create Payment Record
                </Button>
              </DialogTrigger>
              <DialogContent className="matte-surface border-white/10 sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Manual Payment Entry</DialogTitle>
                  <DialogDescription>
                    Record a standalone transaction, miscellaneous fee, or manual override directly into the ledger.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tx-type">Transaction Type</Label>
                    <Select defaultValue="misc" onValueChange={setTransactionType}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="matte-surface border-white/10">
                        <SelectItem value="membership">Membership</SelectItem>
                        <SelectItem value="walkin">Walk-in</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="misc">Miscellaneous / Penalty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2 animate-in fade-in slide-in-from-top-1">
                    <Label htmlFor="client-name">Client Name</Label>
                    {transactionType === 'membership' || transactionType === 'walkin' ? (
                      <Select>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue placeholder="Select registered user..." />
                        </SelectTrigger>
                        <SelectContent className="matte-surface border-white/10">
                          {users.filter((u: any) => u.status === 'active').map((user: any) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.firstname} {user.lastname}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id="client-name" placeholder="e.g. John Doe (or leave blank)" className="bg-white/5 border-white/10" />
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (₱)</Label>
                    <Input id="amount" type="number" placeholder="0.00" className="bg-white/5 border-white/10" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="method">Payment Method</Label>
                    <Select defaultValue="cash" onValueChange={setPaymentMethod}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent className="matte-surface border-white/10">
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="gcash">GCash (Face-to-Face)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {paymentMethod === 'gcash' ? (
                    <div className="grid gap-2 animate-in fade-in slide-in-from-top-1 mt-2">
                      <Label htmlFor="ref">GCash Transaction ID <span className="text-destructive">*</span></Label>
                      <Input id="ref" placeholder="e.g. 10023456789" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="bg-white/5 border-white/10 font-mono tracking-widest" required />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-1 mt-1">
                      <Checkbox id="cash-confirm" className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
                      <Label htmlFor="cash-confirm" className="text-xs font-medium leading-tight cursor-pointer">
                        Did you receive the exact payment in cash?
                      </Label>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit" className="rounded-xl w-full">Record Transaction</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          <Card className="glass border-white/5 lg:col-span-2">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue (Today)</p>
                <h3 className="text-3xl font-bold mt-1 text-emerald-500">₱4,650.00</h3>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <Wallet className="size-8" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <CreditCard className="size-4" />
                <span className="text-sm">Memberships</span>
              </div>
              <h3 className="text-xl font-bold">₱3,000</h3>
            </CardContent>
          </Card>
          <Card className="glass border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Banknote className="size-4" />
                <span className="text-sm">Walk-ins</span>
              </div>
              <h3 className="text-xl font-bold">₱1,650</h3>
            </CardContent>
          </Card>
        </div>

        <Card className="glass border-white/5">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-0">
            <Tabs value={filter} onValueChange={setFilter} className="w-full md:w-auto">
              <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg px-6">All</TabsTrigger>
                <TabsTrigger value="memberships" className="rounded-lg px-6">Memberships</TabsTrigger>
                <TabsTrigger value="walkins" className="rounded-lg px-6">Walk-ins</TabsTrigger>
                <TabsTrigger value="products" className="rounded-lg px-6">Products</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search OR Number, TRX ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-white/5 border-white/10 rounded-xl h-10" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-xl border border-white/5 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Transaction ID / OR Number</TableHead>
                    <TableHead className="text-muted-foreground">Client</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Amount</TableHead>
                    <TableHead className="text-muted-foreground">Method</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((record) => (
                    <TableRow key={record.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-muted-foreground">{record.id}</span>
                          <span className="font-mono text-xs text-emerald-500/70">{record.or_number}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{record.name}</span>
                          <span className="text-xs text-muted-foreground">{record.date.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(record.type)}
                          <span className="text-sm">{record.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-bold">{record.amount}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{record.method}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "h-6 text-[10px] gap-1",
                          record.status === 'Completed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        )}>
                          {record.status === 'Completed' ? <CheckCircle2 className="size-3" /> : <ArrowUpRight className="size-3" />}
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 hover:bg-white/10">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="matte-surface border-white/10 w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            {record.status === 'Pending' && (record.type === 'Renewal' || record.type === 'Membership') && (
                              <DropdownMenuItem 
                                onSelect={(e) => {
                                  e.preventDefault();
                                  approveMutation.mutate({ id: record.rawId, type: record.type });
                                }} 
                                className="cursor-pointer gap-2 text-emerald-500 focus:text-emerald-500 focus:bg-emerald-500/10"
                                disabled={approveMutation.isPending}
                              >
                                <ShieldCheck className="size-4" /> {approveMutation.isPending ? 'Processing...' : 'Approve Payment'}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
