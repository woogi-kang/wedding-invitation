/**
 * Unit tests for file-validator.ts
 * Tests file validation utilities for Guest Snap feature
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  sanitizeGuestName,
  sanitizeFileName,
  generateUniqueFileName,
  getFileType,
  validateExtension,
  validateFileSize,
  validateMagicBytes,
  validateFileClient,
  validateGuestName,
  checkRateLimit,
} from '../file-validator';

describe('file-validator', () => {
  describe('sanitizeGuestName', () => {
    it('should trim whitespace', () => {
      expect(sanitizeGuestName('  홍길동  ')).toBe('홍길동');
    });

    it('should remove special characters', () => {
      expect(sanitizeGuestName('홍길동!@#$%')).toBe('홍길동');
    });

    it('should keep Korean characters', () => {
      expect(sanitizeGuestName('홍길동')).toBe('홍길동');
    });

    it('should keep English characters', () => {
      expect(sanitizeGuestName('John Smith')).toBe('John Smith');
    });

    it('should keep numbers', () => {
      expect(sanitizeGuestName('홍길동2')).toBe('홍길동2');
    });

    it('should keep hyphens', () => {
      expect(sanitizeGuestName('Kim-Park')).toBe('Kim-Park');
    });

    it('should replace multiple spaces with single space', () => {
      expect(sanitizeGuestName('홍   길동')).toBe('홍 길동');
    });

    it('should truncate to 30 characters', () => {
      const longName = 'a'.repeat(50);
      expect(sanitizeGuestName(longName).length).toBeLessThanOrEqual(30);
    });

    it('should handle mixed Korean and English', () => {
      expect(sanitizeGuestName('홍길동 John')).toBe('홍길동 John');
    });

    it('should handle empty string', () => {
      expect(sanitizeGuestName('')).toBe('');
    });

    it('should remove emojis', () => {
      expect(sanitizeGuestName('홍길동😀')).toBe('홍길동');
    });
  });

  describe('sanitizeFileName', () => {
    it('should preserve valid filename', () => {
      expect(sanitizeFileName('photo.jpg')).toBe('photo.jpg');
    });

    it('should replace spaces with underscores', () => {
      expect(sanitizeFileName('my photo.jpg')).toBe('my_photo.jpg');
    });

    it('should lowercase extension', () => {
      expect(sanitizeFileName('photo.JPG')).toBe('photo.jpg');
    });

    it('should remove special characters except underscore and hyphen', () => {
      // Special chars are replaced with _, then multiple _ are collapsed to single _
      expect(sanitizeFileName('photo!@#.jpg')).toBe('photo_.jpg');
    });

    it('should handle Korean filenames', () => {
      expect(sanitizeFileName('사진.jpg')).toBe('사진.jpg');
    });

    it('should handle no extension', () => {
      expect(sanitizeFileName('photo')).toBe('photo');
    });

    it('should truncate long filenames', () => {
      const longName = 'a'.repeat(100) + '.jpg';
      const result = sanitizeFileName(longName);
      expect(result.length).toBeLessThanOrEqual(100);
    });

    it('should replace multiple underscores with single', () => {
      expect(sanitizeFileName('photo___test.jpg')).toBe('photo_test.jpg');
    });
  });

  describe('generateUniqueFileName', () => {
    it('should generate IMG prefix for images', () => {
      const result = generateUniqueFileName('photo.jpg', 'image', 1);
      expect(result).toMatch(/^IMG_001_\d+\.jpg$/);
    });

    it('should generate VID prefix for videos', () => {
      const result = generateUniqueFileName('video.mp4', 'video', 1);
      expect(result).toMatch(/^VID_001_\d+\.mp4$/);
    });

    it('should pad sequence number to 3 digits', () => {
      const result = generateUniqueFileName('photo.jpg', 'image', 5);
      expect(result).toContain('_005_');
    });

    it('should handle sequence numbers over 999', () => {
      const result = generateUniqueFileName('photo.jpg', 'image', 1234);
      expect(result).toContain('_1234_');
    });

    it('should lowercase extension', () => {
      const result = generateUniqueFileName('photo.JPG', 'image', 1);
      expect(result).toMatch(/\.jpg$/);
    });

    it('should use the filename as extension when no dot present', () => {
      const result = generateUniqueFileName('photo', 'image', 1);
      // When no extension, the split returns 'photo' as the "extension"
      expect(result).toMatch(/\.photo$/);
    });
  });

  describe('getFileType', () => {
    it('should return image for jpeg', () => {
      expect(getFileType('image/jpeg')).toBe('image');
    });

    it('should return image for png', () => {
      expect(getFileType('image/png')).toBe('image');
    });

    it('should return image for heic', () => {
      expect(getFileType('image/heic')).toBe('image');
    });

    it('should return image for webp', () => {
      expect(getFileType('image/webp')).toBe('image');
    });

    it('should return video for mp4', () => {
      expect(getFileType('video/mp4')).toBe('video');
    });

    it('should return video for quicktime', () => {
      expect(getFileType('video/quicktime')).toBe('video');
    });

    it('should return null for unsupported types', () => {
      expect(getFileType('application/pdf')).toBeNull();
    });

    it('should return null for text files', () => {
      expect(getFileType('text/plain')).toBeNull();
    });

    it('should return null for executable', () => {
      expect(getFileType('application/x-executable')).toBeNull();
    });
  });

  describe('validateExtension', () => {
    it('should accept jpg extension', () => {
      expect(validateExtension('photo.jpg')).toBe(true);
    });

    it('should accept jpeg extension', () => {
      expect(validateExtension('photo.jpeg')).toBe(true);
    });

    it('should accept png extension', () => {
      expect(validateExtension('photo.png')).toBe(true);
    });

    it('should accept heic extension', () => {
      expect(validateExtension('photo.heic')).toBe(true);
    });

    it('should accept webp extension', () => {
      expect(validateExtension('photo.webp')).toBe(true);
    });

    it('should accept mp4 extension', () => {
      expect(validateExtension('video.mp4')).toBe(true);
    });

    it('should accept mov extension', () => {
      expect(validateExtension('video.mov')).toBe(true);
    });

    it('should reject exe extension', () => {
      expect(validateExtension('malware.exe')).toBe(false);
    });

    it('should reject bat extension', () => {
      expect(validateExtension('script.bat')).toBe(false);
    });

    it('should reject sh extension', () => {
      expect(validateExtension('script.sh')).toBe(false);
    });

    it('should reject js extension', () => {
      expect(validateExtension('code.js')).toBe(false);
    });

    it('should reject php extension', () => {
      expect(validateExtension('page.php')).toBe(false);
    });

    it('should reject pdf extension', () => {
      expect(validateExtension('document.pdf')).toBe(false);
    });

    it('should handle uppercase extensions', () => {
      expect(validateExtension('photo.JPG')).toBe(true);
    });
  });

  describe('validateFileSize', () => {
    it('should accept 0 byte file as invalid', () => {
      const result = validateFileSize(0, 'image');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('파일이 비어있어요');
    });

    it('should accept small image file', () => {
      const result = validateFileSize(1024, 'image');
      expect(result.valid).toBe(true);
    });

    it('should accept image file under 30MB', () => {
      const result = validateFileSize(29 * 1024 * 1024, 'image');
      expect(result.valid).toBe(true);
    });

    it('should reject image file over 30MB', () => {
      const result = validateFileSize(31 * 1024 * 1024, 'image');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('30MB');
    });

    it('should accept video file under 500MB', () => {
      const result = validateFileSize(400 * 1024 * 1024, 'video');
      expect(result.valid).toBe(true);
    });

    it('should reject video file over 500MB', () => {
      const result = validateFileSize(501 * 1024 * 1024, 'video');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('500MB');
    });

    it('should accept exact limit image (30MB)', () => {
      const result = validateFileSize(30 * 1024 * 1024, 'image');
      expect(result.valid).toBe(true);
    });

    it('should accept exact limit video (500MB)', () => {
      const result = validateFileSize(500 * 1024 * 1024, 'video');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateMagicBytes', () => {
    it('should validate JPEG magic bytes', async () => {
      const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00]);
      const buffer = jpegBytes.buffer;
      const result = await validateMagicBytes(buffer, 'image/jpeg');
      expect(result).toBe(true);
    });

    it('should validate PNG magic bytes', async () => {
      const pngBytes = new Uint8Array([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00,
      ]);
      const buffer = pngBytes.buffer;
      const result = await validateMagicBytes(buffer, 'image/png');
      expect(result).toBe(true);
    });

    it('should validate WebP magic bytes (RIFF header)', async () => {
      const webpBytes = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0x00, 0x00]);
      const buffer = webpBytes.buffer;
      const result = await validateMagicBytes(buffer, 'image/webp');
      expect(result).toBe(true);
    });

    it('should reject mismatched magic bytes', async () => {
      const wrongBytes = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00]);
      const buffer = wrongBytes.buffer;
      const result = await validateMagicBytes(buffer, 'image/jpeg');
      expect(result).toBe(false);
    });

    it('should accept unknown mime types (pass through)', async () => {
      const someBytes = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00]);
      const buffer = someBytes.buffer;
      const result = await validateMagicBytes(buffer, 'application/unknown');
      expect(result).toBe(true);
    });
  });

  describe('validateFileClient', () => {
    function createMockFile(
      name: string,
      size: number,
      type: string
    ): File {
      const content = new Uint8Array(size);
      const blob = new Blob([content], { type });
      return new File([blob], name, { type });
    }

    it('should accept valid JPEG file', () => {
      const file = createMockFile('photo.jpg', 1024, 'image/jpeg');
      const result = validateFileClient(file);
      expect(result.valid).toBe(true);
      expect(result.type).toBe('image');
    });

    it('should accept valid PNG file', () => {
      const file = createMockFile('photo.png', 1024, 'image/png');
      const result = validateFileClient(file);
      expect(result.valid).toBe(true);
      expect(result.type).toBe('image');
    });

    it('should accept valid MP4 file', () => {
      const file = createMockFile('video.mp4', 1024, 'video/mp4');
      const result = validateFileClient(file);
      expect(result.valid).toBe(true);
      expect(result.type).toBe('video');
    });

    it('should reject file with no name', () => {
      const file = createMockFile('', 1024, 'image/jpeg');
      const result = validateFileClient(file);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('파일 이름이 없어요');
    });

    it('should reject file with whitespace only name', () => {
      const file = createMockFile('   ', 1024, 'image/jpeg');
      const result = validateFileClient(file);
      expect(result.valid).toBe(false);
    });

    it('should reject dangerous extension', () => {
      const file = createMockFile('script.exe', 1024, 'application/x-executable');
      const result = validateFileClient(file);
      expect(result.valid).toBe(false);
    });

    it('should reject unsupported mime type', () => {
      const file = createMockFile('document.pdf', 1024, 'application/pdf');
      const result = validateFileClient(file);
      expect(result.valid).toBe(false);
    });

    it('should reject oversized image', () => {
      const file = createMockFile('photo.jpg', 35 * 1024 * 1024, 'image/jpeg');
      const result = validateFileClient(file);
      expect(result.valid).toBe(false);
    });

    it('should reject oversized video', () => {
      const file = createMockFile('video.mp4', 600 * 1024 * 1024, 'video/mp4');
      const result = validateFileClient(file);
      expect(result.valid).toBe(false);
    });

    it('should reject empty file', () => {
      const file = createMockFile('photo.jpg', 0, 'image/jpeg');
      const result = validateFileClient(file);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateGuestName', () => {
    it('should accept valid Korean name', () => {
      const result = validateGuestName('홍길동');
      expect(result.valid).toBe(true);
    });

    it('should accept valid English name', () => {
      const result = validateGuestName('John Smith');
      expect(result.valid).toBe(true);
    });

    it('should accept name with numbers', () => {
      const result = validateGuestName('홍길동2');
      expect(result.valid).toBe(true);
    });

    it('should reject empty name', () => {
      const result = validateGuestName('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('존함을 입력해주세요');
    });

    it('should reject whitespace only', () => {
      const result = validateGuestName('   ');
      expect(result.valid).toBe(false);
    });

    it('should reject single character name', () => {
      const result = validateGuestName('홍');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('2글자 이상 입력해주세요');
    });

    it('should reject name over 20 characters', () => {
      const longName = '홍'.repeat(21);
      const result = validateGuestName(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('20글자 이하로 입력해주세요');
    });

    it('should reject special characters', () => {
      const result = validateGuestName('홍길동!@#');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('한글, 영문, 숫자만 입력 가능해요');
    });

    it('should accept hyphen in name', () => {
      const result = validateGuestName('Kim-Park');
      expect(result.valid).toBe(true);
    });

    it('should accept 2 character name (minimum)', () => {
      const result = validateGuestName('AB');
      expect(result.valid).toBe(true);
    });

    it('should accept 20 character name (maximum)', () => {
      const result = validateGuestName('a'.repeat(20));
      expect(result.valid).toBe(true);
    });
  });

  describe('checkRateLimit', () => {
    beforeEach(() => {
      // Clear rate limit state between tests
      vi.useFakeTimers();
    });

    it('should allow first request', () => {
      const result = checkRateLimit('test-ip-1', 30, 60000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(29);
    });

    it('should allow multiple requests within limit', () => {
      const id = 'test-ip-2';
      for (let i = 0; i < 10; i++) {
        checkRateLimit(id, 30, 60000);
      }
      const result = checkRateLimit(id, 30, 60000);
      expect(result.allowed).toBe(true);
    });

    it('should block requests over limit', () => {
      const id = 'test-ip-3';
      // Exhaust all requests
      for (let i = 0; i < 30; i++) {
        checkRateLimit(id, 30, 60000);
      }
      const result = checkRateLimit(id, 30, 60000);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset after window expires', () => {
      const id = 'test-ip-4';
      // Exhaust all requests
      for (let i = 0; i < 30; i++) {
        checkRateLimit(id, 30, 60000);
      }

      // Advance time past the window
      vi.advanceTimersByTime(61000);

      const result = checkRateLimit(id, 30, 60000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(29);
    });

    it('should return correct reset time', () => {
      const now = Date.now();
      const result = checkRateLimit('test-ip-5', 30, 60000);
      expect(result.resetTime).toBeGreaterThanOrEqual(now + 60000);
    });

    it('should handle different identifiers independently', () => {
      const id1 = 'test-ip-6a';
      const id2 = 'test-ip-6b';

      // Exhaust id1
      for (let i = 0; i < 30; i++) {
        checkRateLimit(id1, 30, 60000);
      }

      // id2 should still be allowed
      const result = checkRateLimit(id2, 30, 60000);
      expect(result.allowed).toBe(true);
    });

    afterEach(() => {
      vi.useRealTimers();
    });
  });
});
