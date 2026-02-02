import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {

  const { backendUrl, token } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const filterDocId = searchParams.get('doc')

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/user/appointments',
        { headers: { token } }
      )

      if (data.success) {
        setAppointments(data.appointments)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) getUserAppointments()
  }, [token])

  // 🔥 keep only latest appointment per doctor
  const latestAppointmentByDoctor = Object.values(
    appointments.reduce((acc, appt) => {
      if (
        !acc[appt.docId] ||
        new Date(appt.createdAt) > new Date(acc[appt.docId].createdAt)
      ) {
        acc[appt.docId] = appt
      }
      return acc
    }, {})
  )

  const finalAppointments = filterDocId
    ? latestAppointmentByDoctor.filter(a => a.docId === filterDocId)
    : latestAppointmentByDoctor

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>

      {finalAppointments.map((item) => (
        <div
          key={item._id}
          className="grid grid-cols-[1fr_2fr] gap-4 py-4 border-b sm:flex sm:gap-6"
        >
          <img
            className="w-32 bg-indigo-50"
            src={item.docData?.image}
            alt="Doctor"
          />

          <div className="flex-1 text-sm text-zinc-600">
            <p className="text-neutral-800 font-semibold">
              {item.docData?.name}
            </p>
            <p>{item.docData?.speciality}</p>

            <p className="text-zinc-700 font-medium mt-1">Address:</p>
            <p className="text-xs">{item.docData?.address?.line1 || '-'}</p>
            <p className="text-xs">{item.docData?.address?.line2 || '-'}</p>

            <p className="text-sm mt-1">
              <span className="font-medium">Date & Time:</span>{' '}
              {item.slotDate} | {item.slotTime}
            </p>
          </div>

          <div className="flex flex-col gap-2 justify-end">
            {!item.cancelled && !item.isCompleted && !item.payment ? (
              <>
                <button className="sm:min-w-48 py-2 border text-sm hover:bg-primary hover:text-white transition">
                  Pay Online
                </button>
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="sm:min-w-48 py-2 border text-sm hover:bg-red-600 hover:text-white transition"
                >
                  Cancel Appointment
                </button>
              </>
            ) : (
              <p className="text-sm text-right text-zinc-600">
                {item.cancelled
                  ? 'Cancelled'
                  : item.payment
                  ? 'Paid'
                  : 'Completed'}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyAppointments
