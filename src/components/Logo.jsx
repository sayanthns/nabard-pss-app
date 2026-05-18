export function DeepflowLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="19" stroke="#1E4D2B" strokeWidth="2" fill="#F0F7F0" />
      <path d="M20 8 C14 8 9 13 9 20 C9 27 14 32 20 32" stroke="#1E4D2B" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M20 32 C26 32 31 27 31 20 C31 13 26 8 20 8" stroke="#52B788" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <circle cx="20" cy="20" r="4" fill="#1E4D2B"/>
      <path d="M20 14 L20 17" stroke="#1E4D2B" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 23 L20 26" stroke="#52B788" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function NabardLogo({ size = 36 }) {
  return (
    <svg width={size * 1.8} height={size} viewBox="0 0 72 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="70" height="38" rx="5" stroke="#1E4D2B" strokeWidth="1.5" fill="#F0F7F0"/>
      <text x="36" y="16" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1E4D2B" fontFamily="Georgia, serif">NABARD</text>
      <line x1="10" y1="20" x2="62" y2="20" stroke="#1E4D2B" strokeWidth="0.8" opacity="0.3"/>
      <text x="36" y="31" textAnchor="middle" fontSize="5.5" fill="#2D6A4F" fontFamily="Georgia, serif">National Bank for Agriculture</text>
    </svg>
  )
}
