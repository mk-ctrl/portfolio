import logo from '../assets/logo.png'
import {FaLinkedin,FaGithub,FaInstagram} from "react-icons/fa"
import {FaSquareXTwitter} from "react-icons/fa6"
export default function Navbar(){
    return(
        <nav className="mb-20 flex items-center justify-between py-6">
            <div className="flex flex-shrink-0 items-center">
                <img src={logo} alt="logo" className='w-18 h-20 object-contain'/>
            </div>
            <div className='flex justify-center m-8 items-center gap-4 text-2xl'>
                <FaLinkedin/>
                <FaGithub/>
                <FaInstagram/>
                <FaSquareXTwitter/>
            </div>
        </nav>
    )
}