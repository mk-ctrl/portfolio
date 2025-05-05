import {contact} from '../assets/contents'
import { motion } from 'framer-motion'

export default function Contact(){
    return(
        <motion.div 
        whileInView={{y:0,opacity:1}}
        initial={{y:100,opacity:0}}
        transition={{delay:0.5,duration:0.5}}
        className="border-b border-neutral-900 pb-20">
            <h2 className="my-10 text-center text-4xl">Contact</h2>
            <div className="text-center tracking-tighter">
                <p className="my-4">{contact.phno}</p>
                <p className="my-4">{contact.address}</p>
                <a href="#" className="border-b">{contact.mail}</a>
            </div>
        </motion.div>
    )
}