import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')

  const navigate = useNavigate()

  const { token, setToken, setUserData, backendUrl} = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      if (isForgotPassword) {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match')
          return
        }

        const { data } = await axios.post(backendUrl + '/api/user/forgot-password', { email, newPassword: password })
        if (data.success) {
          toast.success(data.message)
          setPassword('')
          setConfirmPassword('')
          setIsForgotPassword(false)
          setIsLogin(true)
        } else {
          toast.error(data.message)
        }
        return
      }

      if(!isLogin) {
        const { data } = await axios.post(backendUrl + '/api/user/register', {name, password, email})
        if(data.success) {
          localStorage.setItem('token', data.token)
          if (data.userData) {
            localStorage.setItem('userData', JSON.stringify(data.userData))
            setUserData(data.userData)
          }
          setToken(data.token)
          toast.success('Registered')
          setIsLogin(true)
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email})
        if(data.success) {
          localStorage.setItem('token', data.token)
          if (data.userData) {
            localStorage.setItem('userData', JSON.stringify(data.userData))
            setUserData(data.userData)
          }
          setToken(data.token)
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=> {
    if(token) {
      navigate('/')
    }
  }, [token])


  return (
    <div className="flex items-center justify-center min-h-[80vh]">
            <div className="relative min-w-[800px] rounded-[30px] shadow-lg overflow-hidden">
                <div className="flex transition-transform duration-500">
                    {/* Left Panel */}
                    <div className="w-1/2 bg-primary border rounded-r-[75px] p-10 flex flex-col justify-center items-center text-white">
                        <h2 className="text-2xl font-bold mb-2">{isForgotPassword ? 'Reset Password' : isLogin ? 'Hello, Welcome!' : 'Join Us!'}</h2>
                        <p className="mb-4">{isForgotPassword ? "Remembered your password?" : isLogin ? "Don't have an account?" : "Already have an account?"}</p>
                        <button 
                            onClick={() => {
                                if (isForgotPassword) {
                                    setIsForgotPassword(false)
                                    setIsLogin(true)
                                } else {
                                    setIsLogin(!isLogin)
                                }
                            }}
                            className="border border-white py-2 px-6 rounded-full hover:bg-white hover:text-blue-500 transition"
                        >
                            {isForgotPassword ? "Login" : isLogin ? "Register" : "Login"}
                        </button>
                    </div>
                    {/* Form Section */}
                    <div className="w-1/2 p-10">
                        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-600">{isForgotPassword ? 'Forgot Password' : isLogin ? 'Login' : 'Register'}</h2>
                        <form onSubmit={onSubmitHandler}>
                        {!isLogin && !isForgotPassword && (
                            <div className="mb-4 relative">
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder="Name" 
                                    className="w-full py-2 pl-4 border rounded-md bg-zinc-100" 
                                />
                            </div>
                        )}
                            
                                <div className="mb-4 relative">
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="Email" 
                                        className="w-full py-2 pl-4 border rounded-md bg-zinc-100" 
                                    />
                                </div>
                            <div className="mb-4 relative">
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder={isForgotPassword ? "New Password" : "Password"} 
                                    className="w-full py-2 pl-4 border rounded-md bg-zinc-100" 
                                />
                            </div>
                            {isForgotPassword && (
                                <div className="mb-4 relative">
                                    <input 
                                        type="password" 
                                        name="confirmPassword" 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        placeholder="Confirm New Password" 
                                        className="w-full py-2 pl-4 border rounded-md bg-zinc-100" 
                                    />
                                </div>
                            )}
                            {isLogin && !isForgotPassword && (
                                <div className="text-right mb-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsForgotPassword(true)
                                            setIsLogin(true)
                                            setPassword('')
                                            setConfirmPassword('')
                                        }}
                                        className="text-blue-500 text-sm"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}
                            {isForgotPassword && (
                                <div className="text-right mb-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsForgotPassword(false)
                                            setPassword('')
                                            setConfirmPassword('')
                                        }}
                                        className="text-blue-500 text-sm"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            )}
                            <button 
                                type="submit" 
                                className="w-full bg-primary text-white p-3 rounded-md"
                            >
                                {isForgotPassword ? 'Update Password' : isLogin ? 'Login' : 'Register'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Login
