import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode, ScanLine } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { toast } from 'sonner';

interface QRScannerModalProps {
  onScan: (result: string) => void;
  trigger?: React.ReactNode;
}

export function QRScannerModal({ onScan, trigger }: QRScannerModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20 bg-primary">
            <QrCode className="size-4" />
            Scan QR
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-white/10 bg-[#0a0a0a]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="size-5 text-primary" />
            Scan Member QR
          </DialogTitle>
        </DialogHeader>
        <div className="rounded-xl overflow-hidden border border-white/10 relative bg-black/50 aspect-square flex items-center justify-center">
          {open ? (
            <Scanner
              onScan={(result) => {
                if (result && result.length > 0) {
                  const scannedValue = result[0].rawValue;
                  setOpen(false);
                  onScan(scannedValue);
                }
              }}
              onError={(error) => {
                console.error(error);
                // toast.error("Camera error or permission denied.");
              }}
            />
          ) : (
             <div className="text-muted-foreground text-sm">Initializing camera...</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
