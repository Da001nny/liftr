/**
 * liftr: Hotspot Calibration Service
 * Manages loading, dragging, and persistence of the 32 percentage-based hotspot coordinates
 * (4 images: male_anterior, male_posterior, female_anterior, female_posterior × 8 regions).
 */

import defaultCalibration from '../data/hotspotCalibration.json';

export type ModelKey = 'male_anterior' | 'male_posterior' | 'female_anterior' | 'female_posterior';

export interface RegionPoint {
  x: number;      // 0 - 100 percentage
  y: number;      // 0 - 100 percentage
  radius: number; // 0 - 100 percentage
}

export type HotspotCalibrationMap = Record<ModelKey, Record<string, RegionPoint>>;

const STORAGE_KEY = 'liftr_hotspot_calibration_v1';

export function getInitialCalibration(): HotspotCalibrationMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        return { ...(defaultCalibration as HotspotCalibrationMap), ...parsed };
      }
    }
  } catch (err) {
    console.warn('[calibrationService] Error reading localStorage:', err);
  }
  return defaultCalibration as HotspotCalibrationMap;
}

export async function fetchServerCalibration(): Promise<HotspotCalibrationMap> {
  try {
    const res = await fetch('/api/calibration');
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.items && json.data.items[0]) {
        const serverData = json.data.items[0] as HotspotCalibrationMap;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
        return serverData;
      }
    }
  } catch (err) {
    console.warn('[calibrationService] Server fetch failed:', err);
  }
  return getInitialCalibration();
}

export async function persistCalibration(data: HotspotCalibrationMap): Promise<boolean> {
  // 1. Immediately persist locally
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('[calibrationService] LocalStorage save error:', err);
  }

  // 2. Persist to server config file
  try {
    const res = await fetch('/api/calibration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error('[calibrationService] Server POST error:', err);
    return false;
  }
}
