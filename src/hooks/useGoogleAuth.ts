import { useEffect, useCallback } from 'react';
import type { UserProfile } from '../types';
import { setAccessToken, getUserInfo } from '../lib/googleApi';
import { useAuthStore } from '../stores/useAuthStore';
import { useAppStore } from '../stores/useAppStore';

// Chrome Extension 환경 체크
const isChromeExtension = typeof chrome !== 'undefined' && chrome.identity;

// 웹용 OAuth Client ID (기존 것 사용)
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const SCOPES = [
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
].join(' ');

export function useGoogleAuth() {
  const {
    isAuthenticated,
    accessToken,
    userProfile,
    isLoading,
    error,
    setAuth,
    setLoading,
    setError,
    logout: storeLogout,
    saveSession,
    restoreSession,
  } = useAuthStore();

  const setUserProfile = useAppStore((state) => state.setUserProfile);

  // 앱 스토어의 userProfile도 동기화
  useEffect(() => {
    setUserProfile(userProfile);
  }, [userProfile, setUserProfile]);

  // 세션 복원
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // accessToken 변경 시 googleApi에 동기화
  useEffect(() => {
    setAccessToken(accessToken);
  }, [accessToken]);

  const login = useCallback(async () => {
    if (!isChromeExtension) {
      setError('Chrome Extension 환경에서만 사용 가능합니다.');
      return;
    }

    if (!CLIENT_ID) {
      setError('Google Client ID가 설정되지 않았습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // launchWebAuthFlow로 OAuth 수행 (웹용 client ID 사용 가능)
      const redirectUrl = chrome.identity.getRedirectURL();
      console.log('=== Redirect URL (Google Cloud Console에 이 값을 추가하세요) ===');
      console.log(redirectUrl);
      console.log('================================================================');
      
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', redirectUrl);
      authUrl.searchParams.set('response_type', 'token');
      authUrl.searchParams.set('scope', SCOPES);
      authUrl.searchParams.set('prompt', 'consent');

      const responseUrl = await chrome.identity.launchWebAuthFlow({
        url: authUrl.toString(),
        interactive: true,
      });

      if (!responseUrl) {
        throw new Error('인증이 취소되었습니다.');
      }

      // URL에서 access_token 추출
      const hashParams = new URLSearchParams(responseUrl.split('#')[1]);
      const token = hashParams.get('access_token');
      const expiresIn = parseInt(hashParams.get('expires_in') || '3600', 10);

      if (!token) {
        throw new Error('토큰을 받지 못했습니다.');
      }

      // 토큰 설정
      setAccessToken(token);

      // 사용자 정보 가져오기
      const userInfo = await getUserInfo();
      const profile: UserProfile = {
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
      };

      // 세션 저장
      saveSession(token, profile, expiresIn);

      // 상태 업데이트
      setAuth({
        isAuthenticated: true,
        accessToken: token,
        userProfile: profile,
      });
    } catch (err) {
      console.error('Login Error:', err);
      setError(err instanceof Error ? err.message : '로그인 실패');
    } finally {
      setLoading(false);
    }
  }, [setAuth, setLoading, setError, saveSession]);

  const logout = useCallback(() => {
    setAccessToken(null);
    storeLogout();
    setUserProfile(null);
  }, [storeLogout, setUserProfile]);

  return {
    isAuthenticated,
    accessToken,
    userProfile,
    isLoading,
    error,
    login,
    logout,
  };
}
