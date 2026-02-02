import 'dotenv/config'
import connectDB from './config/mongodb.js'
import doctorModel from './models/doctorModel.js'
import bcrypt from 'bcryptjs'

const seed = async () => {
	try {
		await connectDB()

		const count = await doctorModel.countDocuments()
		if (count > 0) {
			console.log('Doctors already exist in DB. Exiting.')
			process.exit(0)
		}

		const password = 'password123'
		const salt = await bcrypt.genSalt(10)
		const hashed = await bcrypt.hash(password, salt)

		const sampleDoctors = [
			{
				name: 'Dr. Richard James',
				email: 'richard@example.com',
				password: hashed,
				image: 'https://via.placeholder.coAm/300x300.png?text=Dr+Richard',
				speciality: 'General physician',
				degree: 'MBBS',
				experience: '4 Years',
				about: 'Experienced general physician.',
				fees: 50,
				address: { line1: '17th Cross', line2: 'Richmond' },
				date: Date.now(),
				slots_booked: {}
			},
			{
				name: 'Dr. Emily Larson',
				email: 'emily@example.com',
				password: hashed,
				image: 'https://via.placeholder.com/300x300.png?text=Dr+Emily',
				speciality: 'Gynecologist',
				degree: 'MBBS',
				experience: '3 Years',
				about: 'Experienced gynecologist.',
				fees: 60,
				address: { line1: '27th Cross', line2: 'Richmond' },
				date: Date.now(),
				slots_booked: {}
			},
			{
				name: 'Dr. Sarah Patel',
				email: 'sarah@example.com',
				password: hashed,
				image: 'https://via.placeholder.com/300x300.png?text=Dr+Sarah',
				speciality: 'Dermatologist',
				degree: 'MBBS',
				experience: '1 Year',
				about: 'Experienced dermatologist.',
				fees: 30,
				address: { line1: '37th Cross', line2: 'Richmond' },
				date: Date.now(),
				slots_booked: {}
			}
		]

		const created = await doctorModel.insertMany(sampleDoctors)
		console.log('Seeded doctors:', created.map(d => ({ id: d._id, name: d.name, email: d.email })))
		process.exit(0)
	} catch (error) {
		console.error('Seed error:', error)
		process.exit(1)
	}
}

seed()
