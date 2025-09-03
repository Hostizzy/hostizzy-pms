import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO, differenceInDays, addDays, isAfter, isBefore } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date utilities
export const formatDate = (date: string | Date, formatStr = "MMM dd, yyyy") => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export const formatCurrency = (amount: number, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-IN').format(num)
}

// Calculate room nights
export const calculateRoomNights = (checkIn: string, checkOut: string) => {
  return differenceInDays(parseISO(checkOut), parseISO(checkIn))
}

// Check if dates overlap
export const datesOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
) => {
  const s1 = parseISO(start1)
  const e1 = parseISO(end1)
  const s2 = parseISO(start2)
  const e2 = parseISO(end2)

  return isBefore(s1, e2) && isAfter(e1, s2)
}

// Generate date range
export const generateDateRange = (startDate: string, endDate: string) => {
  const dates = []
  let currentDate = parseISO(startDate)
  const end = parseISO(endDate)

  while (isBefore(currentDate, end) || currentDate.getTime() === end.getTime()) {
    dates.push(format(currentDate, 'yyyy-MM-dd'))
    currentDate = addDays(currentDate, 1)
  }

  return dates
}

// Reservation code generator
export const generateReservationCode = () => {
  const prefix = 'HH'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

// Property code generator
export const generatePropertyCode = (city: string, name: string) => {
  const cityCode = city.substring(0, 3).toUpperCase()
  const nameCode = name.split(' ').map(word => word.charAt(0)).join('').toUpperCase()
  const random = Math.random().toString(36).substring(2, 4).toUpperCase()
  return `HH-${cityCode}${nameCode}-${random}`
}

// Status color helpers
export const getReservationStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'tentative':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getChannelColor = (channel: string) => {
  switch (channel) {
    case 'direct':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'airbnb':
      return 'bg-pink-100 text-pink-800 border-pink-200'
    case 'mmt':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'booking':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// Validation helpers
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

export const isValidPincode = (pincode: string) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/
  return pincodeRegex.test(pincode)
}

// File helpers
export const getFileExtension = (filename: string) => {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export const isImageFile = (filename: string) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
  return imageExtensions.includes(getFileExtension(filename))
}

export const isPdfFile = (filename: string) => {
  return getFileExtension(filename) === 'pdf'
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Analytics helpers
export const calculateOccupancyRate = (roomNights: number, totalDays: number) => {
  if (totalDays === 0) return 0
  return (roomNights / totalDays) * 100
}

export const calculateADR = (revenue: number, roomNights: number) => {
  if (roomNights === 0) return 0
  return revenue / roomNights
}

export const calculateRevPAR = (revenue: number, totalDays: number) => {
  if (totalDays === 0) return 0
  return revenue / totalDays
}

// CSV helpers
export const parseCSVDate = (dateStr: string) => {
  // Handle various date formats from CSV
  const formats = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
    /^\d{1,2}\/\d{1,2}\/\d{4}$/, // M/D/YYYY
  ]

  if (formats[0].test(dateStr)) {
    return dateStr
  }

  if (formats[1].test(dateStr) || formats[3].test(dateStr)) {
    const [month, day, year] = dateStr.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  if (formats[2].test(dateStr)) {
    const [month, day, year] = dateStr.split('-')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  throw new Error(`Invalid date format: ${dateStr}`)
}

export const sanitizeCSVValue = (value: string) => {
  return value?.toString().trim().replace(/[^\w\s-_.@]/g, '') || ''
}

// Error handling
export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
}

// Menu helpers
export const getMealTypeLabel = (mealType: string) => {
  const labels: Record<string, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    bbq: 'BBQ',
    alacarte: 'À la Carte'
  }
  return labels[mealType] || mealType
}

export const getAvailableDaysLabel = (days: string) => {
  const dayMap: Record<string, string> = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday'
  }

  const dayList = days.split(',').map(day => dayMap[day.trim()] || day.trim())
  
  if (dayList.length === 7) return 'All Days'
  if (dayList.length === 5 && !dayList.includes('Saturday') && !dayList.includes('Sunday')) {
    return 'Weekdays'
  }
  if (dayList.length === 2 && dayList.includes('Saturday') && dayList.includes('Sunday')) {
    return 'Weekends'
  }
  
  return dayList.join(', ')
}

// Truncate text helper
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Debounce helper
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout | null = null
  
  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}
