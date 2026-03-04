import { useEffect, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { FlagValues } from "@vercel/flags/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type SurveyModalProps = {
  open: boolean;
  source: "hero" | "footer";
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
};

const MAX_REASON_LENGTH = 300;

const SurveyModal = ({ open, source, onOpenChange, onComplete }: SurveyModalProps) => {
  const [buyChoice, setBuyChoice] = useState<"buy" | "not_buy" | "">("");
  const [buyReason, setBuyReason] = useState("");
  const [siteLike, setSiteLike] = useState<"yes" | "no" | "">("");
  const [siteReason, setSiteReason] = useState("");
  const [looksInterest, setLooksInterest] = useState<"yes" | "no" | "">("");
  const [looksReason, setLooksReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const flagValues = useMemo(() => {
    const values: Record<string, boolean> = {};
    if (buyChoice) {
      values.q_buy_choice = buyChoice === "buy";
    }
    if (siteLike) {
      values.q_site_like = siteLike === "yes";
    }
    if (looksInterest) {
      values.q_looks_interest = looksInterest === "yes";
    }
    return values;
  }, [buyChoice, siteLike, looksInterest]);

  useEffect(() => {
    if (!open) {
      setBuyChoice("");
      setBuyReason("");
      setSiteLike("");
      setSiteReason("");
      setLooksInterest("");
      setLooksReason("");
      setIsSubmitting(false);
    }
  }, [open]);

  const handleChoice = (
    key: "buyChoice" | "siteLike" | "looksInterest",
    value: "buy" | "not_buy" | "yes" | "no",
  ) => {
    if (key === "buyChoice" && (value === "buy" || value === "not_buy")) {
      setBuyChoice(value);
      track("survey_buy_choice", { choice: value, source }, { flags: ["q_buy_choice"] });
    }
    if (key === "siteLike" && (value === "yes" || value === "no")) {
      setSiteLike(value);
      track("survey_site_like", { choice: value, source }, { flags: ["q_site_like"] });
    }
    if (key === "looksInterest" && (value === "yes" || value === "no")) {
      setLooksInterest(value);
      track("survey_looks_interest", { choice: value, source }, { flags: ["q_looks_interest"] });
    }
  };

  const canSubmit =
    buyChoice !== "" && siteLike !== "" && looksInterest !== "" && !isSubmitting;

  const submitSurvey = async () => {
    if (!canSubmit) {
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          buyChoice,
          buyReason: buyReason.trim(),
          siteLike,
          siteReason: siteReason.trim(),
          looksInterest,
          looksReason: looksReason.trim(),
        }),
      });
    } catch {
      // Intentionally ignore network errors for checkout flow.
    }
    onOpenChange(false);
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border border-white/10 bg-black/95 text-white">
        <FlagValues values={flagValues} />
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-light tracking-wide text-white">
            Thank you for choosing Vostok.
          </DialogTitle>
          <p className="text-sm text-white/70">
            I am a small independent author, a few questions,{" "}
            <em className="text-white">will really help me out</em>.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
              A. Did you choose to buy or not to buy?
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={buyChoice === "buy" ? "default" : "outline"}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={() => handleChoice("buyChoice", "buy")}
              >
                Buy
              </Button>
              <Button
                type="button"
                variant={buyChoice === "not_buy" ? "default" : "outline"}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={() => handleChoice("buyChoice", "not_buy")}
              >
                Not Buy
              </Button>
            </div>
            <div>
              <Textarea
                value={buyReason}
                maxLength={MAX_REASON_LENGTH}
                onChange={(event) => setBuyReason(event.target.value)}
                placeholder="Why?"
                className="min-h-[90px] border-white/15 bg-black/60 text-white placeholder:text-white/40"
              />
              <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/50">
                {buyReason.length}/{MAX_REASON_LENGTH}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
              Do you like the site?
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={siteLike === "yes" ? "default" : "outline"}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={() => handleChoice("siteLike", "yes")}
              >
                Yes
              </Button>
              <Button
                type="button"
                variant={siteLike === "no" ? "default" : "outline"}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={() => handleChoice("siteLike", "no")}
              >
                No
              </Button>
            </div>
            <div>
              <Textarea
                value={siteReason}
                maxLength={MAX_REASON_LENGTH}
                onChange={(event) => setSiteReason(event.target.value)}
                placeholder="Why?"
                className="min-h-[90px] border-white/15 bg-black/60 text-white placeholder:text-white/40"
              />
              <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/50">
                {siteReason.length}/{MAX_REASON_LENGTH}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
              Are you into improving your looks?
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={looksInterest === "yes" ? "default" : "outline"}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={() => handleChoice("looksInterest", "yes")}
              >
                Yes
              </Button>
              <Button
                type="button"
                variant={looksInterest === "no" ? "default" : "outline"}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={() => handleChoice("looksInterest", "no")}
              >
                No
              </Button>
            </div>
            <div>
              <Textarea
                value={looksReason}
                maxLength={MAX_REASON_LENGTH}
                onChange={(event) => setLooksReason(event.target.value)}
                placeholder="Why?"
                className="min-h-[90px] border-white/15 bg-black/60 text-white placeholder:text-white/40"
              />
              <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/50">
                {looksReason.length}/{MAX_REASON_LENGTH}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="border-white/20 bg-transparent text-white hover:bg-white/10"
            onClick={() => {
              onOpenChange(false);
              onComplete();
            }}
            disabled={isSubmitting}
          >
            Skip & Continue
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-white/20 bg-transparent text-white hover:bg-white/10"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Close
          </Button>
          <Button
            type="button"
            className="bg-white text-black hover:bg-white/90"
            onClick={submitSurvey}
            disabled={!canSubmit}
          >
            {isSubmitting ? "Saving..." : "Continue to Checkout"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyModal;
