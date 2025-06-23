import { useQuery } from '@tanstack/react-query'
import React, { createContext, useEffect, useState } from 'react'
import cartApi from '../apis/cart'
import { getAccessToken, getProfile } from '../common/auth'

export const AppContext = createContext()

const initAppContext = {
  isAuthenticated: Boolean(getAccessToken()),
  setIsAuthenticated: () => null,
  profile: getProfile(),
  setProfile: () => null,
  carts: [],
  setCarts: () => null,
  reset: () => null
}


export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initAppContext.isAuthenticated)
  const [profile, setProfile] = useState(initAppContext.profile)
  const [carts, setCarts] = useState([])

  const logout = () => {
    localStorage.removeItem('accessToken')
    setIsAuthenticated(false)
    setProfile(null)
    setCarts([])
  }

  // ✅ Thêm log để kiểm tra
  useEffect(() => {
    console.log('🔍 isAuthenticated:', isAuthenticated)
    console.log('🔍 profile:', profile)
  }, [profile, isAuthenticated])

  // ✅ Gọi API giỏ hàng nếu đúng điều kiện
  const { data: cartData, refetch } = useQuery({
  queryKey: ['carts'],
  queryFn: () => cartApi.getCart(),
  enabled: isAuthenticated && profile?.role?.name === 'Customer' // ✅ đúng rồi!
})

  useEffect(() => {
    console.log('🛒 API cartData:', cartData?.data)

    if (cartData?.data?.data && Array.isArray(cartData.data.data)) {
  setCarts(cartData.data.data)
    } else if (Array.isArray(cartData?.data)) {
      setCarts(cartData.data)
    } else {
      setCarts([])
    }
  }, [cartData])

  const handleRefetchCart = async () => {
    try {
      await refetch()
    } catch (err) {
      console.error('❌ Refetch Cart Error:', err)
    }
  }

  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
    setCarts([])
  }

  const contextValue = {
    isAuthenticated,
    setIsAuthenticated,
    profile,
    setProfile,
    carts,
    setCarts,
    handleRefetchCart,
    reset,
    logout
  }
  

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}
