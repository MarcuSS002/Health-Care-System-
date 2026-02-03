
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-10 my-10 mt-40 text-sm'>
                {/* ---------Left Side------- */}
                <div>
                    <img className='mb-5 w-40' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>
                   Prescripto is a web application that helps users track and manage their health easily.
It allows users to monitor key health data, view reports, and stay updated about their health status in one place.
The system aims to make health tracking simple, organized, and accessible anytime, helping users take better care of themselves.
                    </p>
                </div>
                {/* ---------Center------- */}
                <div>
                    <p className='text-xl font-medium mb-5'>Company</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                {/* ---------Right Side------- */}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+0-000-000-000</li>
                        <li>harshgautam333@gmail.com</li>
                    </ul>
                </div>
            </div>
            {/* {Copyright Section} */}
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright {new Date().getFullYear()} @ Harsh's.dev - All Rights Reserved.</p>
            </div>
        </div>
    )
}

export default Footer
