'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChildProfiles } from '@/hooks/useAuth';
import { ChildProfile } from '@/lib/types/auth';

interface ProfileSelectorProps {
  onProfileSelected?: (profile: ChildProfile) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ onProfileSelected }) => {
  const { selectChildProfile } = useAuth();
  const { profiles, isLoading, error, refetch } = useChildProfiles();
  const [selectedProfile, setSelectedProfile] = useState<ChildProfile | null>(null);

  const handleProfileSelect = (profile: ChildProfile) => {
    setSelectedProfile(profile);
    selectChildProfile(profile);
    onProfileSelected?.(profile);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading profiles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium text-red-800 mb-2">Unable to Load Profiles</h3>
          <p className="text-sm text-red-700 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <svg className="w-12 h-12 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">No Child Profiles Found</h3>
          <p className="text-sm text-yellow-700">Please contact support to set up child profiles for your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Profile</h2>
        <p className="text-gray-600">Select your profile to continue to your personalized learning experience</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => handleProfileSelect(profile)}
            className={`relative p-6 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              selectedProfile?.id === profile.id
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-4 text-white text-2xl font-bold">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={`${profile.name}'s avatar`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  profile.name.charAt(0).toUpperCase()
                )}
              </div>

              {/* Name */}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{profile.name}</h3>

              {/* Age */}
              <p className="text-sm text-gray-500 mb-3">{profile.age} years old</p>

              {/* Game Mode Badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                profile.gameplay_mode === 'smart'
                  ? 'bg-green-100 text-green-800'
                  : profile.gameplay_mode === 'chill'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {profile.gameplay_mode === 'smart' ? 'Smart Mode' :
                 profile.gameplay_mode === 'chill' ? 'Chill Mode' : 'Challenge Mode'}
              </span>
            </div>

            {/* Selection Indicator */}
            {selectedProfile?.id === profile.id && (
              <div className="absolute top-2 right-2">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedProfile && (
        <div className="mt-8 text-center">
          <button
            onClick={() => handleProfileSelect(selectedProfile)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-lg font-medium"
          >
            Continue as {selectedProfile.name}
          </button>
        </div>
      )}
    </div>
  );
};