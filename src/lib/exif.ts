export interface ExifData {
  dateTaken?: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
}

// Client-side EXIF extraction from ArrayBuffer
export async function extractExif(url: string): Promise<ExifData | null> {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return parseExifFromBuffer(buffer);
  } catch {
    return null;
  }
}

function parseExifFromBuffer(buffer: ArrayBuffer): ExifData | null {
  const view = new DataView(buffer);

  // Check for JPEG magic bytes
  if (view.getUint16(0) !== 0xFFD8) {
    return null;
  }

  let offset = 2;
  const length = view.byteLength;

  while (offset < length) {
    if (view.getUint8(offset) !== 0xFF) {
      offset++;
      continue;
    }

    const marker = view.getUint8(offset + 1);

    // APP1 marker (EXIF)
    if (marker === 0xE1) {
      const segmentLength = view.getUint16(offset + 2);
      const exifOffset = offset + 4;

      // Check for "Exif\0\0" header
      const exifHeader = String.fromCharCode(
        view.getUint8(exifOffset),
        view.getUint8(exifOffset + 1),
        view.getUint8(exifOffset + 2),
        view.getUint8(exifOffset + 3)
      );

      if (exifHeader === "Exif") {
        return parseExifData(view, exifOffset + 6);
      }
    }

    // Skip to next marker
    if (marker === 0xD8 || marker === 0xD9) {
      offset += 2;
    } else {
      const segmentLen = view.getUint16(offset + 2);
      offset += 2 + segmentLen;
    }
  }

  return null;
}

function parseExifData(view: DataView, tiffOffset: number): ExifData {
  const result: ExifData = {};

  // Determine endianness
  const endian = view.getUint16(tiffOffset);
  const littleEndian = endian === 0x4949; // "II" = little endian, "MM" = big endian

  const read16 = (off: number) => view.getUint16(off, littleEndian);
  const read32 = (off: number) => view.getUint32(off, littleEndian);

  // Get IFD0 offset
  const ifd0Offset = tiffOffset + read32(tiffOffset + 4);

  // Parse IFD0
  const ifd0Data = parseIFD(view, tiffOffset, ifd0Offset, littleEndian);

  // Get EXIF IFD offset (tag 0x8769)
  const exifIfdPointer = ifd0Data.get(0x8769);
  if (exifIfdPointer) {
    const exifIfdOffset = tiffOffset + exifIfdPointer;
    const exifData = parseIFD(view, tiffOffset, exifIfdOffset, littleEndian);

    // Extract relevant tags
    // DateTimeOriginal (0x9003)
    const dateOriginal = exifData.get(0x9003);
    if (dateOriginal) {
      result.dateTaken = formatExifDate(readString(view, tiffOffset + dateOriginal, 20));
    }

    // ExposureTime (0x829A)
    const exposureTime = exifData.get(0x829A);
    if (exposureTime) {
      const num = read32(tiffOffset + exposureTime);
      const den = read32(tiffOffset + exposureTime + 4);
      if (den > 0) {
        result.shutterSpeed = num >= den ? `${num / den}s` : `1/${Math.round(den / num)}s`;
      }
    }

    // FNumber (0x829D)
    const fNumber = exifData.get(0x829D);
    if (fNumber) {
      const num = read32(tiffOffset + fNumber);
      const den = read32(tiffOffset + fNumber + 4);
      if (den > 0) {
        result.aperture = `f/${(num / den).toFixed(1)}`;
      }
    }

    // ISO (0x8827)
    const iso = exifData.get(0x8827);
    if (iso !== undefined) {
      result.iso = iso;
    }

    // FocalLength (0x920A)
    const focalLength = exifData.get(0x920A);
    if (focalLength) {
      const num = read32(tiffOffset + focalLength);
      const den = read32(tiffOffset + focalLength + 4);
      if (den > 0) {
        result.focalLength = `${Math.round(num / den)}mm`;
      }
    }
  }

  // Camera make and model from IFD0
  const make = ifd0Data.get(0x010F);
  const model = ifd0Data.get(0x0110);
  if (make || model) {
    const makeStr = make ? readString(view, tiffOffset + make, 50).trim() : "";
    const modelStr = model ? readString(view, tiffOffset + model, 50).trim() : "";
    result.camera = modelStr.startsWith(makeStr) ? modelStr : `${makeStr} ${modelStr}`.trim();
  }

  return result;
}

function parseIFD(
  view: DataView,
  tiffOffset: number,
  ifdOffset: number,
  littleEndian: boolean
): Map<number, number> {
  const result = new Map<number, number>();

  try {
    const read16 = (off: number) => view.getUint16(off, littleEndian);
    const read32 = (off: number) => view.getUint32(off, littleEndian);

    const numEntries = read16(ifdOffset);

    for (let i = 0; i < numEntries; i++) {
      const entryOffset = ifdOffset + 2 + i * 12;
      const tag = read16(entryOffset);
      const type = read16(entryOffset + 2);
      const count = read32(entryOffset + 4);
      const valueOffset = entryOffset + 8;

      // For small values, data is inline; for larger values, it's an offset
      const typeSize = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8][type] || 1;
      const totalSize = count * typeSize;

      if (totalSize <= 4) {
        // Value is inline
        if (type === 3) { // SHORT
          result.set(tag, read16(valueOffset));
        } else if (type === 4) { // LONG
          result.set(tag, read32(valueOffset));
        } else {
          result.set(tag, read32(valueOffset));
        }
      } else {
        // Value is an offset
        result.set(tag, read32(valueOffset));
      }
    }
  } catch {
    // Ignore parsing errors
  }

  return result;
}

function readString(view: DataView, offset: number, maxLength: number): string {
  let str = "";
  try {
    for (let i = 0; i < maxLength; i++) {
      const char = view.getUint8(offset + i);
      if (char === 0) break;
      str += String.fromCharCode(char);
    }
  } catch {
    // Ignore
  }
  return str;
}

function formatExifDate(dateStr: string): string {
  // EXIF date format: "YYYY:MM:DD HH:MM:SS"
  const match = dateStr.match(/(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }
  return dateStr;
}
