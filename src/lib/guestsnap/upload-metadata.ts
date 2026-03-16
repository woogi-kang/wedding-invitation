import {
  getFileType,
  validateExtension,
  validateFileSize,
  validateMagicBytes,
} from './file-validator';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import type { GuestSnapFileType } from '@/types/guestsnap';

interface UploadMetadataInput {
  fileName: string;
  mimeType: string;
  size: number;
  headerBase64: string;
}

export interface UploadMetadataValidationResult {
  valid: boolean;
  error?: string;
  type?: GuestSnapFileType;
}

function decodeHeader(headerBase64: string): Uint8Array | null {
  if (!headerBase64 || typeof headerBase64 !== 'string') {
    return null;
  }

  try {
    return Uint8Array.from(Buffer.from(headerBase64, 'base64'));
  } catch {
    return null;
  }
}

export async function validateUploadMetadataServer(
  input: UploadMetadataInput
): Promise<UploadMetadataValidationResult> {
  const { fileName, mimeType, size, headerBase64 } = input;

  if (!fileName || fileName.trim() === '') {
    return { valid: false, error: '파일 이름이 없어요' };
  }

  if (!validateExtension(fileName)) {
    return { valid: false, error: GUEST_SNAP_CONFIG.messages.invalidFileType };
  }

  const fileType = getFileType(mimeType);
  if (!fileType) {
    return { valid: false, error: GUEST_SNAP_CONFIG.messages.invalidFileType };
  }

  const sizeValidation = validateFileSize(size, fileType);
  if (!sizeValidation.valid) {
    return { valid: false, error: sizeValidation.error };
  }

  const headerBytes = decodeHeader(headerBase64);
  if (!headerBytes) {
    return { valid: false, error: '파일 헤더를 읽을 수 없어요' };
  }

  const headerBuffer = headerBytes.buffer.slice(
    headerBytes.byteOffset,
    headerBytes.byteOffset + headerBytes.byteLength
  ) as ArrayBuffer;
  const magicBytesValid = await validateMagicBytes(headerBuffer, mimeType);
  if (!magicBytesValid) {
    return { valid: false, error: '파일 형식이 올바르지 않아요' };
  }

  return {
    valid: true,
    type: fileType,
  };
}
