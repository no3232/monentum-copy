export interface ParsedUrl {
  type: 'youtube' | 'external' | 'app' | null;
  url: string;
  videoId?: string;
  scheme?: string; // 앱 딥링크의 스킴 (예: muvel, spotify, notion 등)
}

/**
 * notes 필드에서 URL을 추출하고 분류
 * 앱 딥링크 (muvel://, spotify://, notion:// 등) 모두 추출
 */
export function parseNotesForUrls(notes?: string): ParsedUrl[] {
  if (!notes) return [];

  // 모든 URL scheme 추출: http://, https://, 앱딥링크(scheme://)
  // path가 없어도 감지 (예: muvel://)
  const urlRegex = /[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^\s]*/g;
  const urls = notes.match(urlRegex);

  if (!urls) return [];

  return urls.map((url) => {
    // http/https가 아닌 경우 앱 딥링크로 분류
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      const schemeMatch = url.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
      return {
        type: 'app',
        url,
        scheme: schemeMatch ? schemeMatch[1] : undefined,
      };
    }

    // YouTube 링크 체크
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);

    if (match) {
      return {
        type: 'youtube',
        url,
        videoId: match[1],
      };
    }

    return {
      type: 'external',
      url,
    };
  });
}

/**
 * notes에서 @HH:mm 또는 [HH:mm] 형식의 알림 시간을 추출
 */
export function parseTimeFromNotes(notes?: string): string | null {
  if (!notes) return null;

  // @HH:mm 또는 [HH:mm] 형식 지원
  const timeRegex = /[@\\[](\d{2}):(\d{2})[\]@]?/;
  const match = notes.match(timeRegex);

  if (match) {
    return `${match[1]}:${match[2]}`;
  }

  return null;
}
