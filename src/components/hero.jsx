import {myDescription} from '../assets/contents'
import profile from '../assets/profile.jpeg'
export default function Hero(){
    return(
        <div className="border-b-1 border-neutral-900 pb-4 lg:mb-35">
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col items-center lg:items-start">
                        <h1 className="pb-6 text-5xl font-thin tracking-tight lg:mt-16 lg:text-7xl">Mirun Kaushik</h1>
                        <span className="bg-gradient-to-r from-red-500 via-amber-600 to-yellow-200 bg-clip-text text-4xl tracking-tight text-transparent">Full Stack Developer</span>
                        <p className='my-2 max-w-xl py-6 font-light tracking-tighter'>{myDescription}</p>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 lg:p-8">
                    <div className="flex justify-center">
                        <img src={profile} alt="" className='w-90 h-90 rounded-4xl'/>
                    </div>
                </div>
            </div>
        </div>
    )
}