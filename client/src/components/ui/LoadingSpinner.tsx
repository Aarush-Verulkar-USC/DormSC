export default function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-12 ${className}`}>
      <div className="w-6 h-6 rounded-full border-2 border-line border-t-brand animate-spin" />
    </div>
  );
}
