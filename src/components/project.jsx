import { project } from "../assets/contents"
import { motion } from "framer-motion"

export default function Project(){
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
            className="text-center my-20 text-4xl">Projects</motion.h2>
            <div>
                {project.map((project,index)=>(
                <div className="mb-8 flex flex-wrap lg:justify-center lg:items-center">
                    <div className="w-full lg:w-1/4 " key={index}>
                        <motion.img 
                        key={index}
                        variants={container(0.5 + index * 0.2, -100, 0.5)}
                        initial="hidden"
                        whileInView="inview"
                        className="rounded-2xl mb-6 h-70 w-70" src={project.image} alt={project.title} width={150} height={150}/>
                    </div>
                    <div className=" w-full max-w-xl lg:w-3/4">
                        <motion.h6 
                        key={index}
                        variants={container(0.5 + index * 0.2, 100, 0.5)}
                        initial="hidden"
                        whileInView="inview"
                        className="font-semibold mb-2">{project.title}</motion.h6>
                        <motion.p 
                        key={index}
                        variants={container(0.5 + index * 0.2, 100, 0.5)}
                        initial="hidden"
                        whileInView="inview"
                        className="mb-4 text-neutral-500">{project.description}</motion.p>
                    </div>
                </div>
                ))

                }
            </div>
        </div>
    )
}