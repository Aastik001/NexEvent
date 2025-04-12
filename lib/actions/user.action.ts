'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '../mongodb/database'
import User from '../mongodb/database/models/user.model'
import Order from '../mongodb/database/models/order.model'
import Event from '../mongodb/database/models/event.model'
import { handleError } from '../utils'

import { CreateUserParams, UpdateUserParams } from '../../types'

export async function createUser(user: CreateUserParams) {
  try {
    console.log('Starting user creation process for:', user.email)
    await connectToDatabase()
    console.log('Successfully connected to database')

    console.log('Creating user in MongoDB...')
    const newUser = await User.create(user)
    console.log('Successfully created user:', newUser._id)
    
    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    console.error('Error creating user:', error)
    handleError(error)
    throw error // Re-throw to ensure webhook sees the error
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase()

    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase()

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })

    if (!updatedUser) throw new Error('User update failed')
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase()

    const userToDelete = await User.findOne({ clerkId })

    if (!userToDelete) {
      throw new Error('User not found')
    }

    await Promise.all([
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),

      Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
    ])

    const deletedUser = await User.findByIdAndDelete(userToDelete._id)
    revalidatePath('/')

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    handleError(error)
  }
}
