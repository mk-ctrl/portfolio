import profile from '../assets/profile.jpeg'
import { aboutMe } from '../assets/contents'
import { motion } from 'framer-motion'
export default function About(){
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
            <motion.h1 
            whileInView={{y:0,opacity:1}}
            initial={{y:-100,opacity:0}}
            transition={{delay:0.5,duration:0.5}}
            className="my-20 text-center text-4xl">About <span className="text-neutral-500">Me</span></motion.h1>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/2 lg:p-8">
                    <div className="flex items-center justify-center">
                        <motion.img 
                        variants={container(0.7,-100,0.5)}
                        initial="hidden"
                        whileInView="inview"
                        src={profile} 
                        alt="" className='rounded-2xl h-80 lg:h-120'/>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                        <div className="flex justify-center lg:justify-start">
                            <motion.p 
                            variants={container(0.7,100,0.5)}
                            initial="hidden"
                            whileInView="inview"
                            className='my-2 max-w-xl py-6 lg:text-center'>{aboutMe}</motion.p>
                        </div>
                    </div>
            </div>
        </div>
    )
}