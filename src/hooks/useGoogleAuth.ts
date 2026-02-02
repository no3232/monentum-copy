import { useEffect, useCallback, useRef } from "react";
import type { UserProfile } from "../types";
import {
  setAccessToken,
  setTokenRefresher,
  getUserInfo,
} from "../lib/googleApi";
import { useAuthStore } from "../stores/useAuthStore";
import { useAppStore } from "../stores/useAppStore";

// Chrome Extension 환경 체크
const isChromeExtension = typeof chrome !== "undefined" && chrome.identity;

/**
 * Chrome Identity API를 사용하여 토큰을 가져옵니다.
 * Chrome이 자동으로 토큰 갱신을 처리합니다.
 */
const getAuthToken = (interactive: boolean): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive }, (result) => {
      const token = typeof result === 'string' ? result : result?.token;
      if (chrome.runtime.lastError || !token) {
        reject(
          new Error(
            chrome.runtime.lastError?.message || "토큰을 가져올 수 없습니다."
          )
        );
      } else {
        resolve(token);
      }
    });
  });
};

/**
 * 캐시된 토큰을 제거합니다. (로그아웃 또는 401 에러 시 사용)
 */
const removeCachedToken = (token: string): Promise<void> => {
  return new Promise((resolve) => {
    chrome.identity.removeCachedAuthToken({ token }, () => {
      resolve();
    });
  });
};

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
    saveUserProfile,
    restoreUserProfile,
  } = useAuthStore();

  const setUserProfile = useAppStore((state) => state.setUserProfile);
  const initRef = useRef(false);

  // 앱 스토어의 userProfile도 동기화
  useEffect(() => {
    setUserProfile(userProfile);
  }, [userProfile, setUserProfile]);

  // 토큰 갱신 함수를 googleApi에 등록
  useEffect(() => {
    if (isChromeExtension) {
      setTokenRefresher(async (oldToken: string) => {
        // 기존 토큰 캐시 제거
        await removeCachedToken(oldToken);
        // 새 토큰 발급 (interactive: false로 조용히)
        const newToken = await getAuthToken(false);
        // 상태 업데이트
        setAccessToken(newToken);
        setAuth({
          isAuthenticated: true,
          accessToken: newToken,
          userProfile,
        });
        return newToken;
      });
    }
  }, [userProfile, setAuth]);

  // 앱 시작 시 자동 로그인 시도
  useEffect(() => {
    if (initRef.current || !isChromeExtension) return;
    initRef.current = true;

    const tryAutoLogin = async () => {
      setLoading(true);
      try {
        // interactive: false로 조용히 토큰 요청
        const token = await getAuthToken(false);
        setAccessToken(token);

        // 저장된 프로필 복원 시도
        const savedProfile = restoreUserProfile();

        if (savedProfile) {
          setAuth({
            isAuthenticated: true,
            accessToken: token,
            userProfile: savedProfile,
          });
        } else {
          // 프로필이 없으면 API에서 가져오기
          const userInfo = await getUserInfo();
          const profile: UserProfile = {
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
          };
          saveUserProfile(profile);
          setAuth({
            isAuthenticated: true,
            accessToken: token,
            userProfile: profile,
          });
        }
      } catch {
        // 자동 로그인 실패 (로그인 필요)
        setAuth({
          isAuthenticated: false,
          accessToken: null,
          userProfile: null,
        });
      } finally {
        setLoading(false);
      }
    };

    tryAutoLogin();
  }, [setAuth, setLoading, restoreUserProfile, saveUserProfile]);

  // accessToken 변경 시 googleApi에 동기화
  useEffect(() => {
    setAccessToken(accessToken);
  }, [accessToken]);

  const login = useCallback(async () => {
    if (!isChromeExtension) {
      setError("Chrome Extension 환경에서만 사용 가능합니다.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // interactive: true로 로그인 창 표시
      const token = await getAuthToken(true);
      setAccessToken(token);

      // 사용자 정보 가져오기
      const userInfo = await getUserInfo();
      const profile: UserProfile = {
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
      };

      // 프로필 저장
      saveUserProfile(profile);

      // 상태 업데이트
      setAuth({
        isAuthenticated: true,
        accessToken: token,
        userProfile: profile,
      });
    } catch (err) {
      console.error("Login Error:", err);
      setError(err instanceof Error ? err.message : "로그인 실패");
    } finally {
      setLoading(false);
    }
  }, [setAuth, setLoading, setError, saveUserProfile]);

  const logout = useCallback(async () => {
    if (accessToken) {
      await removeCachedToken(accessToken);
    }
    setAccessToken(null);
    storeLogout();
    setUserProfile(null);
  }, [accessToken, storeLogout, setUserProfile]);

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
