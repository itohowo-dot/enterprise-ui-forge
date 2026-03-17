import { useWallet } from "@/contexts/WalletContext";
import { truncatePrincipal } from "@/lib/contract";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function WalletConnectButton() {
  const { connected, principal, network, connecting, connect, disconnect } = useWallet();

  if (connecting) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting…
      </Button>
    );
  }

  if (connected && principal) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 font-mono text-xs">
            <Wallet className="h-4 w-4" />
            {truncatePrincipal(principal)}
            <Badge variant="secondary" className="ml-1 text-[10px] uppercase">
              {network}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="font-mono text-xs" disabled>
            {principal}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={disconnect} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={connect} className="gap-2">
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
