import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const navigate = useNavigate()

  const { token, setToken, backendUrl} = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {

      if(!isLogin) {
        const { data } = await axios.post(backendUrl + '/api/user/register', {name, password, email})
        if(data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Registered')
          setIsLogin(true)
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email})
        if(data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
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
                        <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Hello, Welcome!' : 'Join Us!'}</h2>
                        <p className="mb-4">{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className="border border-white py-2 px-6 rounded-full hover:bg-white hover:text-blue-500 transition"
                        >
                            {isLogin ? "Register" : "Login"}
                        </button>
                    </div>
                    {/* Form Section */}
                    <div className="w-1/2 p-10">
                        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-600">{isLogin ? 'Login' : 'Register'}</h2>
                        <form onSubmit={onSubmitHandler}>
                        {!isLogin && (
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
                                    placeholder="Password" 
                                    className="w-full py-2 pl-4 border rounded-md bg-zinc-100" 
                                />
                            </div>
                            {isLogin && (
                                <div className="text-right mb-4">
                                    <a href="#" className="text-blue-500 text-sm">Forgot Password?</a>
                                </div>
                            )}
                            <button 
                                type="submit" 
                                className="w-full bg-primary text-white p-3 rounded-md"
                            >
                                {isLogin ? 'Login' : 'Register'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Login
