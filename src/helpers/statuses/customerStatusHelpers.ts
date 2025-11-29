export type StatusKey = 'active' | 'warning' | 'banned'

export type StatusInfo = {
  bgClass: string
  textClass: string
}

export const CUSTOMER_STATUS: Record<StatusKey, StatusInfo> & {
  default: StatusInfo
} = {
  active: {
    bgClass: 'bg-green-100',
    textClass: 'text-green-800',
  },
  warning: {
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-800',
  },
  banned: {
    bgClass: 'bg-red-100',
    textClass: 'text-red-800',
  },
  default: {
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-700',
  }
}

export const getCustomerStatusInfo = (status?: string | null): StatusInfo => {
  if (!status) return CUSTOMER_STATUS.default
  return CUSTOMER_STATUS[status as StatusKey] ?? CUSTOMER_STATUS.default
}

export const getCustomerStatusClass = (status?: string | null) => {
  const info = getCustomerStatusInfo(status)
  return [
    'px-2',
    'inline-flex',
    'text-xs',
    'leading-5',
    'font-semibold',
    'rounded-full',
    info.bgClass,
    info.textClass
  ].join(' ')
}