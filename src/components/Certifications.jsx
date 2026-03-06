import { certifications, achievements } from "../assets/contents"
import { motion } from "framer-motion"
import { PiCertificateBold } from "react-icons/pi"
import { FaTrophy } from "react-icons/fa"

export default function Certifications() {
    const slideIn = (delay, x) => ({
        hidden: { x: x, opacity: 0 },
        inview: { x: 0, opacity: 1, transition: { duration: 0.6, delay: delay } },
    })

    return (
        <div className="border-b border-neutral-900 pb-16">
            {/* Certifications */}
            <motion.h2
                whileInView={{ y: 0, opacity: 1 }}
                initial={{ y: -100, opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="my-20 text-center text-4xl"
            >
                Certifications
            </motion.h2>

            <div className="flex flex-wrap justify-center gap-6">
                {certifications.map((cert, index) => (
                    <motion.div
                        key={index}
                        variants={slideIn(0.3 + index * 0.15, index % 2 === 0 ? -60 : 60)}
                        initial="hidden"
                        whileInView="inview"
                        viewport={{ once: true }}
                        className="group relative w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)]"
                    >
                        <div className="mb-3 flex items-center gap-3">
                            <PiCertificateBold className={`text-2xl ${cert.color} transition-transform duration-300 group-hover:scale-110`} />
                            <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                                {cert.issuer}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-200 transition-colors duration-300 group-hover:text-white">
                            {cert.title}
                        </h3>
                    </motion.div>
                ))}
            </div>

            {/* Achievements */}
            <motion.h2
                whileInView={{ y: 0, opacity: 1 }}
                initial={{ y: -100, opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="my-20 text-center text-4xl"
            >
                Achievements
            </motion.h2>

            <div className="mx-auto max-w-3xl space-y-4">
                {achievements.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={slideIn(0.2 + index * 0.1, -80)}
                        initial="hidden"
                        whileInView="inview"
                        viewport={{ once: true }}
                        className="group flex items-start gap-4 rounded-lg border border-neutral-800/50 bg-neutral-900/40 px-6 py-4 transition-all duration-300 hover:border-yellow-500/30 hover:bg-neutral-900/70"
                    >
                        <FaTrophy className="mt-1 flex-shrink-0 text-xl text-yellow-500/70 transition-all duration-300 group-hover:text-yellow-400 group-hover:drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-neutral-200 transition-colors duration-300 group-hover:text-white">
                                {item.title}
                            </h3>
                        </div>
                        {item.year && (
                            <span className="flex-shrink-0 rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-400">
                                {item.year}
                            </span>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
