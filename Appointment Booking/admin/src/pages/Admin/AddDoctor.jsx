import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import {toast} from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

    const { backendUrl, aToken } = useContext(AdminContext)

    // const [docImg, setDocImg] = useState(false)
    // const [name, setName] = useState('')
    // const [password, setPassword] = useState('')
    // const [email, setNEmail] = useState('')
    // const [experience, setExperience] = useState('1 Year')
    // const [speciality, setSpeciality] = useState('General Physician')
    // const [degree, setDegree] = useState('')
    // const [fees, setFees] = useState('')
    // const [about, setAbout] = useState('')
    // const [address1, setAddress1] = useState('')
    // const [address2, setAddress2] = useState('')

    const [formData, setFormData] = useState({
        docImg: null,
        name: "",
        email: "",
        password: "",
        experience: "1 Year",
        speciality: "General Physician",
        degree: "",
        fees: "",
        about: "",
        address1: "",
        address2: ""
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("Form Data:", formData)

        // Adding API call logic here

        try {
            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === "docImg" && value) {
                    data.append("image", value)
                } else if (key !== "address1" && key !== "address2") {
                    // Append as an object
                    data.append(key, value)
                }
            })

            data.append("address", JSON.stringify({ line1: formData.address1, line2: formData.address2 }))

            // Send request
            const response = await axios.post(backendUrl + '/api/admin/add-doctor', data, {
                headers: { aToken }
            })

        if (response.data.success) {
            toast.success(response.data.message)

            // Reset the form after successful submission
            setFormData({
                docImg: null,
                name: "",
                email: "",
                password: "",
                experience: "1 Year",
                speciality: "General Physician",
                degree: "",
                fees: "",
                about: "",
                address1: "",
                address2: ""
            })

        } else {
            toast.error(response.data.message)
        }

    } catch (error) {
        console.log("Error submitting form:", error)
        toast.error("Something went wrong!")
    }
};

return (
    <form onSubmit={handleSubmit} className='m-5 w-full'>
        <p className='mb-3 text-lg font-medium'>Add Doctor</p>
        <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
            <div className='flex items-center gap-4 mb-8 text-gray-500'>
                <label htmlFor="doc-img">
                    <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={formData.docImg ? URL.createObjectURL(formData.docImg) : assets.upload_area} alt="" />
                </label>
                <input onChange={handleChange} name="docImg" type="file" id="doc-img" hidden />
                <p>Upload doctor <br /> picture</p>
            </div>

            <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                <div className='w-full lg:flex-1 flex flex-col gap-4'>
                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Doctor name</p>
                        <input onChange={handleChange} name="name" value={formData.name} className='border rounde px-3 py-3' type="text" placeholder='Name' required />
                    </div>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Doctor Email</p>
                        <input onChange={handleChange} name="email" value={formData.email} className='border rounde px-3 py-3' type="email" placeholder='Email' required />
                    </div>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Doctor Password</p>
                        <input onChange={handleChange} name="password" value={formData.password} className='border rounde px-3 py-3' type="password" placeholder='Password' required />
                    </div>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Experience</p>
                        <select onChange={handleChange} name="experience" value={formData.experience} className='border rounde px-3 py-3'>
                            <option value="1 Year">1 Year</option>
                            <option value="2 Year">2 Year</option>
                            <option value="3 Year">3 Year</option>
                            <option value="4 Year">4 Year</option>
                            <option value="5 Year">5 Year</option>
                            <option value="6 Year">6 Year</option>
                            <option value="7 Year">7 Year</option>
                            <option value="8 Year">8 Year</option>
                            <option value="9 Year">9 Year</option>
                            <option value="10 Year">10 Year</option>
                        </select>
                    </div>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Fees</p>
                        <input onChange={handleChange} name="fees" value={formData.fees} className='border rounde px-3 py-3' type="number" placeholder='fees' required />
                    </div>
                </div>
                <div className='w-full lg:flex-1 flex flex-col gap-4'>
                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Speciality</p>
                        <select onChange={handleChange} name="speciality" value={formData.speciality} className='border rounde px-3 py-3'>
                            <option value="General physician">General physician</option>
                            <option value="Gynecologist">Gynecologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatricians">Pediatricians</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Gastroenterologist">Gastroenterologist</option>
                        </select>
                    </div>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Education</p>
                        <input onChange={handleChange} name="degree" value={formData.degree} className='border rounde px-3 py-3' type="text" placeholder='Education' required />
                    </div>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p>Address</p>
                        <input onChange={handleChange} name="address1" value={formData.address1} className='border rounde px-3 py-3' type="text" placeholder='address 1' required />
                        <input onChange={handleChange} name="address2" value={formData.address2} className='border rounde px-3 py-3' type="text" placeholder='address 2' required />
                    </div>
                </div>
            </div>

            <div>
                <p className='mt-4 mb-2'>About</p>
                <textarea onChange={handleChange} name="about" value={formData.about} className='w-full px-4 pt-4 border rounded' placeholder='write about doctor' rows={5} required />
            </div>

            <button className='px-8 py-2 bg-primary mt-4 text-white rounded-full'>Add Doctor</button>
        </div>

    </form>
)
}

export default AddDoctor
