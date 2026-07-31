import StarField from "@/components/layout/StarField"
import eyeLogo from "@/assets/eye-logo.svg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const fieldClass =
  "h-auto py-3 px-4 rounded-xl bg-background/30 border-border placeholder:text-foreground/30 focus-visible:border-primary focus-visible:ring-primary/30 [color-scheme:dark]"

function UserDetails() {
  return (
    <>
      <StarField />
      <div className="h-screen max-w-2xl mx-auto flex flex-col items-center px-6 pt-16 pb-8">
        {/* Logo mark */}
        <div className="mb-5">
          <img src={eyeLogo} alt="Quoryn" className="size-16 drop-shadow-[0_0_18px_rgba(83,74,183,0.8)]" />
        </div>

        {/* Brand name */}
        <p className="mb-4 text-xs tracking-[0.4em] text-foreground/50 uppercase">
          Quoryn
        </p>

        {/* Tagline */}
        <h1 className="mb-10 text-center text-[clamp(2rem,8vw,48px)] font-light text-foreground">
          the unseen, revealed.
        </h1>

        {/* Form card */}
        <div className="w-full rounded-2xl border border-border bg-card p-8 flex flex-col gap-6">
          {/* Full Birth Name */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs tracking-[0.2em] uppercase text-foreground/80">
              Full Birth Name
            </Label>
            <Input
              type="text"
              placeholder="As written at birth"
              className={fieldClass}
            />
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs tracking-[0.2em] uppercase text-foreground/80">
              Date of Birth
            </Label>
            <Input
              type="date"
              className={fieldClass}
            />
          </div>

          {/* Time of Birth */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs tracking-[0.2em] uppercase text-foreground/80">
              Time of Birth
            </Label>
            <Input
              type="time"
              className={fieldClass}
            />
          </div>

          {/* Place of Birth */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs tracking-[0.2em] uppercase text-foreground/80">
              Place of Birth
            </Label>
            <Input
              type="text"
              placeholder="City, country"
              className={fieldClass}
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs tracking-[0.2em] uppercase text-foreground/80">
              Gender
            </Label>
            <Select>
              <SelectTrigger className="w-full h-auto py-3 px-4 rounded-xl bg-background/30 border-border focus-visible:border-primary focus-visible:ring-primary/30 data-placeholder:text-foreground/30">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* CTA */}
        <Button
          size="cta"
          className="w-full mt-auto animate-pulse-glow"
        >
          Get Started
        </Button>
      </div>
    </>
  )
}

export default UserDetails
