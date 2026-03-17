import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

export type TxStatus = "idle" | "pending" | "success" | "error";

interface TxStatusModalProps {
  status: TxStatus;
  txHash?: string;
  errorMessage?: string;
  onClose: () => void;
}

export function TxStatusModal({ status, txHash, errorMessage, onClose }: TxStatusModalProps) {
  if (status === "idle") return null;

  return (
    <Dialog open={status !== "idle"} onOpenChange={() => status !== "pending" && onClose()}>
      <DialogContent className="sm:max-w-md">
        {status === "pending" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                Submitting Transaction
              </DialogTitle>
              <DialogDescription>
                Your tip is being submitted to the Stacks network. This may take a moment…
              </DialogDescription>
            </DialogHeader>
          </>
        )}
        {status === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Tip Sent Successfully!
              </DialogTitle>
              <DialogDescription>
                Your tip has been submitted to the network.
              </DialogDescription>
            </DialogHeader>
            {txHash && (
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                <p className="font-mono text-xs break-all">{txHash}</p>
              </div>
            )}
            <DialogFooter>
              {txHash && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://explorer.stacks.co/txid/${txHash}?chain=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Explorer
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              )}
              <Button onClick={onClose}>Done</Button>
            </DialogFooter>
          </>
        )}
        {status === "error" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                Transaction Failed
              </DialogTitle>
              <DialogDescription>
                {errorMessage || "An unexpected error occurred. Please try again."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
