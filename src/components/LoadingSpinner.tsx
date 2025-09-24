interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin`}></div>
      {text && (
        <p className="text-gray-600 font-medium">{text}</p>
      )}
    </div>
  )
}
