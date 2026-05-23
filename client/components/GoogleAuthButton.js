'use client';

import { useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authClient } from '../lib/authClient';

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

export default function GoogleAuthButton({
    onSuccess,
    buttonClassName,
    buttonText = 'Continue with Google',
}) {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const handleCredentialResponse = useCallback(
        async (response) => {
            try {
                if (!response?.credential) {
                    toast.error('Google authentication failed');
                    return;
                }

                const result = await authClient.signIn.social({
                    provider: 'google',
                    idToken: {
                        token: response.credential,
                    },
                    disableRedirect: true,
                });

                console.log('Google Login Response:', result);

                if (result?.error) {
                    throw new Error(result.error?.message || 'Google login failed');
                }

                const data = result?.data ?? result;
                if (!data) {
                    throw new Error('Google login returned no data');
                }

                // Redirect handling
                if (data?.redirect && data?.url) {
                    window.location.href = data.url;
                    return;
                }

                // Extract user safely
                const rawUser =
                    data?.user ||
                    data?.session?.user ||
                    data?.data?.user ||
                    {};

                console.log('Raw User:', rawUser);

                // Normalize user data
                const normalizedUser = {
                    id: rawUser.id || '',

                    name:
                        rawUser.name ||
                        `${rawUser.firstName || ''} ${rawUser.lastName || ''}`.trim() ||
                        rawUser.email?.split('@')[0] ||
                        'User',

                    email:
                        rawUser.email ||
                        rawUser.account?.email ||
                        rawUser.profile?.email ||
                        '',

                    image:
                        rawUser.image ||
                        rawUser.picture ||
                        rawUser.photoURL ||
                        rawUser.avatar ||
                        rawUser.photo ||
                        '',

                    photo:
                        rawUser.image ||
                        rawUser.picture ||
                        rawUser.photoURL ||
                        rawUser.avatar ||
                        rawUser.photo ||
                        '',
                };

                console.log('Normalized User:', normalizedUser);

                onSuccess?.({
                    ...data,
                    user: normalizedUser,
                    token:
                        data?.token ||
                        data?.session?.token ||
                        data?.data?.session?.token ||
                        '',
                });

                toast.success('Google login successful');
            } catch (error) {
                console.error('Google auth error:', error);

                toast.error(
                    error?.message || 'Google login failed'
                );
            }
        },
        [onSuccess]
    );

    useEffect(() => {
        console.log('GoogleAuthButton mounting, clientId=', googleClientId);
        if (!googleClientId) {
            console.error(
                'NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing'
            );
            return;
        }

        const initializeGoogle = () => {
            console.log('Google SDK load callback triggered, google loaded=', !!window.google?.accounts?.id);
            if (!window.google?.accounts?.id) return;

            window.google.accounts.id.initialize({
                client_id: googleClientId,
                callback: handleCredentialResponse,
                ux_mode: 'popup',
                auto_select: false,
                cancel_on_tap_outside: true,
            });
        };

        // Already loaded
        if (window.google?.accounts?.id) {
            initializeGoogle();
            return;
        }

        // Script exists
        const existingScript = document.querySelector(
            `script[src="${GOOGLE_SCRIPT_SRC}"]`
        );

        if (existingScript) {
            existingScript.addEventListener(
                'load',
                initializeGoogle
            );

            return () => {
                existingScript.removeEventListener(
                    'load',
                    initializeGoogle
                );
            };
        }

        // Load script
        const script = document.createElement('script');

        script.src = GOOGLE_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.log('Google script loaded');
            initializeGoogle();
        };

        document.body.appendChild(script);

        return () => {
            script.removeEventListener(
                'load',
                initializeGoogle
            );

            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [googleClientId, handleCredentialResponse]);

    const handleClick = () => {
        const hasSDK = !!window.google?.accounts?.id;
        console.log('GoogleAuthButton clicked:', {
            hasSDK,
            googleClientIdExists: !!googleClientId,
            googleClientIdValue: googleClientId,
        });

        if (!googleClientId) {
            console.error('Google Client ID (NEXT_PUBLIC_GOOGLE_CLIENT_ID) is missing.');
            toast.error('Google Client ID is missing. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment.');
            return;
        }

        if (!hasSDK) {
            console.error('Google accounts SDK not loaded when button clicked.');
            toast.error(
                'Google script could not be loaded. Please disable your ad-blocker or Brave Shield and refresh.'
            );
            return;
        }

        window.google.accounts.id.prompt();
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={buttonClassName}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
            >
                <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.92c-.26 
                    1.38-1.04 2.55-2.21 3.33v2.77h3.57c2.08-1.92 
                    3.28-4.74 3.28-8.36z"
                />

                <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 
                    7.28-2.66l-3.57-2.77c-.98.66-2.23 
                    1.06-3.71 1.06-2.86 
                    0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 
                    20.53 7.7 23 12 23z"
                />

                <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 
                    8.55 1 10.22 1 12s.43 3.45 
                    1.18 4.93l2.85-2.22z"
                />

                <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 
                    4.21 1.64l3.15-3.15C17.45 
                    2.09 14.97 1 12 1 7.7 1 
                    3.99 3.47 2.18 7.07l3.66 
                    2.84c.87-2.6 3.3-4.53 
                    6.16-4.53z"
                />
            </svg>

            <span>{buttonText}</span>
        </button>
    );
}