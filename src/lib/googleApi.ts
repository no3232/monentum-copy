// Google Tasks API - fetch 기반 (Chrome Extension 호환)

import type { Task } from "../types";

// Google Tasks API 응답 타입
export interface GoogleTask {
  id?: string;
  title?: string;
  status?: string;
  updated?: string;
  notes?: string;
  due?: string;
}

export interface TasksListResponse {
  items?: GoogleTask[];
}

let accessToken: string | null = null;
let tokenRefresher: ((oldToken: string) => Promise<string>) | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

/**
 * 토큰 갱신 함수를 등록합니다.
 * 401 에러 발생 시 이 함수를 호출하여 토큰을 갱신합니다.
 */
export const setTokenRefresher = (
  refresher: (oldToken: string) => Promise<string>
) => {
  tokenRefresher = refresher;
};

const apiRequest = async <T>(
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
  body?: Record<string, unknown>,
  isRetry = false
): Promise<T> => {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`https://www.googleapis.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  // 401 에러 시 토큰 갱신 후 재시도 (1회만)
  if (response.status === 401 && !isRetry && tokenRefresher && accessToken) {
    try {
      console.log("토큰 만료됨, 자동 갱신 시도...");
      const newToken = await tokenRefresher(accessToken);
      accessToken = newToken;
      // 새 토큰으로 재시도
      return apiRequest<T>(path, method, body, true);
    } catch (refreshError) {
      console.error("토큰 갱신 실패:", refreshError);
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API Error: ${response.status}`);
  }

  // DELETE는 빈 응답
  if (method === "DELETE") {
    return {} as T;
  }

  return response.json();
};

// Google Tasks API 래퍼
export const tasksApi = {
  list: async (tasklistId: string = "@default") => {
    return apiRequest<TasksListResponse>(`/tasks/v1/lists/${tasklistId}/tasks`);
  },

  insert: async (
    title: string,
    options?: { notes?: string; due?: string },
    tasklistId: string = "@default"
  ) => {
    return apiRequest<GoogleTask>(
      `/tasks/v1/lists/${tasklistId}/tasks`,
      "POST",
      {
        title,
        ...(options?.notes && { notes: options.notes }),
        ...(options?.due && { due: options.due }),
      }
    );
  },

  update: async (
    taskId: string,
    updates: { status?: string; title?: string; notes?: string; due?: string },
    tasklistId: string = "@default"
  ) => {
    return apiRequest<GoogleTask>(
      `/tasks/v1/lists/${tasklistId}/tasks/${taskId}`,
      "PATCH",
      updates
    );
  },

  delete: async (taskId: string, tasklistId: string = "@default") => {
    await apiRequest<void>(
      `/tasks/v1/lists/${tasklistId}/tasks/${taskId}`,
      "DELETE"
    );
  },
};

// 사용자 정보 가져오기
export const getUserInfo = async (): Promise<{
  name: string;
  email: string;
  picture: string;
}> => {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return response.json();
};

// Task 타입은 외부에서 사용
export type { Task };
