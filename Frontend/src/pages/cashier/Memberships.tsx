import React, { useState } from 'react';
import { CashierLayout } from '@/components/layout/CashierLayout';
import { cn } from '@/lib/utils';
import { 
  CreditCard,
  Search, 
  Plus, 
  RefreshCw,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  History,
  QrCode,
  User,
  Ban,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const membershipsData = [
  { id: 1, name: 'Alex Rivera', contact: '0917-123-4567', contract: 'Yearly', status: 'Active', start: '2024-03-10', expiry: '2025-03-10', code: 'CON-001', or_number: 'OR-1718290001' },
  { id: 2, name: 'Sarah Chen', contact: '0918-234-5678', contract: 'Monthly', status: 'Active', start: '2024-03-15', expiry: '2024-04-15', code: 'CON-002', or_number: 'OR-1718290002' },
  { id: 3, name: 'Mike Johnson', contact: '0919-345-6789', contract: 'Quarterly', status: 'Expired', start: '2023-10-20', expiry: '2024-01-20', code: 'CON-003', or_number: 'OR-1718290003' },
  { id: 4, name: 'Elena Rodriguez', contact: '0920-456-7890', contract: 'Monthly', status: 'Active', start: '2024-04-05', expiry: '2024-05-05', code: 'CON-004', or_number: 'OR-1718290004' },
  { id: 5, name: 'Chris Evans', contact: '0921-567-8901', contract: 'Yearly', status: 'Expired', start: '2022-12-12', expiry: '2023-12-12', code: 'CON-005', or_number: 'OR-1718290005' },
];

export default function CashierMemberships() {
  const [filter, setFilter] = useState('all');
  const [regPaymentMode, setRegPaymentMode] = useState('cash');
  const [renewPaymentMode, setRenewPaymentMode] = useState('cash');
  const [renewTransactionId, setRenewTransactionId] = useState('');
  const [regTransactionId, setRegTransactionId] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = membershipsData.filter(m => {
    const matchesFilter = filter === 'all' || (filter === 'active' && m.status === 'Active') || (filter === 'expired' && m.status === 'Expired');
    const matchesSearch = 
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.or_number.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <CashierLayout>
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Contracts & Members</h1>
            <p className="text-muted-foreground mt-1">Manage gym registrations and active contracts.</p>
          </div>
          <div className="flex items-center gap-3">
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 rounded-xl gap-2">
                  <RefreshCw className="size-4" />
                  Renew Contract
                </Button>
              </DialogTrigger>
              <DialogContent className="matte-surface border-white/10 sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Renew Contract</DialogTitle>
                  <DialogDescription>
                    Select an existing member and renew their gym access.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="member">Select Member</Label>
                    <Select>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Search member..." />
                      </SelectTrigger>
                      <SelectContent className="matte-surface border-white/10">
                        <SelectItem value="1">Alex Rivera</SelectItem>
                        <SelectItem value="3">Mike Johnson</SelectItem>
                        <SelectItem value="5">Chris Evans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="plan">New Contract Plan</Label>
                    <Select>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select contract duration" />
                      </SelectTrigger>
                      <SelectContent className="matte-surface border-white/10">
                        <SelectItem value="monthly">Monthly (₱1,500)</SelectItem>
                        <SelectItem value="quarterly">Quarterly (₱4,000)</SelectItem>
                        <SelectItem value="yearly">Yearly (₱15,000)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="method">Payment Method</Label>
                    <Select defaultValue="cash" onValueChange={setRenewPaymentMode}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent className="matte-surface border-white/10">
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="gcash">GCash (Face-to-Face)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {renewPaymentMode === 'gcash' ? (
                    <div className="grid gap-2 animate-in fade-in slide-in-from-top-1 mt-2">
                      <Label htmlFor="renew-ref">GCash Transaction ID <span className="text-destructive">*</span></Label>
                      <Input id="renew-ref" placeholder="e.g. 10023456789" value={renewTransactionId} onChange={(e) => setRenewTransactionId(e.target.value)} className="bg-white/5 border-white/10 font-mono tracking-widest" required />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-1 mt-1">
                      <Checkbox id="renew-cash-confirm" className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
                      <Label htmlFor="renew-cash-confirm" className="text-xs font-medium leading-tight cursor-pointer">
                        Did you receive the exact payment in cash?
                      </Label>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit" className="rounded-xl w-full">Process Renewal</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
                  <Plus className="size-4" />
                  Register New Member
                </Button>
              </DialogTrigger>
              <DialogContent className="matte-surface border-white/10 sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Register New Member</DialogTitle>
                  <DialogDescription>
                    Create account and charge the 1-time membership registration fee.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="registered-user">Select Pre-Registered User</Label>
                    <Select>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Search pending user..." />
                      </SelectTrigger>
                      <SelectContent className="matte-surface border-white/10">
                        <SelectItem value="user1">John Doe (john@example.com)</SelectItem>
                        <SelectItem value="user2">Jane Smith (jane@example.com)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">Users must register an account first before paying.</p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 mt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="size-4 text-emerald-500" />
                        <span className="text-sm font-medium">One-Time Membership Fee</span>
                      </div>
                      <span className="font-bold">₱500</span>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <Label>Payment Mode</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRegPaymentMode('cash')}
                        className={`h-10 rounded-xl border transition-all flex items-center justify-center gap-2 text-xs font-medium ${
                          regPaymentMode === 'cash' 
                          ? 'bg-white text-black border-white' 
                          : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                        }`}
                      >
                        Cash
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegPaymentMode('gcash')}
                        className={`h-10 rounded-xl border transition-all flex items-center justify-center gap-2 text-xs font-medium ${
                          regPaymentMode === 'gcash' 
                          ? 'bg-[#007DFE] text-white border-[#007DFE]' 
                          : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                        }`}
                      >
                        GCash
                      </button>
                    </div>
                  </div>

                  {regPaymentMode === 'gcash' ? (
                    <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 mt-2">
                      <Label htmlFor="reg-ref">GCash Transaction ID <span className="text-destructive">*</span></Label>
                      <Input id="reg-ref" placeholder="e.g. 10023456789" value={regTransactionId} onChange={(e) => setRegTransactionId(e.target.value)} className="bg-white/5 border-white/10" required />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-2">
                      <Checkbox id="cash-confirm" className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
                      <Label htmlFor="cash-confirm" className="text-xs font-medium leading-tight cursor-pointer">
                        Did you receive the exact payment in cash?
                      </Label>
                    </div>
                  )}

                </div>
                <DialogFooter>
                  <Button type="submit" className="rounded-xl w-full">Complete Registration</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass border-white/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Contracts</p>
                <h3 className="text-2xl font-bold">1,150</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-white/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-red-500/10 text-red-500">
                <XCircle className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expired Contracts</p>
                <h3 className="text-2xl font-bold">134</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-white/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                <History className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Renewals This Month</p>
                <h3 className="text-2xl font-bold">89</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass border-white/5">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-0">
            <Tabs value={filter} onValueChange={setFilter} className="w-full md:w-auto">
              <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg px-6">All Contracts</TabsTrigger>
                <TabsTrigger value="active" className="rounded-lg px-6">Active</TabsTrigger>
                <TabsTrigger value="expired" className="rounded-lg px-6">Expired</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search member, OR Number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-white/5 border-white/10 rounded-xl h-10" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-xl border border-white/5 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Member</TableHead>
                    <TableHead className="text-muted-foreground">Contract / OR Number</TableHead>
                    <TableHead className="text-muted-foreground">Contract Type</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Start Date</TableHead>
                    <TableHead className="text-muted-foreground">Expiry Date</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((record) => (
                    <TableRow key={record.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9 border border-white/10">
                            <AvatarFallback className="bg-white/5 text-xs">{record.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium leading-none">{record.name}</span>
                            <span className="text-xs text-muted-foreground mt-1">{record.contact}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-xs text-muted-foreground">{record.code}</span>
                          <span className="font-mono text-xs text-emerald-500/70">{record.or_number}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="size-3.5 text-muted-foreground" />
                          <span className="text-sm">{record.contract}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "h-6 text-[10px]",
                          record.status === 'Active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                        )}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {record.start}
                      </TableCell>
                      <TableCell className={cn(
                        "text-sm font-medium",
                        record.status === 'Expired' ? "text-red-400" : "text-muted-foreground"
                      )}>{record.expiry}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 hover:bg-white/10">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="matte-surface border-white/10 w-48">
                            <DropdownMenuLabel>Contract Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer gap-2">
                                  <User className="size-4" /> View Profile
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px] border-white/10 bg-[#0a0a0a]">
                                <DialogHeader>
                                  <DialogTitle>Member Profile</DialogTitle>
                                  <DialogDescription>Read-only view of {record.name}'s details.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="flex items-center gap-4">
                                    <Avatar className="size-16 border border-white/10">
                                      <AvatarFallback className="bg-white/5 text-xl">{record.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="text-xl font-bold text-white">{record.name}</h3>
                                      <p className="text-sm text-muted-foreground">{record.code}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                      <p className="text-xs text-muted-foreground">Contract Type</p>
                                      <p className="font-medium text-white">{record.contract}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                      <p className="text-xs text-muted-foreground">Status</p>
                                      <p className={cn("font-medium", record.status === 'Active' ? "text-emerald-500" : "text-red-500")}>{record.status}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 col-span-2">
                                      <p className="text-xs text-muted-foreground">Expiry Date</p>
                                      <p className="font-medium text-white">{record.expiry}</p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer gap-2">
                                  <RefreshCw className="size-4" /> Renew Contract
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="matte-surface border-white/10 sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Renew Contract</DialogTitle>
                                  <DialogDescription>
                                    Renew {record.name}'s gym access.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label>Member</Label>
                                    <Input value={record.name} disabled className="bg-white/5 border-white/10 text-muted-foreground" />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`plan-${record.id}`}>New Contract Plan</Label>
                                    <Select>
                                      <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue placeholder="Select contract duration" />
                                      </SelectTrigger>
                                      <SelectContent className="matte-surface border-white/10">
                                        <SelectItem value="monthly">Monthly (₱1,500)</SelectItem>
                                        <SelectItem value="quarterly">Quarterly (₱4,000)</SelectItem>
                                        <SelectItem value="yearly">Yearly (₱15,000)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label>Payment Method</Label>
                                    <Select defaultValue="cash" onValueChange={setRenewPaymentMode}>
                                      <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue placeholder="Select payment method" />
                                      </SelectTrigger>
                                      <SelectContent className="matte-surface border-white/10">
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="gcash">GCash (Face-to-Face)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  {renewPaymentMode === 'gcash' ? (
                                    <div className="grid gap-2 animate-in fade-in slide-in-from-top-1 mt-2">
                                      <Label>GCash Transaction ID <span className="text-destructive">*</span></Label>
                                      <Input placeholder="e.g. 10023456789" className="bg-white/5 border-white/10 font-mono tracking-widest" required />
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-1 mt-1">
                                      <Checkbox id={`renew-cash-${record.id}`} className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" />
                                      <Label htmlFor={`renew-cash-${record.id}`} className="text-xs font-medium leading-tight cursor-pointer">
                                        Did you receive the exact payment in cash?
                                      </Label>
                                    </div>
                                  )}
                                </div>
                                <DialogFooter>
                                  <Button type="submit" className="rounded-xl w-full">Process Renewal</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <DropdownMenuSeparator className="bg-white/5" />
                            
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
    </CashierLayout>
  );
}
