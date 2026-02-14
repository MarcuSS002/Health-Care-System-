import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'


const Appointment = () => {

  const { docId } = useParams()
  const { doctors, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
    console.log(docInfo);

  }

  const getAvailableDocSlots = async () => {
    if (!docInfo) return
    setDocSlots([])

    let today = new Date()
    for (let i = 0; i < 7; i++) {
      //getting date with index
      let currDate = new Date(today)
      currDate.setDate(today.getDate() + i)

      //setting end time of the date with index
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      //setting hours
      if (today.getDate() == currDate.getDate()) {
        currDate.setHours(currDate.getHours() > 10 ? currDate.getHours() + 1 : 10)
        currDate.setMinutes(currDate.getMinutes() > 30 ? 0 : 30)
      } else {
        currDate.setHours(10)
        currDate.setMinutes(0)
      }

      let timeSlots = []

      while (currDate < endTime) {
        let formattedTime = currDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currDate.getDate()
        let month = currDate.getMonth() + 1
        let year = currDate.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo?.slots_booked?.[slotDate]?.includes(slotTime) ? false : true

        if(isSlotAvailable) {
          //add slot to array
        timeSlots.push({
          dateTime: new Date(currDate),
          time: formattedTime
        })
        }
        
        //increment currtime by 30 minutes
        currDate.setMinutes(currDate.getMinutes() + 30)
      }
      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }

    try {
      if (!docSlots || !docSlots.length) {
        toast.error('No slots available for this doctor')
        return
      }

      let daySlots = docSlots[slotIndex] || []
      let selectedSlot = null

      if (!daySlots.length) {
        const fallbackDayIndex = docSlots.findIndex(s => s && s.length > 0)
        if (fallbackDayIndex === -1) {
          toast.error('No slots available for this doctor')
          return
        }
        const fallbackSlot = docSlots[fallbackDayIndex][0]
        setSlotIndex(fallbackDayIndex)
        setSlotTime(fallbackSlot.time)
        selectedSlot = fallbackSlot
      } else {
        selectedSlot = daySlots.find(s => s.time === slotTime) || daySlots[0]
        if (!selectedSlot) {
          toast.error('Please select a slot')
          return
        }
      }

      const date = selectedSlot.dateTime
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year
      const chosenTime = selectedSlot.time
      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime: chosenTime }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate(`/my-appointments?doc=${docId}`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    getAvailableDocSlots()
  }, [docInfo])

  useEffect(() => {
    console.log(docSlots);

  }, [docSlots])

  useEffect(() => {
    if (!docSlots || !docSlots.length) return
    const firstAvailableDay = docSlots.findIndex(s => s && s.length > 0)
    if (firstAvailableDay !== -1) {
      setSlotIndex(firstAvailableDay)
      setSlotTime(docSlots[firstAvailableDay][0].time)
    }

  }, [docSlots])

  return docInfo && (
    <div>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className=''>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex gap-2 items-center font-medium text-2xl text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center text-sm gap-2 text-gray-600 mt-1'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='border border-gray-400 py-0.5 px-2 rounded-full text-xs'>{docInfo.experience}</button>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>
              {docInfo.about}
            </p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>Appointment fee : <span className='text-gray-600'>₹{docInfo.fees}</span></p>
        </div>
      </div>

      {/*---------Bokking Slots-------- */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.map((item, index) => (
              <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                <p>{item[0] && item[0].dateTime.getDate()}</p>
              </div>
            ))
          }
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {(docSlots[slotIndex] || []).map((item, index) => (
            <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-2 rounded-full my-6'>Book an appointment</button>
      </div>
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment
