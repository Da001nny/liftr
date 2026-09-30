import fs from 'fs';
import path from 'path';

// 8 Primary Muscle Regions
export const MUSCLE_REGIONS = [
  { id: 'chest', name: 'Chest', description: 'Pectoralis major (clavicular, sternal, costal heads) and minor', orderIndex: 1 },
  { id: 'back', name: 'Back', description: 'Latissimus dorsi, trapezius, rhomboids, teres major, and spinal erectors', orderIndex: 2 },
  { id: 'shoulders', name: 'Shoulders', description: 'Anterior, lateral, and posterior deltoids plus rotator cuff complex', orderIndex: 3 },
  { id: 'arms', name: 'Arms', description: 'Biceps brachii, brachialis, triceps brachii heads, and forearms', orderIndex: 4 },
  { id: 'legs', name: 'Legs', description: 'Quadriceps, hamstrings complex, gastrocnemius, soleus, and tibialis anterior', orderIndex: 5 },
  { id: 'glutes', name: 'Glutes', description: 'Gluteus maximus, medius, and minimus', orderIndex: 6 },
  { id: 'core', name: 'Core', description: 'Rectus abdominis, obliques, transverse abdominis, and serratus anterior', orderIndex: 7 },
  { id: 'inner_thigh', name: 'Inner Thigh', description: 'Adductor magnus, longus, brevis, and gracilis', orderIndex: 8 },
];

// Muscles with full hierarchy (region -> subregion -> muscle)
export const MUSCLES = [
  // Chest
  { id: 'm_chest_clavicular', name: 'Clavicular Head (Upper Chest)', commonName: 'Upper Chest', regionId: 'chest', subregion: 'Upper Pectorals', description: 'Elevated fibers originating at the clavicle, primary in incline presses' },
  { id: 'm_chest_sternal', name: 'Sternal Head (Mid Chest)', commonName: 'Mid Chest', regionId: 'chest', subregion: 'Mid Pectorals', description: 'Main fan-shaped fibers originating at the sternum, primary in horizontal adduction' },
  { id: 'm_chest_costal', name: 'Costal Head (Lower Chest)', commonName: 'Lower Chest', regionId: 'chest', subregion: 'Lower Pectorals', description: 'Lower fibers running toward the abdominal aponeurosis, emphasized in dips and decline press' },

  // Back
  { id: 'm_latissimus_dorsi', name: 'Latissimus Dorsi', commonName: 'Lats', regionId: 'back', subregion: 'Mid & Lower Back', description: 'Broadest muscle of the back, drives shoulder extension, adduction, and horizontal pulling' },
  { id: 'm_trapezius_upper', name: 'Upper Trapezius', commonName: 'Upper Traps', regionId: 'back', subregion: 'Cervical Spine & Neck', description: 'Elevates and upwardly rotates the scapula, active in shrugs and overhead stabilization' },
  { id: 'm_trapezius_middle', name: 'Middle Trapezius & Rhomboids', commonName: 'Mid Back & Rhomboids', regionId: 'back', subregion: 'Thoracic Scapular Retractors', description: 'Scapular retraction and horizontal pulling stabilization' },
  { id: 'm_trapezius_lower', name: 'Lower Trapezius', commonName: 'Lower Traps', regionId: 'back', subregion: 'Lower Scapular Depressors', description: 'Depresses and stabilizes the scapula during vertical and horizontal pulling' },
  { id: 'm_teres_major', name: 'Teres Major', commonName: 'Upper Lats / Teres', regionId: 'back', subregion: 'Posterior Shoulder & Upper Lat', description: 'Assists latissimus dorsi in adduction and internal rotation of the humerus' },
  { id: 'm_erector_spinae', name: 'Erector Spinae', commonName: 'Lower Back', regionId: 'back', subregion: 'Spinal Erectors', description: 'Extends and stabilizes the vertebral column, foundational in deadlifts and squats' },

  // Shoulders
  { id: 'm_deltoid_anterior', name: 'Anterior Deltoid', commonName: 'Front Delt', regionId: 'shoulders', subregion: 'Anterior Shoulder', description: 'Shoulder flexion and horizontal adduction, primary in overhead and incline pressing' },
  { id: 'm_deltoid_lateral', name: 'Lateral Deltoid', commonName: 'Side Delt', regionId: 'shoulders', subregion: 'Lateral Shoulder', description: 'Primary shoulder abductor creating shoulder width and 3D silhouette' },
  { id: 'm_deltoid_posterior', name: 'Posterior Deltoid', commonName: 'Rear Delt', regionId: 'shoulders', subregion: 'Posterior Shoulder', description: 'Horizontal abduction and external rotation, key for shoulder balance and posture' },
  { id: 'm_rotator_cuff', name: 'Rotator Cuff Complex', commonName: 'Rotator Cuff', regionId: 'shoulders', subregion: 'Glenohumeral Stabilizers', description: 'Supraspinatus, infraspinatus, teres minor, subscapularis dynamic joint stabilization' },

  // Arms
  { id: 'm_biceps_long_head', name: 'Biceps Brachii (Long Head)', commonName: 'Outer Bicep', regionId: 'arms', subregion: 'Anterior Upper Arm', description: 'Forms the outer bicep peak, crosses the glenohumeral joint' },
  { id: 'm_biceps_short_head', name: 'Biceps Brachii (Short Head)', commonName: 'Inner Bicep', regionId: 'arms', subregion: 'Anterior Upper Arm', description: 'Forms the inner bicep thickness and width' },
  { id: 'm_brachialis', name: 'Brachialis', commonName: 'Brachialis', regionId: 'arms', subregion: 'Anterior Arm / Under Bicep', description: 'Strongest pure elbow flexor, pushes bicep upward for arm thickness' },
  { id: 'm_triceps_long_head', name: 'Triceps Brachii (Long Head)', commonName: 'Triceps Long Head', regionId: 'arms', subregion: 'Posterior Upper Arm', description: 'Largest triceps head, crosses the shoulder joint, emphasized in overhead extensions' },
  { id: 'm_triceps_lateral_head', name: 'Triceps Brachii (Lateral Head)', commonName: 'Triceps Outer Head', regionId: 'arms', subregion: 'Posterior Upper Arm', description: 'Forms the outer triceps horseshoe curve, dominant in pushdowns' },
  { id: 'm_triceps_medial_head', name: 'Triceps Brachii (Medial Head)', commonName: 'Triceps Inner Head', regionId: 'arms', subregion: 'Posterior Upper Arm', description: 'Active across all elbow extension angles, primary elbow stabilizer' },
  { id: 'm_forearms', name: 'Forearm Flexors & Extensors', commonName: 'Forearms & Grip', regionId: 'arms', subregion: 'Lower Arm & Wrist', description: 'Wrist flexion, extension, pronation, supination, and grip endurance' },

  // Legs
  { id: 'm_quadriceps', name: 'Quadriceps Femoris', commonName: 'Quads', regionId: 'legs', subregion: 'Anterior Thigh', description: 'Rectus femoris, vastus lateralis, vastus medialis, vastus intermedius knee extension' },
  { id: 'm_hamstrings', name: 'Hamstrings Complex', commonName: 'Hamstrings', regionId: 'legs', subregion: 'Posterior Thigh', description: 'Biceps femoris, semitendinosus, and semimembranosus hip extension and knee flexion' },
  { id: 'm_calves_gastrocnemius', name: 'Gastrocnemius', commonName: 'Calves (Outer)', regionId: 'legs', subregion: 'Posterior Lower Leg', description: 'Biarticular calf muscle with lateral and medial heads, dominant with straight knees' },
  { id: 'm_calves_soleus', name: 'Soleus', commonName: 'Calves (Deep/Soleus)', regionId: 'legs', subregion: 'Posterior Lower Leg', description: 'Deep postural calf muscle active in seated calf raises and ankle stability' },
  { id: 'm_tibialis_anterior', name: 'Tibialis Anterior', commonName: 'Shins', regionId: 'legs', subregion: 'Anterior Lower Leg', description: 'Dorsiflexes and inverts the foot, crucial for knee protection and deceleration' },

  // Glutes
  { id: 'm_gluteus_maximus', name: 'Gluteus Maximus', commonName: 'Glute Max', regionId: 'glutes', subregion: 'Posterior Pelvis', description: 'Largest muscle in the human body, primary hip extensor and external rotator' },
  { id: 'm_gluteus_medius', name: 'Gluteus Medius', commonName: 'Glute Med', regionId: 'glutes', subregion: 'Lateral Pelvis', description: 'Primary hip abductor and pelvic stabilizer in single-leg stance' },
  { id: 'm_gluteus_minimus', name: 'Gluteus Minimus', commonName: 'Glute Min', regionId: 'glutes', subregion: 'Deep Lateral Pelvis', description: 'Synergist for hip abduction and internal rotation' },

  // Core
  { id: 'm_rectus_abdominis', name: 'Rectus Abdominis', commonName: 'Abs', regionId: 'core', subregion: 'Anterior Abdominal Wall', description: 'Flexes the lumbar spine and stabilizes the pelvis against anterior tilt' },
  { id: 'm_obliques', name: 'Internal & External Obliques', commonName: 'Obliques', regionId: 'core', subregion: 'Lateral Abdominal Wall', description: 'Lateral flexion, trunk rotation, and anti-rotational stability' },
  { id: 'm_transverse_abdominis', name: 'Transverse Abdominis', commonName: 'Deep Core & TVA', regionId: 'core', subregion: 'Deep Abdominal Core', description: 'Deepest abdominal muscle providing intra-abdominal pressure and spinal bracing' },
  { id: 'm_serratus_anterior', name: 'Serratus Anterior', commonName: 'Serratus', regionId: 'core', subregion: 'Anterolateral Thorax', description: 'Protracts and upwardly rotates the scapula, protects shoulder rhythm' },
  { id: 'm_core', name: 'Core & Abdominal Complex', commonName: 'Core Complex', regionId: 'core', subregion: 'Midsection Core', description: 'Deep core, spinal erector, and abdominal wall stabilization' },

  // Inner Thigh
  { id: 'm_adductor_magnus', name: 'Adductor Magnus', commonName: 'Adductor Magnus', regionId: 'inner_thigh', subregion: 'Medial Thigh (Posterior)', description: 'Largest adductor with extensor head assisting deep hip extension and stabilization' },
  { id: 'm_adductor_longus', name: 'Adductor Longus & Brevis', commonName: 'Adductors', regionId: 'inner_thigh', subregion: 'Medial Thigh (Anterior)', description: 'Thigh adduction and hip flexion stabilization' },
  { id: 'm_gracilis', name: 'Gracilis', commonName: 'Gracilis', regionId: 'inner_thigh', subregion: 'Superficial Medial Thigh', description: 'Crosses hip and knee joints, aids in adduction and knee flexion' },
];

console.log(`Taxonomy defined: ${MUSCLE_REGIONS.length} regions, ${MUSCLES.length} muscles.`);
