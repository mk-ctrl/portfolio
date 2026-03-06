import { project } from "../assets/contents"
import { motion } from "framer-motion"

export default function Project() {
    const cardVariant = (delay) => ({
        hidden: { y: 60, opacity: 0 },
        inview: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, delay: delay },
        },
    })

    const statusColor = (status) => {
        if (status?.toLowerCase().includes("finished")) return "text-green-400 border-green-400/30 bg-green-400/10"
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
    }

    return (
        <div className="border-b border-neutral-900 pb-16">
            <motion.h2
                whileInView={{ y: 0, opacity: 1 }}
                initial={{ y: -100, opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="my-20 text-center text-4xl"
            >
                Projects
            </motion.h2>

            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-1 md:grid-cols-2">
                {project.map((proj, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariant(0.2 + index * 0.15)}
                        initial="hidden"
                        whileInView="inview"
                        viewport={{ once: true }}
                        className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-400 hover:border-purple-500/30 hover:bg-white/10 hover:shadow-[0_8px_40px_-10px_rgba(168,85,247,0.2)]"
                    >
                        {/* Subtle gradient accent on top */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

                        <div>
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <h3 className="text-lg font-semibold text-neutral-100 transition-colors duration-300 group-hover:text-white">
                                    {proj.title}
                                </h3>
                                {proj.status && (
                                    <span className={`flex-shrink-0 rounded-full border px-3 py-0.5 text-[11px] font-medium uppercase tracking-wider ${statusColor(proj.status)}`}>
                                        {proj.status}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm leading-relaxed text-neutral-400 transition-colors duration-300 group-hover:text-neutral-300">
                                {proj.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}