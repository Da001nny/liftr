/**
 * liftr: Soft Radial Glow Muscle Heatmap Component
 * 
 * Refinements:
 * 1. Model-Specific Centering: Separate, calibrated glow coordinates for Male vs Female models,
 *    correcting the female bust, narrower shoulders, waist indentation, and wider hip geometry.
 * 2. Continuous Intensity Scaling: Smooth gradient brightness/opacity proportional to rolling 7-day
 *    completed working sets (0 sets = unilluminated zero-state; 16+ sets = peak stimulus bloom).
 * 3. Skin Tone Swapping: Dynamically loads the pre-generated complexion variant (fair, medium, tan, dark).
 * 4. Dedicated Glow Color: Uses the user's custom heatmap glow color for trained stimulus visualization.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { REGION_MAP } from '../../data/exerciseCatalog';
import { ModelKey, RegionPoint, HotspotCalibrationMap } from '../../lib/calibrationService';
import { Move } from 'lucide-react';

export type BodyGender = 'male' | 'female';
export type BodyOrientation = 'anterior' | 'posterior';

export interface RadialGlowCenter {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface RadialGlowRegion {
  id: string;
  name: string;
  submuscles: string;
  color: string;
  centers: RadialGlowCenter[];
}

// =========================================================================
// 1. MALE ANTERIOR (FRONT VIEW) GLOW CENTERS (1000 x 1777 coordinate space)
// =========================================================================
const MALE_ANTERIOR_GLOWS: RadialGlowRegion[] = [
  {
    id: 'chest',
    name: 'Chest',
    submuscles: 'Pectoralis Major & Minor',
    color: '#fbbf24',
    centers: [
      { cx: 500, cy: 465, rx: 160, ry: 85 }
    ]
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    submuscles: 'Anterior & Lateral Deltoids',
    color: '#38bdf8',
    centers: [
      { cx: 270, cy: 440, rx: 85, ry: 75 },
      { cx: 730, cy: 440, rx: 85, ry: 75 }
    ]
  },
  {
    id: 'core',
    name: 'Core',
    submuscles: 'Rectus Abdominis, Obliques & Serratus',
    color: '#34d399',
    centers: [
      { cx: 500, cy: 675, rx: 155, ry: 115 }
    ]
  },
  {
    id: 'arms',
    name: 'Arms',
    submuscles: 'Biceps Brachii & Forearms',
    color: '#a78bfa',
    centers: [
      { cx: 195, cy: 710, rx: 85, ry: 180 },
      { cx: 805, cy: 710, rx: 85, ry: 180 }
    ]
  },
  {
    id: 'inner_thigh',
    name: 'Inner Thigh',
    submuscles: 'Adductors Complex & Gracilis',
    color: '#f472b6',
    centers: [
      { cx: 500, cy: 915, rx: 90, ry: 75 }
    ]
  },
  {
    id: 'legs',
    name: 'Legs',
    submuscles: 'Quadriceps, Knee Complex, Shins & Calves',
    color: '#fb923c',
    centers: [
      { cx: 360, cy: 1180, rx: 120, ry: 360 },
      { cx: 640, cy: 1180, rx: 120, ry: 360 }
    ]
  }
];

// =========================================================================
// 2. MALE POSTERIOR (BACK VIEW) GLOW CENTERS (1000 x 1777 coordinate space)
// =========================================================================
const MALE_POSTERIOR_GLOWS: RadialGlowRegion[] = [
  {
    id: 'back',
    name: 'Back',
    submuscles: 'Latissimus Dorsi (Lats), Trapezius & Rhomboids',
    color: '#60a5fa',
    centers: [
      { cx: 500, cy: 515, rx: 180, ry: 160 }
    ]
  },
  {
    id: 'shoulders',
    name: 'Rear Shoulders',
    submuscles: 'Posterior Deltoids & Infraspinatus',
    color: '#38bdf8',
    centers: [
      { cx: 270, cy: 440, rx: 85, ry: 75 },
      { cx: 730, cy: 440, rx: 85, ry: 75 }
    ]
  },
  {
    id: 'arms',
    name: 'Arms',
    submuscles: 'Triceps Brachii & Posterior Forearms',
    color: '#a78bfa',
    centers: [
      { cx: 195, cy: 710, rx: 85, ry: 180 },
      { cx: 805, cy: 710, rx: 85, ry: 180 }
    ]
  },
  {
    id: 'glutes',
    name: 'Glutes',
    submuscles: 'Gluteus Maximus, Medius & Minimus',
    color: '#f87171',
    centers: [
      { cx: 500, cy: 875, rx: 175, ry: 100 }
    ]
  },
  {
    id: 'legs',
    name: 'Legs',
    submuscles: 'Hamstrings Complex, Calves (Gastrocnemius & Soleus)',
    color: '#fb923c',
    centers: [
      { cx: 360, cy: 1270, rx: 120, ry: 340 },
      { cx: 640, cy: 1270, rx: 120, ry: 340 }
    ]
  }
];

// =========================================================================
// 3. FEMALE ANTERIOR (FRONT VIEW) RECENTERED GLOW CENTERS
// Calibrated for narrower shoulders, lower bust line, tapered waist & wider hips
// =========================================================================
const FEMALE_ANTERIOR_GLOWS: RadialGlowRegion[] = [
  {
    id: 'chest',
    name: 'Chest',
    submuscles: 'Pectoralis Major & Minor',
    color: '#fbbf24',
    centers: [
      // Adjusted down to Y: 510 to match female bust elevation
      { cx: 500, cy: 510, rx: 140, ry: 80 }
    ]
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    submuscles: 'Anterior & Lateral Deltoids',
    color: '#38bdf8',
    centers: [
      // Inward from 270/730 to 310/690 to match female 36% shoulder width
      { cx: 310, cy: 425, rx: 75, ry: 70 },
      { cx: 690, cy: 425, rx: 75, ry: 70 }
    ]
  },
  {
    id: 'core',
    name: 'Core',
    submuscles: 'Rectus Abdominis, Obliques & Serratus',
    color: '#34d399',
    centers: [
      // Slender waistline centered at Y: 680
      { cx: 500, cy: 680, rx: 125, ry: 100 }
    ]
  },
  {
    id: 'arms',
    name: 'Arms',
    submuscles: 'Biceps Brachii & Forearms',
    color: '#a78bfa',
    centers: [
      // Tucked arms: X: 235 and 765
      { cx: 235, cy: 680, rx: 75, ry: 170 },
      { cx: 765, cy: 680, rx: 75, ry: 170 }
    ]
  },
  {
    id: 'inner_thigh',
    name: 'Inner Thigh',
    submuscles: 'Adductors Complex & Gracilis',
    color: '#f472b6',
    centers: [
      { cx: 500, cy: 920, rx: 80, ry: 65 }
    ]
  },
  {
    id: 'legs',
    name: 'Legs',
    submuscles: 'Quadriceps, Knee Complex, Shins & Calves',
    color: '#fb923c',
    centers: [
      // Aligned with female thigh and knee axis
      { cx: 370, cy: 1190, rx: 105, ry: 340 },
      { cx: 630, cy: 1190, rx: 105, ry: 340 }
    ]
  }
];

// =========================================================================
// 4. FEMALE POSTERIOR (BACK VIEW) RECENTERED GLOW CENTERS
// =========================================================================
const FEMALE_POSTERIOR_GLOWS: RadialGlowRegion[] = [
  {
    id: 'back',
    name: 'Back',
    submuscles: 'Latissimus Dorsi (Lats), Trapezius & Rhomboids',
    color: '#60a5fa',
    centers: [
      { cx: 500, cy: 510, rx: 155, ry: 135 }
    ]
  },
  {
    id: 'shoulders',
    name: 'Rear Shoulders',
    submuscles: 'Posterior Deltoids & Infraspinatus',
    color: '#38bdf8',
    centers: [
      { cx: 310, cy: 425, rx: 75, ry: 65 },
      { cx: 690, cy: 425, rx: 75, ry: 65 }
    ]
  },
  {
    id: 'arms',
    name: 'Arms',
    submuscles: 'Triceps Brachii & Posterior Forearms',
    color: '#a78bfa',
    centers: [
      { cx: 235, cy: 680, rx: 75, ry: 170 },
      { cx: 765, cy: 680, rx: 75, ry: 170 }
    ]
  },
  {
    id: 'glutes',
    name: 'Glutes',
    submuscles: 'Gluteus Maximus, Medius & Minimus',
    color: '#f87171',
    centers: [
      // Placed over female athletic glute contour at Y: 895
      { cx: 500, cy: 895, rx: 175, ry: 95 }
    ]
  },
  {
    id: 'legs',
    name: 'Legs',
    submuscles: 'Hamstrings Complex, Calves (Gastrocnemius & Soleus)',
    color: '#fb923c',
    centers: [
      { cx: 365, cy: 1280, rx: 105, ry: 330 },
      { cx: 635, cy: 1280, rx: 105, ry: 330 }
    ]
  }
];

export const ALL_8_REGIONS = [
  { id: 'shoulders', name: 'Shoulders', color: '#38bdf8' },
  { id: 'chest', name: 'Chest', color: '#fbbf24' },
  { id: 'arms', name: 'Arms', color: '#a78bfa' },
  { id: 'core', name: 'Core', color: '#34d399' },
  { id: 'inner_thigh', name: 'Inner Thigh', color: '#f472b6' },
  { id: 'legs', name: 'Legs', color: '#fb923c' },
  { id: 'back', name: 'Back', color: '#60a5fa' },
  { id: 'glutes', name: 'Glutes', color: '#f87171' },
];

interface AnatomicalModelProps {
  gender: BodyGender;
  orientation: BodyOrientation;
  selectedRegionId: string | null;
  onSelectRegion: (regionId: string) => void;
  onHoverRegion?: (regionId: string | null) => void;
  // Volume Scaling Props (Rolling 7-day sets)
  weeklySetsByRegion?: Record<string, number>;
  // Calibration Props
  isCalibrationMode?: boolean;
  calibrationData: HotspotCalibrationMap;
  onUpdateCalibrationPoint?: (modelKey: ModelKey, regionId: string, point: RegionPoint) => void;
}

export const AnatomicalModel: React.FC<AnatomicalModelProps> = ({
  gender,
  orientation,
  selectedRegionId,
  onSelectRegion,
  onHoverRegion,
  weeklySetsByRegion = {},
  isCalibrationMode = false,
  calibrationData,
  onUpdateCalibrationPoint,
}) => {
  const { t } = useTranslation();
  const { accentColor, skinTone, heatmapGlowColor } = useTheme();
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [activeDragRegionId, setActiveDragRegionId] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    setImageError(false);
  }, [gender, orientation, skinTone]);

  const containerRef = useRef<HTMLDivElement>(null);

  const modelKey: ModelKey = `${gender}_${orientation}`;
  const currentCoords = calibrationData[modelKey] || {};

  const activeRegionObj = selectedRegionId ? REGION_MAP.get(selectedRegionId) : null;
  const hoveredRegion = hoveredRegionId ? REGION_MAP.get(hoveredRegionId) : null;

  // Select Model-Specific Centered Regions
  const glowRegions = gender === 'male'
    ? (orientation === 'anterior' ? MALE_ANTERIOR_GLOWS : MALE_POSTERIOR_GLOWS)
    : (orientation === 'anterior' ? FEMALE_ANTERIOR_GLOWS : FEMALE_POSTERIOR_GLOWS);

  // Active Glow Color (User-customized in Profile Settings, default #00f0ff)
  const activeGlowColor = heatmapGlowColor || '#00f0ff';

  // Handle Dragging in Calibration Mode
  const updatePositionFromEvent = useCallback((clientX: number, clientY: number) => {
    if (!activeDragRegionId || !containerRef.current || !onUpdateCalibrationPoint) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const rawX = ((clientX - rect.left) / rect.width) * 100;
    const rawY = ((clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(2, Math.min(98, Math.round(rawX * 10) / 10));
    const clampedY = Math.max(2, Math.min(98, Math.round(rawY * 10) / 10));

    const existing = currentCoords[activeDragRegionId] || { radius: 12 };
    onUpdateCalibrationPoint(modelKey, activeDragRegionId, {
      x: clampedX,
      y: clampedY,
      radius: existing.radius || 12,
    });
  }, [activeDragRegionId, containerRef, currentCoords, modelKey, onUpdateCalibrationPoint]);

  useEffect(() => {
    if (!activeDragRegionId) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      updatePositionFromEvent(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      setActiveDragRegionId(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        updatePositionFromEvent(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      setActiveDragRegionId(null);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeDragRegionId, updatePositionFromEvent]);

  const handleStartDrag = (regionId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setActiveDragRegionId(regionId);
    onSelectRegion(regionId);
  };

  // Image source with pre-generated skin tone variant and fallback
  const activeTone = skinTone || 'medium';
  const preferredImageSrc = `/anatomy/${gender}_${orientation}_${activeTone}.jpg`;
  const fallbackImageSrc = `/anatomy/${gender}_${orientation}.jpg`;
  const effectiveImageSrc = imageError ? fallbackImageSrc : preferredImageSrc;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[340px] sm:max-w-[380px] mx-auto select-none">
      {/* Floating Hover Tooltip (Desktop) */}
      {!isCalibrationMode && (
        <div 
          className={`absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3.5 py-2 rounded-xl bg-neutral-950/95 text-white border border-neutral-700 shadow-2xl text-xs font-medium pointer-events-none transition-all duration-200 flex items-center gap-2.5 backdrop-blur-md ${
            hoveredRegion ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          <span 
            className="w-2.5 h-2.5 rounded-full shadow-sm"
            style={{ backgroundColor: activeGlowColor }}
          />
          <div className="flex flex-col">
            <span className="font-bold text-xs uppercase tracking-wider">{hoveredRegion?.name}</span>
            <span className="text-neutral-400 font-mono text-[10px]">
              {(weeklySetsByRegion[hoveredRegion?.id || ''] || 0) > 0
                ? `${weeklySetsByRegion[hoveredRegion?.id || '']} sets in rolling 7 days`
                : 'No workout data logged yet (0 sets)'}
            </span>
          </div>
        </div>
      )}

      {/* Main Model Container */}
      <div 
        ref={containerRef}
        className={`relative w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl bg-[#0e0e11] border transition-all ${
          isCalibrationMode ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-neutral-800'
        }`}
      >
        {/* Base Layer: 3D Athletic Avatar (Natural skin + defined tone, no flayed flesh) */}
        <img
          key={`${gender}_${orientation}_${activeTone}`}
          src={effectiveImageSrc}
          onError={() => setImageError(true)}
          alt={t('body.avatarAlt', { gender, orientation, tone: activeTone })}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none transition-opacity duration-200"
          loading="eager"
        />

        {/* Dark Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25 pointer-events-none" />

        {/* =========================================================================
            SOFT BLURRED RADIAL GLOW OVERLAY SVG (1000 x 1777 viewBox space)
            Continuous Intensity Scaling + Dedicated Custom Glow Color
            ========================================================================= */}
        <svg
          viewBox="0 0 1000 1777"
          className="absolute inset-0 w-full h-full z-10 pointer-events-auto"
          style={{ touchAction: 'manipulation' }}
        >
          <defs>
            {/* Deep Gaussian Blur for Feathered Edges */}
            <filter id="softGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="22" result="blur" />
            </filter>

            {/* Radial Gradient: Neutral Zero-State Heat Glow (Unlogged) */}
            <radialGradient id="neutralHeatGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
              <stop offset="40%" stopColor="#cbd5e1" stopOpacity="0.10" />
              <stop offset="75%" stopColor="#94a3b8" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
            </radialGradient>

            {/* Radial Gradient: Hover State (Soft Luminescence) */}
            <radialGradient id="hoverHeatGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
              <stop offset="35%" stopColor={activeGlowColor} stopOpacity="0.38" />
              <stop offset="70%" stopColor={activeGlowColor} stopOpacity="0.12" />
              <stop offset="100%" stopColor={activeGlowColor} stopOpacity="0" />
            </radialGradient>

            {/* Radial Gradient: Active Selected State */}
            <radialGradient id="selectedHeatGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={activeGlowColor} stopOpacity="0.80" />
              <stop offset="35%" stopColor={activeGlowColor} stopOpacity="0.50" />
              <stop offset="70%" stopColor={activeGlowColor} stopOpacity="0.20" />
              <stop offset="100%" stopColor={activeGlowColor} stopOpacity="0" />
            </radialGradient>
          </defs>

          {glowRegions.map(region => {
            const isSelected = selectedRegionId === region.id;
            const isHovered = hoveredRegionId === region.id;

            // Continuous intensity scaling based on rolling 7-day completed sets
            const sets = weeklySetsByRegion[region.id] || 0;
            const hasData = sets > 0;
            // Target volume for full hypertrophy stimulus: 16 working sets
            const intensityRatio = Math.min(1.0, sets / 16);

            // Heatmap Glow: STRICTLY 0 opacity when sets === 0!
            // Honest zero-state: unlogged / 0 sets = ZERO heat glow across all 8 regions
            const glowOpacity = hasData ? (0.25 + intensityRatio * 0.70) : 0;

            return (
              <g
                key={region.id}
                id={`region_${region.id}`}
                data-region-id={region.id}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => {
                  setHoveredRegionId(region.id);
                  onHoverRegion?.(region.id);
                }}
                onMouseLeave={() => {
                  setHoveredRegionId(null);
                  onHoverRegion?.(null);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRegion(region.id);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  onSelectRegion(region.id);
                }}
              >
                {region.centers.map((c, idx) => (
                  <React.Fragment key={idx}>
                    {/* 1. Visible Blurred Radial Gradient Heat Aura (ONLY when region has completed sets > 0) */}
                    {hasData && (
                      <>
                        <ellipse
                          cx={c.cx}
                          cy={c.cy}
                          rx={c.rx}
                          ry={c.ry}
                          fill="url(#selectedHeatGlow)"
                          opacity={glowOpacity}
                          filter="url(#softGlowFilter)"
                          className="transition-all duration-300 pointer-events-none"
                        />

                        {/* 2. Soft Inner Core Glow Highlight (ONLY when hasData) */}
                        <ellipse
                          cx={c.cx}
                          cy={c.cy}
                          rx={c.rx * 0.45}
                          ry={c.ry * 0.45}
                          fill={activeGlowColor}
                          opacity={0.15 + intensityRatio * 0.40}
                          filter="url(#softGlowFilter)"
                          className="transition-all duration-200 pointer-events-none"
                        />
                      </>
                    )}

                    {/* Selection Reticle Halo (shows active region inspection WITHOUT fabricating any heat glow) */}
                    {isSelected && (
                      <ellipse
                        cx={c.cx}
                        cy={c.cy}
                        rx={c.rx * 0.90}
                        ry={c.ry * 0.90}
                        fill="transparent"
                        stroke={activeGlowColor}
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                        className="pointer-events-none animate-pulse"
                      />
                    )}

                    {/* Hover Reticle Halo (subtle boundary indicator on hover) */}
                    {isHovered && !isSelected && (
                      <ellipse
                        cx={c.cx}
                        cy={c.cy}
                        rx={c.rx * 0.90}
                        ry={c.ry * 0.90}
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.45)"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        className="pointer-events-none"
                      />
                    )}

                    {/* 3. Generous Invisible Tap/Click Target Area */}
                    <ellipse
                      cx={c.cx}
                      cy={c.cy}
                      rx={c.rx * 1.25}
                      ry={c.ry * 1.25}
                      fill="transparent"
                      className="cursor-pointer"
                    />
                  </React.Fragment>
                ))}
              </g>
            );
          })}
        </svg>

        {/* =========================================================================
            CALIBRATION MODE: Draggable Pin Markers
            ========================================================================= */}
        {isCalibrationMode && (
          <div className="absolute inset-0 w-full h-full z-20 pointer-events-auto">
            {ALL_8_REGIONS.map(reg => {
              const point = currentCoords[reg.id] || { x: 50, y: 50, radius: 12 };
              const isDragging = activeDragRegionId === reg.id;
              const isSelected = selectedRegionId === reg.id;

              return (
                <div
                  key={reg.id}
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute z-30 flex flex-col items-center cursor-grab active:cursor-grabbing group select-none"
                  onMouseDown={(e) => handleStartDrag(reg.id, e)}
                  onTouchStart={(e) => handleStartDrag(reg.id, e)}
                >
                  {/* Center Draggable Pin */}
                  <div
                    style={{ backgroundColor: reg.color }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform ${
                      isDragging ? 'scale-125 ring-4 ring-amber-400' : 'hover:scale-110'
                    }`}
                  >
                    <Move className="w-3 h-3 text-black" />
                  </div>

                  {/* Coordinate Badge */}
                  <div className={`mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap shadow-md pointer-events-none transition-all ${
                    isSelected || isDragging 
                      ? 'bg-neutral-900 text-white border border-amber-400' 
                      : 'bg-black/80 text-neutral-300 border border-neutral-700'
                  }`}>
                    {reg.name}: {point.x}%, {point.y}%
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Region Status Pill Overlaid at Bottom */}
        <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800 text-xs">
          <div className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: activeGlowColor }}
            />
            <span className="font-bold text-white uppercase tracking-wider font-athletic text-[11px]">
              {activeRegionObj ? activeRegionObj.name : t('body.selectRegion')}
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">
            {isCalibrationMode 
              ? t('body.calibrationActive') 
              : ((weeklySetsByRegion[activeRegionObj?.id || ''] || 0) > 0 
                ? t('body.setsSevenDay', { count: weeklySetsByRegion[activeRegionObj?.id || ''] }) 
                : t('body.noDataLogged'))}
          </span>
        </div>
      </div>

      {/* Accessible Quick Region Strip Below Model */}
      <div className="w-full mt-3 flex flex-wrap items-center justify-center gap-1.5 px-1">
        {ALL_8_REGIONS.map(r => {
          const isSelected = selectedRegionId === r.id;
          const sets = weeklySetsByRegion[r.id] || 0;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRegion(r.id)}
              className={`px-2.5 py-1 text-[11px] font-athletic font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm border-transparent'
                  : 'bg-neutral-200/70 hover:bg-neutral-300 dark:bg-neutral-900/80 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300/80 dark:border-neutral-800'
              }`}
            >
              {r.name} {sets > 0 && `(${sets})`}
            </button>
          );
        })}
      </div>
    </div>
  );
};
