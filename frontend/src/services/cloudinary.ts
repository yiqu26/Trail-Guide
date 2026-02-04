const CLOUD_NAME = 'dblw3jamh';
const UPLOAD_PRESET = 'trailguilde';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

/**
 * 上傳圖片到 Cloudinary
 * @param file 圖片檔案
 * @param folder 資料夾名稱 (可選)
 * @returns 上傳結果，包含圖片 URL
 */
export async function uploadImage(
  file: File,
  folder?: string
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  if (folder) {
    formData.append('folder', folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('圖片上傳失敗');
  }

  return response.json();
}

/**
 * 取得優化後的圖片 URL
 * @param url 原始 Cloudinary URL
 * @param options 轉換選項
 */
export function getOptimizedUrl(
  url: string,
  options: { width?: number; height?: number; quality?: number } = {}
): string {
  const { width, height, quality = 80 } = options;

  // 檢查是否為 Cloudinary URL
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  // 建立轉換參數
  const transforms: string[] = [`q_${quality}`, 'f_auto'];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push('c_fill');

  // 插入轉換參數到 URL
  return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
}
