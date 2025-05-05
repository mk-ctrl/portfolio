import { Experience } from "../assets/contents"
import { motion } from "framer-motion"

export default function Skills(){
    const container = (delay,x,duration)=>({
        hidden: {
            x:x,opacity:0
        },
        inview: {
            x:0,opacity:1,
            transition:{duration:duration, delay:delay}
        },
        
    })
    return(
        <div className="border-b border-neutral-900 pb-4">
            <motion.h2 
            whileInView={{y:0,opacity:1}}
            initial={{y:-100,opacity:0}}
            transition={{delay:0.5,duration:0.5}}
            className="my-20 text-center text-4xl">Experience</motion.h2>
            <div>
                { Experience.map((experience,index)=>(
                    <div className="mb-8 flex flex-wrap lg:justify-center" key={index}>
                        <div className="w-full lg:w-1/2">
                            <motion.p 
                            variants={container(0.5 + index * 0.2, -100, 0.5)}
                            initial="hidden"
                            whileInView="inview"
                            className="mb-2 text-sm text-neutral-400">{experience.year}</motion.p>
                        </div>
                        <div className="w-full max-w-xl lg:w-3/4">
                            <motion.h6 
                            variants={container(0.5 + index * 0.2, 100, 0.5)}
                            initial="hidden"
                            whileInView="inview"
                            className="mb-2 font-semibold">
                                {experience.role} -{" "} <span className="text-sm text-purple-100">{experience.company}</span>
                            </motion.h6>
                            <motion.p 
                            variants={container(0.5 + index * 0.2, 100, 0.5)}
                            initial="hidden"
                            whileInView="inview"
                            className="mb-4 text-neutral-400">{experience.description}</motion.p>
                            {experience.skills.map((tech,index)=>(
                                <motion.span 
                                variants={container(0.5 + index * 0.2, 100, 0.7)}
                                initial="hidden"
                                whileInView="inview"
                                key={index} 
                                className="mr-2 mt-4 rounded bg-neutral-900 px-2 py-1 text-sm font-medium text-purple-500">{tech}</motion.span>
                            ))}
                        </div>
                    </div>
                ))

                }
            </div>
        </div>
    )
}