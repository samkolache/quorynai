import { Button } from "@/components/ui/button"
import { GoogleIcon } from "./SocialIcons"

// "or continue with" divider followed by the Google button, shared by sign-in and sign-up.
function GoogleSignIn() {
    return (
        <>
            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-foreground/50">
                <span className="h-px flex-1 bg-primary/30" />
                or continue with
                <span className="h-px flex-1 bg-primary/30" />
            </div>

            {/* TODO: hook this up to Google sign-in once auth is set up. */}
            <Button type="button" variant="outline" size="md" className="w-full bg-transparent">
                <GoogleIcon className="size-5" />
                Google
            </Button>
        </>
    )
}

export default GoogleSignIn
