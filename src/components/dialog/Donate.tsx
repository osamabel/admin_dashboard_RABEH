import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ForwardedRef, forwardRef, useState } from "react";
const apiPort = import.meta.env.VITE_API_PORT;
const apiUrl = import.meta.env.VITE_API_URL;
interface DonateProps {
  userId: string | number;
}

export const Donate = forwardRef<HTMLDivElement, DonateProps>(
  ({ userId }: DonateProps, ref: ForwardedRef<HTMLDivElement>) => {
    const [donateCoin, setDonateCoin] = useState(false);
    const [donateDiamond, setDonateDiamond] = useState(false);
    const [coinAmount, setCoinAmount] = useState("");
    const [diamondAmount, setDiamondAmount] = useState("");

    const handleDonation = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Sending coin donation if coin checkbox is selected
        if (donateCoin && coinAmount) {
          const coinResponse = await fetch(
            `${apiUrl}:${apiPort}/user/addCoin/${userId}/${coinAmount}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
              credentials: "include",
            }
          );
          if (!coinResponse.ok) throw new Error("Failed to donate coins");
        }

        // Sending diamond donation if diamond checkbox is selected
        if (donateDiamond && diamondAmount) {
          const diamondResponse = await fetch(
            `${apiUrl}:${apiPort}/user/addDiamond/${userId}/${diamondAmount}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
              credentials: "include",
            }
          );
          if (!diamondResponse.ok) throw new Error("Failed to donate diamonds");
        }

        alert("Donation successful!");
        window.location.reload();
      } catch (error) {
        console.error("Donation failed:", error);
        alert("Donation failed, please try again.");
      }
    };

    return (
      <div ref={ref}>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center justify-start gap-x-[10px] p-[5px] border-none h-auto w-full hover:bg-transparent"
            >
              <img width={16} src="/donate.png" alt="Donate" />
              <p>Donate</p>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="!rounded-[10px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Donate to User</AlertDialogTitle>
              <AlertDialogDescription>
                Select the type of donation and specify the amount.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col gap-4 my-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="donate-diamond"
                    checked={donateDiamond}
                    onChange={() => setDonateDiamond(!donateDiamond)}
                  />
                  <label
                    htmlFor="donate-diamond"
                    className="flex items-center gap-x-[5px]"
                  >
                    <p>Diamonds</p>
                    <img width={20} src="/diamond.svg" alt="" />
                  </label>
                </div>
                <input
                  type="number"
                  value={diamondAmount}
                  onChange={(e) => setDiamondAmount(e.target.value)}
                  placeholder="Amount of Diamonds"
                  className="border p-2 rounded-[10px]"
                  disabled={!donateDiamond}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="donate-coin"
                    checked={donateCoin}
                    onChange={() => setDonateCoin(!donateCoin)}
                  />
                  <label
                    htmlFor="donate-coin"
                    className="flex items-center gap-x-[5px]"
                  >
                    <p>Coins</p>
                    <img width={20} src="/coin.svg" alt="" />
                  </label>
                </div>
                <input
                  type="number"
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(e.target.value)}
                  placeholder="Amount of Coins"
                  className="border p-2 rounded-[10px]"
                  disabled={!donateCoin}
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-[10px]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDonation}
                className="rounded-[10px] bg-green-600 hover:bg-green-700"
              >
                Donate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
);
