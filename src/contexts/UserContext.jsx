import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'Saud Masaud',
    email: 'saud.masaud@talentflow.com',
    role: 'Administrator',
    memberSince: '2024-01-01',
    avatar: 'SM'
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user data from localStorage on initialization
    const savedUser = localStorage.getItem('talentflow-user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing saved user data:', error)
      }
    }
    setLoading(false)
  }, [])

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('talentflow-user', JSON.stringify(updatedUser))
  }

  const updateEmail = (newEmail) => {
    updateUser({ email: newEmail })
  }

  const updateName = (newName) => {
    updateUser({ name: newName })
  }

  const value = {
    user,
    updateUser,
    updateEmail,
    updateName,
    loading
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
