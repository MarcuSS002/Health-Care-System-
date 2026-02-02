import { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Navbar = () => {

  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-400'>
      <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="Logo" />
      <ul className='md:flex items-start gap-2 font-medium sm:hidden'>
        <NavLink to='/'><li className='py-2 px-3 rounded-xl hover:bg-blue-50'>Home</li></NavLink>
        <NavLink to='/doctors'><li className='py-2 px-3 rounded-xl hover:bg-blue-50'>Doctors</li></NavLink>
        <NavLink to='/about'><li className='py-2 px-3 rounded-xl hover:bg-blue-50'>About</li></NavLink>
        <NavLink to='/contact'><li className='py-2 px-3 rounded-xl hover:bg-blue-50'>Contact</li></NavLink>
      </ul>
      <div className='flex items-center'>
        {
          token ?
            <div className='flex items-center gap-2 px-3 py-1 cursor-pointer group relative hover:bg-indigo-50 rounded-full'>
              <img className='w-8 rounded-full' src={userData?.image || assets.profile_pic} alt="Profile pic" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="" />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-10 hidden group-hover:block'>
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-2 p-4'>
                  <p onClick={() => { navigate('/my-profile') }} className='hover:text-primary cursor-pointer'>My Profile</p>
                  <p onClick={() => { navigate('/my-appointments') }} className='hover:text-primary cursor-pointer'>My Appointments</p>
                  <p onClick={logout} className='hover:text-primary cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
            : <button className='py-3 px-7 bg-primary rounded-full text-white' onClick={() => { navigate('/login') }}>Create Account</button>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 ml-1 cursor-pointer md:hidden' src={assets.menu_icon} alt="" />
        <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white `}>
          <div className='flex items-center justify-between py-6 px-5'>
            <img className='w-36' src={assets.logo} alt="" />
            <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>Doctors</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>About</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>Contact</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar