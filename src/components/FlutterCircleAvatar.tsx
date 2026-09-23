import React, { useState } from 'react';
import { User, CheckCircle2 } from 'lucide-react';

interface FlutterCircleAvatarProps {
  photoUrl: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export const FlutterCircleAvatar: React.FC<FlutterCircleAvatarProps> = ({
  photoUrl,
  name,
  size = 'lg',
  showBadge = true,
}) => {
  const [hasError, setHasError] = useState<boolean>(false);

  // Get initials (e.g. "SV" for Samantha Vance)
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'ST';

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-28 h-28 sm:w-36 sm:h-36 text-2xl',
    xl: 'w-36 h-36 sm:w-44 sm:h-44 text-3xl',
  };

  const badgeSizeClasses = {
    sm: 'w-3.5 h-3.5 bottom-0 right-0 p-0.5',
    md: 'w-4 h-4 bottom-0.5 right-0.5 p-0.5',
    lg: 'w-7 h-7 bottom-1 right-1 p-1',
    xl: 'w-8 h-8 bottom-1.5 right-1.5 p-1.5',
  };

  return (
    <div className={`relative inline-block select-none ${sizeClasses[size]} shrink-0`}>
      {/* Flutter CircleAvatar visual styling with gradient border ring */}
      <div className="w-full h-full rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl overflow-hidden flex items-center justify-center">
        {!hasError && photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            onError={() => setHasError(true)}
            className="w-full h-full rounded-full object-cover bg-slate-200 dark:bg-zinc-800"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-600 to-purple-800 flex flex-col items-center justify-center text-white font-bold tracking-wider shadow-inner">
            <span>{initials}</span>
          </div>
        )}
      </div>

      {showBadge && (
        <div
          className={`absolute ${badgeSizeClasses[size]} bg-emerald-500 text-white rounded-full shadow-lg border-2 border-white dark:border-zinc-900 flex items-center justify-center`}
          title="Active Student Record"
        >
          <CheckCircle2 className="w-full h-full" />
        </div>
      )}
    </div>
  );
};
