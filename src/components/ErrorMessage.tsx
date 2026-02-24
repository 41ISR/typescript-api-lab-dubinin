interface ErrorMessageProps {
  message: string
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">⚠️</div>
      <h2 className="empty-state-title">Error</h2>
      <p className="empty-state-text">{message}</p>
    </div>
  )
}
