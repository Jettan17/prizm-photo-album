export interface ExifData {
  dateTaken?: string;
  camera?: string;
  lensModel?: string;
  focalLength?: string;
  focalLength35mm?: number;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  exposureBias?: string;
  latitude?: number;
  longitude?: number;
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

    // FocalLengthIn35mmFilm (0xA405)
    const focalLength35mm = exifData.get(0xA405);
    if (focalLength35mm !== undefined && focalLength35mm > 0) {
      result.focalLength35mm = focalLength35mm;
    }

    // ExposureBiasValue (0x9204) - signed rational
    const exposureBias = exifData.get(0x9204);
    if (exposureBias) {
      const num = readSigned32(view, tiffOffset + exposureBias, littleEndian);
      const den = readSigned32(view, tiffOffset + exposureBias + 4, littleEndian);
      if (den !== 0) {
        const ev = num / den;
        if (ev !== 0) {
          result.exposureBias = ev > 0 ? `+${ev.toFixed(1)} EV` : `${ev.toFixed(1)} EV`;
        }
      }
    }

    // LensModel (0xA434)
    const lensModel = exifData.get(0xA434);
    if (lensModel) {
      result.lensModel = readString(view, tiffOffset + lensModel, 100).trim();
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

  // GPS IFD (tag 0x8825)
  const gpsIfdPointer = ifd0Data.get(0x8825);
  if (gpsIfdPointer) {
    const gpsIfdOffset = tiffOffset + gpsIfdPointer;
    const gpsData = parseIFD(view, tiffOffset, gpsIfdOffset, littleEndian);

    // GPSLatitudeRef (0x0001) and GPSLatitude (0x0002)
    const latRef = gpsData.get(0x0001);
    const latValue = gpsData.get(0x0002);
    // GPSLongitudeRef (0x0003) and GPSLongitude (0x0004)
    const lonRef = gpsData.get(0x0003);
    const lonValue = gpsData.get(0x0004);

    if (latValue && lonValue) {
      const latRefChar = latRef ? String.fromCharCode(latRef & 0xFF) : "N";
      const lonRefChar = lonRef ? String.fromCharCode(lonRef & 0xFF) : "E";

      const lat = parseGpsCoordinate(view, tiffOffset + latValue, littleEndian);
      const lon = parseGpsCoordinate(view, tiffOffset + lonValue, littleEndian);

      if (lat !== null && lon !== null) {
        result.latitude = latRefChar === "S" ? -lat : lat;
        result.longitude = lonRefChar === "W" ? -lon : lon;
      }
    }
  }

  return result;
}

function parseGpsCoordinate(view: DataView, offset: number, littleEndian: boolean): number | null {
  try {
    const read32 = (off: number) => view.getUint32(off, littleEndian);

    // GPS coordinates are stored as 3 rationals: degrees, minutes, seconds
    const degNum = read32(offset);
    const degDen = read32(offset + 4);
    const minNum = read32(offset + 8);
    const minDen = read32(offset + 12);
    const secNum = read32(offset + 16);
    const secDen = read32(offset + 20);

    if (degDen === 0 || minDen === 0 || secDen === 0) return null;

    const degrees = degNum / degDen;
    const minutes = minNum / minDen;
    const seconds = secNum / secDen;

    return degrees + (minutes / 60) + (seconds / 3600);
  } catch {
    return null;
  }
}

function readSigned32(view: DataView, offset: number, littleEndian: boolean): number {
  return view.getInt32(offset, littleEndian);
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

// Reverse geocoding with caching
const geoCache = new Map<string, string>();

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const cacheKey = `${lat.toFixed(4)}_${lng.toFixed(4)}`;

  // Check memory cache
  if (geoCache.has(cacheKey)) {
    return geoCache.get(cacheKey) || null;
  }

  // Check sessionStorage
  if (typeof window !== "undefined") {
    const cached = sessionStorage.getItem(`geo_${cacheKey}`);
    if (cached) {
      geoCache.set(cacheKey, cached);
      return cached;
    }
  }

  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );

    if (!response.ok) return null;

    const data = await response.json();

    // Build location string: City, Country
    const parts: string[] = [];
    if (data.city) {
      parts.push(data.city);
    } else if (data.locality) {
      parts.push(data.locality);
    }
    if (data.countryName) {
      parts.push(data.countryName);
    }

    const location = parts.length > 0 ? parts.join(", ") : null;

    // Cache the result
    if (location) {
      geoCache.set(cacheKey, location);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`geo_${cacheKey}`, location);
      }
    }

    return location;
  } catch {
    return null;
  }
}
