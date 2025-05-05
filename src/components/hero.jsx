import {myDescription} from '../assets/contents'
import profile from '../assets/profile.jpeg'
import { motion } from "framer-motion"

export default function Hero(){
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
        <div className="border-b-1 border-neutral-900 pb-4 lg:mb-35">
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col items-center lg:items-start">
                        <motion.h1 
                        variants={container(0.5,-100,0.5)}
                        initial="hidden"
                        
                        whileInView="inview"
                        className="pb-6 text-5xl font-thin tracking-tight lg:mt-16 lg:text-7xl"
                        
                        >Mirun Kaushik
                        </motion.h1>
                        <motion.span 
                        variants={container(0.5,-100,0.5)}
                        initial="hidden"
                        //              animate="visible"
                        whileInView="inview"
                        className="bg-gradient-to-r from-red-500 via-amber-600 to-yellow-200 bg-clip-text text-3xl tracking-tight text-transparent"
                        >
                        Full Stack Developer
                        </motion.span>
                        <motion.p className='my-2 max-w-xl py-6 font-light tracking-tighter'
                        variants={container(1,-100,0.5)}
                        initial="hidden"
                        animate="visible"
                        whileInView="inview"
                        >{myDescription}</motion.p>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 lg:p-8">
                    <div className="flex justify-center">
                        <motion.img src={profile} alt="" 
                        variants={container(1,100,0.8)}
                        initial="hidden"
                        animate="visible"
                        whileInView="inview"
                        className='h-80 rounded-4xl lg:h-90'/>
                    </div>
                </div>
            </div>
        </div>
    )
}