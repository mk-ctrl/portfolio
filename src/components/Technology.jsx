import { RiReactjsLine} from 'react-icons/ri';
import { SiMongodb} from 'react-icons/si';
import { FaNodeJs} from 'react-icons/fa';
import { FaPython } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";
import { motion } from 'framer-motion';

export default function Technology(){
    const icons = (y1,duration)=>({
        initial: {y:y1},
        
        animate: {
            y: [10,-10],
            transition:{
            duration:duration,
            ease:"linear",
            repeat:Infinity,
            repeatType:"reverse",
        }
        }
    })
    return(
        <div className="border-b border-neutral-800 pb-24">
            <motion.h1 className="my-20 text-center text-4xl"
            whileInView={{y:0,opacity:1}}
            initial={{y:-100,opacity:0}}
            transition={{delay:0.5,duration:0.5}}
            >Technologies</motion.h1>
            <div className="flex flex-wrap items-center justify-center gap-4">
                <motion.div 
                variants={icons(-10,2.5)}
                initial="initial"
                animate="animate"
                className="rounded-2xl border-4 border-neutral-800 p-4">
                    <RiReactjsLine className='text-7xl text-cyan-400'></RiReactjsLine>
                </motion.div>
                <motion.div 
                variants={icons(10,4)}
                initial="initial"
                animate="animate"
                className="rounded-2xl border-4 border-neutral-800 p-4">
                    < SiMongodb className='text-7xl text-green-400'></ SiMongodb>
                </motion.div>
                <motion.div 
                variants={icons(-10,5.5)}
                initial="initial"
                animate="animate"
                className="rounded-2xl border-4 border-neutral-800 p-4">
                    <VscAzure className='text-7xl text-blue-400'></VscAzure>
                </motion.div>
                <motion.div 
                variants={icons(10,7)}
                initial="initial"
                animate="animate"
                className="rounded-2xl border-4 border-neutral-800 p-4">
                    <FaNodeJs className='text-7xl text-green-400'></FaNodeJs>
                </motion.div>
                <motion.div 
                variants={icons(-10,2.5)}
                initial="initial"
                animate="animate"
                className="rounded-2xl border-4 border-neutral-800 p-4">
                    < FaPython className='text-7xl text-yellow-400'></ FaPython>
                </motion.div>
                
            </div>
            
        </div>
    )
}