import type { ReactNode, MouseEvent } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react"

// Leans slightly toward the cursor for a little depth. Disabled for users who prefer reduced motion.
function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
    const reduce = useReducedMotion()
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 })
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 })

    function handleMove(e: MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - rect.left) / rect.width - 0.5)
        y.set((e.clientY - rect.top) / rect.height - 0.5)
    }

    function reset() {
        x.set(0)
        y.set(0)
    }

    if (reduce) return <div className={className}>{children}</div>

    return (
        <motion.div
            onMouseMove={handleMove}
            onMouseLeave={reset}
            style={{ rotateX, rotateY, transformPerspective: 900 }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export default TiltCard
