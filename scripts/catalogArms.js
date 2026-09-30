import { createExercise } from './exerciseGenerator.js';

export function getArmsExerciseList() {
  const items = [];

  // --- BICEPS & FOREARMS ---
  items.push(createExercise({
    id: 'ex_barbell_biceps_curl',
    name: 'Barbell Biceps Curl',
    description: 'The premier mass builder for the biceps brachii using heavy bilateral progressive overload.',
    equipment: 'barbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo',
    instructions: [
      'Stand tall holding barbell with shoulder-width underhand grip, elbows pinned to sides.',
      'Curl the bar upward by flexing elbows while keeping upper arms motionless.',
      'Squeeze biceps hard at top contraction, lower slowly over 2-3 seconds.'
    ],
    primaryContributions: [
      ['m_biceps_short_head', 50, 'Inner bicep mass'],
      ['m_biceps_long_head', 40, 'Outer bicep peak']
    ],
    secondaryContributions: [
      ['m_brachialis', 10, 'Elbow flexion assist']
    ],
    stabilizerContributions: [
      ['m_forearms', 20, 'Wrist stabilization'],
      ['m_core', 15, 'Anti-extension core brace']
    ]
  }));

  items.push(createExercise({
    id: 'ex_dumbbell_biceps_curl',
    name: 'Dumbbell Biceps Curl (Supinating)',
    description: 'Allows wrists to rotate from neutral to fully supinated, maximizing biceps recruitment.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Start with dumbbells at sides, palms facing in.',
      'As you curl upward, rotate wrists so palms face ceiling at peak contraction.',
      'Lower under control reversing the rotation.'
    ],
    primaryContributions: [
      ['m_biceps_long_head', 50, 'Peak supination contraction'],
      ['m_biceps_short_head', 40, 'Inner bicep']
    ],
    secondaryContributions: [
      ['m_brachialis', 10, 'Elbow flexor assist']
    ],
    stabilizerContributions: [['m_forearms', 15, 'Wrist rotation control']]
  }));

  items.push(createExercise({
    id: 'ex_incline_dumbbell_curl',
    name: 'Incline Dumbbell Curl',
    description: 'Places the long head of the biceps on deep stretch behind the torso for maximum hypertrophy.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'arms',
    instructions: [
      'Sit on bench inclined to 45-60 degrees with arms hanging straight down.',
      'Curl dumbbells upward without letting elbows swing forward.',
      'Lower slowly to full bottom stretch.'
    ],
    primaryContributions: [
      ['m_biceps_long_head', 75, 'Stretched long head bicep peak']
    ],
    secondaryContributions: [
      ['m_biceps_short_head', 15, 'Short head assist'],
      ['m_brachialis', 10, 'Brachialis']
    ],
    stabilizerContributions: [['m_forearms', 10, 'Wrist control']]
  }));

  items.push(createExercise({
    id: 'ex_dumbbell_hammer_curl',
    name: 'Dumbbell Hammer Curl',
    description: 'Neutral grip curl prioritizing the brachialis and brachioradialis for arm thickness.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Hold dumbbells with palms facing each other (neutral grip).',
      'Curl dumbbells up to shoulder height maintaining thumbs-up position.',
      'Squeeze forearm and outer upper arm at top, lower slowly.'
    ],
    primaryContributions: [
      ['m_brachialis', 55, 'Primary neutral elbow flexor'],
      ['m_forearms', 30, 'Brachioradialis recruitment']
    ],
    secondaryContributions: [
      ['m_biceps_long_head', 15, 'Biceps synergy']
    ],
    stabilizerContributions: [['m_core', 10, 'Posture']]
  }));

  items.push(createExercise({
    id: 'ex_cable_hammer_curl_rope',
    name: 'Cable Hammer Curl (Rope)',
    description: 'Continuous cable tension on the brachialis and forearms throughout the entire range.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Attach rope to low pulley. Hold with neutral grip, elbows tucked at sides.',
      'Curl upward, pulling rope ends slightly outward at top contraction.'
    ],
    primaryContributions: [
      ['m_brachialis', 55, 'Brachialis thickness'],
      ['m_forearms', 30, 'Brachioradialis']
    ],
    secondaryContributions: [
      ['m_biceps_long_head', 15, 'Long head']
    ],
    stabilizerContributions: [['m_core', 10, 'Core support']]
  }));

  items.push(createExercise({
    id: 'ex_preacher_curl_ez_bar',
    name: 'EZ-Bar Preacher Curl',
    description: 'Strict bicep isolation eliminating body momentum and targeting the lower biceps stretch.',
    equipment: 'barbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Sit at preacher bench with armpits snug against pad. Hold EZ-bar with inner grip.',
      'Lower bar slowly until arms are nearly fully extended.',
      'Curl bar up to vertical forearm position, squeezing hard.'
    ],
    primaryContributions: [
      ['m_biceps_short_head', 65, 'Short head strict isolation'],
      ['m_brachialis', 25, 'Lower elbow flexion']
    ],
    secondaryContributions: [
      ['m_biceps_long_head', 10, 'Long head assist']
    ],
    stabilizerContributions: [['m_forearms', 15, 'Wrist stability on pad']]
  }));

  items.push(createExercise({
    id: 'ex_preacher_curl_dumbbell',
    name: 'Single-Arm Dumbbell Preacher Curl',
    description: 'Unilateral preacher curl fixing arm imbalances with pure bicep focus.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Rest one arm over preacher pad holding dumbbell.',
      'Lower dumbbell under control to full elbow extension, curl up smoothly.'
    ],
    primaryContributions: [
      ['m_biceps_short_head', 70, 'Unilateral short head isolation'],
      ['m_brachialis', 20, 'Brachialis']
    ],
    secondaryContributions: [
      ['m_biceps_long_head', 10, 'Long head']
    ],
    stabilizerContributions: [['m_forearms', 10, 'Wrist control']]
  }));

  items.push(createExercise({
    id: 'ex_spider_curl',
    name: 'Spider Curl (Chest-Supported Incline)',
    description: 'Chest supported on incline bench with arms hanging vertically for extreme peak contraction.',
    equipment: 'barbell',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'arms',
    instructions: [
      'Lie face down on 45-degree incline bench with arms hanging straight down holding EZ-bar.',
      'Curl bar upward without allowing elbows to drift back, focusing on peak bicep squeeze.'
    ],
    primaryContributions: [
      ['m_biceps_short_head', 60, 'Short head peak contraction'],
      ['m_biceps_long_head', 30, 'Outer head']
    ],
    secondaryContributions: [
      ['m_brachialis', 10, 'Brachialis']
    ],
    stabilizerContributions: [['m_forearms', 10, 'Grip']]
  }));

  items.push(createExercise({
    id: 'ex_concentration_curl',
    name: 'Concentration Curl',
    description: 'Classic seated curl bracing elbow against inner thigh to eliminate all cheating.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Sit on bench, brace tricep against inner thigh.',
      'Curl dumbbell up toward face, supinating wrist at top squeeze.'
    ],
    primaryContributions: [
      ['m_biceps_long_head', 55, 'Bicep peak development'],
      ['m_biceps_short_head', 35, 'Short head thickness']
    ],
    secondaryContributions: [
      ['m_brachialis', 10, 'Brachialis']
    ],
    stabilizerContributions: [['m_forearms', 10, 'Wrist stabilization']]
  }));

  items.push(createExercise({
    id: 'ex_cable_biceps_curl',
    name: 'Standing Cable Biceps Curl (Straight Bar)',
    description: 'Continuous tension cable curl keeping biceps under constant load from start to finish.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Attach straight bar to low pulley. Stand tall, elbows tucked, curl bar up to chest.'
    ],
    primaryContributions: [
      ['m_biceps_short_head', 50, 'Constant cable tension'],
      ['m_biceps_long_head', 40, 'Long head']
    ],
    secondaryContributions: [
      ['m_brachialis', 10, 'Brachialis']
    ],
    stabilizerContributions: [['m_core', 10, 'Posture']]
  }));

  items.push(createExercise({
    id: 'ex_high_cable_curl_hercules',
    name: 'High Cable Curl (Hercules Curl)',
    description: 'Dual high pulley bicep curl mimicking front double bicep bodybuilding pose.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'arms',
    instructions: [
      'Stand between high pulleys, arms extended parallel to floor holding stirrup handles.',
      'Curl handles inward toward ears while keeping upper arms horizontal to floor.'
    ],
    primaryContributions: [
      ['m_biceps_long_head', 60, 'Peak bicep contraction in abduction'],
      ['m_biceps_short_head', 35, 'Short head']
    ],
    secondaryContributions: [
      ['m_brachialis', 5, 'Brachialis']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Horizontal arm support']]
  }));

  items.push(createExercise({
    id: 'ex_reverse_barbell_curl',
    name: 'Reverse Barbell Curl',
    description: 'Overhand grip curl targeting the brachioradialis, forearms, and brachialis.',
    equipment: 'barbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Hold barbell with overhand (pronated) grip shoulder-width.',
      'Curl bar up without letting wrists flex back, lower slowly.'
    ],
    primaryContributions: [
      ['m_forearms', 60, 'Brachioradialis dominant pull'],
      ['m_brachialis', 30, 'Deep brachialis flexor']
    ],
    secondaryContributions: [
      ['m_biceps_long_head', 10, 'Pronated bicep assistance']
    ],
    stabilizerContributions: [['m_core', 10, 'Core brace']]
  }));

  items.push(createExercise({
    id: 'ex_reverse_cable_curl',
    name: 'Reverse Cable Curl',
    description: 'Overhand cable curl delivering smooth resistance across the forearm and brachialis.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Attach bar to low pulley with pronated overhand grip. Curl smoothly to upper chest.'
    ],
    primaryContributions: [
      ['m_forearms', 60, 'Forearms'],
      ['m_brachialis', 30, 'Brachialis']
    ],
    secondaryContributions: [
      ['m_biceps_long_head', 10, 'Biceps']
    ],
    stabilizerContributions: [['m_core', 10, 'Posture']]
  }));

  items.push(createExercise({
    id: 'ex_ez_bar_21s_curl',
    name: 'EZ-Bar 21s Biceps Curl',
    description: 'High-volume fatigue protocol: 7 lower-half reps, 7 upper-half reps, 7 full reps.',
    equipment: 'barbell',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'arms',
    instructions: [
      'Perform 7 reps from bottom to 90 degrees, immediately 7 reps from 90 degrees to top, then 7 full range reps.'
    ],
    primaryContributions: [
      ['m_biceps_short_head', 50, 'Metabolic stress hypertrophy'],
      ['m_biceps_long_head', 40, 'Bicep peak']
    ],
    secondaryContributions: [
      ['m_brachialis', 10, 'Brachialis']
    ],
    stabilizerContributions: [['m_forearms', 20, 'Grip burn']]
  }));

  items.push(createExercise({
    id: 'ex_machine_preacher_curl',
    name: 'Machine Preacher Curl',
    description: 'Pin-loaded preacher curl with cam profile matching human strength curve.',
    equipment: 'machine',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Sit with chest against pad, grasp handles, curl upward smoothly through guided arc.'
    ],
    primaryContributions: [
      ['m_biceps_short_head', 65, 'Machine guided short head'],
      ['m_brachialis', 25, 'Brachialis']
    ],
    secondaryContributions: [
      ['m_biceps_long_head', 10, 'Long head']
    ],
    stabilizerContributions: [['m_forearms', 10, 'Wrist control']]
  }));

  // --- TRICEPS ---
  items.push(createExercise({
    id: 'ex_close_grip_barbell_bench_press',
    name: 'Close-Grip Barbell Bench Press',
    description: 'Heavy compound press shifting maximum mechanical tension onto the triceps brachii.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'arms',
    instructions: [
      'Lie on flat bench. Grip bar with hands shoulder-width apart (not touching to protect wrists).',
      'Lower bar to lower chest while keeping elbows tucked close to ribcage.',
      'Drive upward through triceps lockout.'
    ],
    primaryContributions: [
      ['m_triceps_lateral_head', 45, 'Heavy lockout drive'],
      ['m_triceps_medial_head', 30, 'Deep elbow extension']
    ],
    secondaryContributions: [
      ['m_chest_sternal', 15, 'Horizontal adduction synergy'],
      ['m_deltoid_anterior', 10, 'Shoulder flexion assist']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Joint tracking']]
  }));

  items.push(createExercise({
    id: 'ex_triceps_rope_pushdown',
    name: 'Triceps Rope Pushdown',
    description: 'Cable pushdown allowing flare-out at bottom to recruit the lateral triceps head.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Attach rope to high pulley. Stand with slight forward torso lean, elbows tucked at sides.',
      'Push rope down and spread ends apart at bottom lockout.',
      'Return slowly to 90 degrees elbow bend.'
    ],
    primaryContributions: [
      ['m_triceps_lateral_head', 60, 'Lateral head peak squeeze'],
      ['m_triceps_medial_head', 30, 'Medial head extension']
    ],
    secondaryContributions: [
      ['m_triceps_long_head', 10, 'Long head assist']
    ],
    stabilizerContributions: [['m_core', 10, 'Standing stability']]
  }));

  items.push(createExercise({
    id: 'ex_straight_bar_triceps_pushdown',
    name: 'Straight-Bar Triceps Pushdown',
    description: 'Allows heavier loading than rope to build raw triceps pressing power.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Grip straight bar on high pulley with overhand grip. Push down forcefully to lockout.'
    ],
    primaryContributions: [
      ['m_triceps_lateral_head', 55, 'Lateral head'],
      ['m_triceps_medial_head', 35, 'Medial head']
    ],
    secondaryContributions: [
      ['m_triceps_long_head', 10, 'Long head']
    ],
    stabilizerContributions: [['m_core', 10, 'Core brace']]
  }));

  items.push(createExercise({
    id: 'ex_v_bar_triceps_pushdown',
    name: 'V-Bar Triceps Pushdown',
    description: 'Angled V-bar providing wrist-friendly ergonomics for heavy triceps pushdowns.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Grip V-bar handle on high cable. Push downward through palms to full elbow extension.'
    ],
    primaryContributions: [
      ['m_triceps_lateral_head', 55, 'Lateral head power'],
      ['m_triceps_medial_head', 35, 'Medial head']
    ],
    secondaryContributions: [
      ['m_triceps_long_head', 10, 'Long head']
    ],
    stabilizerContributions: [['m_core', 10, 'Posture']]
  }));

  items.push(createExercise({
    id: 'ex_skull_crushers_lying_triceps_extension',
    name: 'Skull Crushers (EZ-Bar Lying Triceps Extension)',
    description: 'Classic lying triceps extension isolating the long and medial heads under deep stretch.',
    equipment: 'barbell',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'arms',
    videoUrl: 'https://www.youtube.com/embed/d_KZxkY_0cM',
    instructions: [
      'Lie flat holding EZ-bar with narrow grip extended over chest.',
      'Hinge at elbows, lowering bar toward forehead or slightly behind crown of head.',
      'Extend elbows back to starting position without letting upper arms swing.'
    ],
    primaryContributions: [
      ['m_triceps_long_head', 60, 'Stretched long head extension'],
      ['m_triceps_medial_head', 25, 'Medial head']
    ],
    secondaryContributions: [
      ['m_triceps_lateral_head', 15, 'Lockout assist']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Glenohumeral stability']]
  }));

  items.push(createExercise({
    id: 'ex_overhead_dumbbell_triceps_extension',
    name: 'Overhead Dumbbell Triceps Extension (Seated Two-Arm)',
    description: 'Places triceps long head on maximum anatomical stretch behind the neck.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Sit on bench holding one heavy dumbbell vertically overhead with both hands cupping top plate.',
      'Lower weight behind head by flexing elbows, keeping upper arms close to ears.',
      'Press upward back to full overhead extension.'
    ],
    primaryContributions: [
      ['m_triceps_long_head', 75, 'Maximum long head eccentric stretch']
    ],
    secondaryContributions: [
      ['m_triceps_medial_head', 15, 'Medial head'],
      ['m_triceps_lateral_head', 10, 'Lateral head']
    ],
    stabilizerContributions: [['m_core', 15, 'Anti-extension seated core']]
  }));

  items.push(createExercise({
    id: 'ex_overhead_cable_triceps_extension',
    name: 'Overhead Cable Triceps Extension (Rope)',
    description: 'Facing away from cable tower to keep continuous loaded stretch on the long head.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Set pulley at chest height. Grasp rope, turn away and lean forward into staggered stance.',
      'Extend arms overhead, spreading rope ends apart at full lockout.'
    ],
    primaryContributions: [
      ['m_triceps_long_head', 75, 'Constant tension long head']
    ],
    secondaryContributions: [
      ['m_triceps_lateral_head', 15, 'Lateral head'],
      ['m_triceps_medial_head', 10, 'Medial head']
    ],
    stabilizerContributions: [['m_core', 15, 'Standing forward lean core']]
  }));

  items.push(createExercise({
    id: 'ex_triceps_dips_upright',
    name: 'Triceps Dips (Upright Torso)',
    description: 'Parallel bar dip with vertical torso and elbows tucked back to target triceps.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'arms',
    instructions: [
      'Support body on parallel bars with upright torso and legs straight down.',
      'Lower body by bending elbows backward until arms reach 90 degrees.',
      'Push upward through triceps lockout.'
    ],
    primaryContributions: [
      ['m_triceps_lateral_head', 50, 'Elbow extension lockout'],
      ['m_triceps_long_head', 30, 'Triceps drive']
    ],
    secondaryContributions: [
      ['m_chest_costal', 10, 'Lower chest assist'],
      ['m_deltoid_anterior', 10, 'Front delt']
    ],
    stabilizerContributions: [['m_rotator_cuff', 20, 'Shoulder joint support']]
  }));

  items.push(createExercise({
    id: 'ex_bench_dips',
    name: 'Bench Dips',
    description: 'Accessible triceps dip placing hands on bench behind body.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Place hands on edge of bench, feet flat or on opposite bench in front of you.',
      'Lower hips down in front of bench until elbows reach 90 degrees, press up.'
    ],
    primaryContributions: [
      ['m_triceps_medial_head', 50, 'Medial head extension'],
      ['m_triceps_lateral_head', 35, 'Lateral head']
    ],
    secondaryContributions: [
      ['m_deltoid_anterior', 15, 'Anterior shoulder']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Shoulder control']]
  }));

  items.push(createExercise({
    id: 'ex_single_arm_cable_triceps_kickback',
    name: 'Single-Arm Cable Triceps Kickback',
    description: 'Maintains tension through full shoulder extension without dead spots.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'arms',
    instructions: [
      'Set cable at hip height without handle (hold bare cable). Hinge torso forward.',
      'Keep upper arm parallel to floor, extend forearm back until arm is locked straight.'
    ],
    primaryContributions: [
      ['m_triceps_lateral_head', 60, 'Peak contraction lateral head'],
      ['m_triceps_long_head', 30, 'Shoulder extension support']
    ],
    secondaryContributions: [
      ['m_triceps_medial_head', 10, 'Medial head']
    ],
    stabilizerContributions: [['m_deltoid_posterior', 10, 'Arm elevation']]
  }));

  items.push(createExercise({
    id: 'ex_dumbbell_triceps_kickback',
    name: 'Dumbbell Triceps Kickback',
    description: 'Free weight isolation providing peak contraction in full elbow and shoulder extension.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Brace on bench, upper arm pinned parallel to torso.',
      'Kick dumbbell back until arm is completely straight, pause 1 second.'
    ],
    primaryContributions: [
      ['m_triceps_lateral_head', 65, 'Lateral head peak squeeze'],
      ['m_triceps_long_head', 25, 'Long head']
    ],
    secondaryContributions: [
      ['m_triceps_medial_head', 10, 'Medial head']
    ],
    stabilizerContributions: [['m_deltoid_posterior', 10, 'Rear delt']]
  }));

  items.push(createExercise({
    id: 'ex_jm_press',
    name: 'JM Press (Hybrid Bench & Extension)',
    description: 'Powerlifting hybrid combining close-grip bench press with triceps extension for immense overload.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'arms',
    instructions: [
      'Hold bar over upper chest. Lower bar toward neck/throat by bending elbows and letting them flare slightly forward.',
      'Press up forcefully with pure triceps drive.'
    ],
    primaryContributions: [
      ['m_triceps_lateral_head', 50, 'Extreme heavy triceps overload'],
      ['m_triceps_medial_head', 30, 'Medial head power']
    ],
    secondaryContributions: [
      ['m_chest_sternal', 10, 'Pectoral press assist'],
      ['m_deltoid_anterior', 10, 'Front delt']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Heavy joint stability']]
  }));

  items.push(createExercise({
    id: 'ex_tate_press',
    name: 'Tate Press (Dumbbell Triceps Extension)',
    description: 'Lying dumbbell extension flaring elbows outward to target the medial and lateral triceps.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'arms',
    instructions: [
      'Lie flat with dumbbells touching over chest, palms facing feet with elbows flared out.',
      'Lower weights inward toward chest by bending elbows, press outward back to top.'
    ],
    primaryContributions: [
      ['m_triceps_lateral_head', 55, 'Lateral head'],
      ['m_triceps_medial_head', 35, 'Medial head']
    ],
    secondaryContributions: [
      ['m_triceps_long_head', 10, 'Long head assist']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Rotator cuff']]
  }));

  // --- FOREARMS & GRIP ---
  items.push(createExercise({
    id: 'ex_barbell_wrist_curl',
    name: 'Barbell Wrist Curl (Seated)',
    description: 'Forearm flexor builder performed resting forearms across thighs.',
    equipment: 'barbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Sit on bench resting forearms on thighs with wrists hanging off knees, palms facing up.',
      'Lower bar down into fingertips, then curl wrists upward as high as possible.'
    ],
    primaryContributions: [
      ['m_forearms', 100, 'Wrist flexors (flexor carpi radialis/ulnaris)']
    ],
    secondaryContributions: [],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_barbell_reverse_wrist_curl',
    name: 'Barbell Reverse Wrist Curl',
    description: 'Forearm extensor exercise building top-of-forearm density and wrist durability.',
    equipment: 'barbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Rest forearms on thighs with palms facing down. Curl wrists upward toward ceiling.'
    ],
    primaryContributions: [
      ['m_forearms', 100, 'Wrist extensors (extensor carpi radialis/ulnaris)']
    ],
    secondaryContributions: [],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_dumbbell_wrist_curl',
    name: 'Dumbbell Wrist Curl (Single-Arm)',
    description: 'Unilateral wrist curl allowing independent range of motion and wrist flexor focus.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'arms',
    instructions: [
      'Rest forearm on bench with wrist over edge, curl dumbbell up and down smoothly.'
    ],
    primaryContributions: [
      ['m_forearms', 100, 'Unilateral wrist flexors']
    ],
    secondaryContributions: [],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_farmers_walk',
    name: 'Farmer\'s Walk (Heavy Carry)',
    description: 'Heavy loaded carry building crushing grip, forearm thickness, upper traps, and core stability.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'arms',
    instructions: [
      'Deadlift heavy dumbbells or farmer handles. Stand tall with shoulders packed and chest up.',
      'Walk forward with smooth, controlled steps for distance or time, fighting any torso sway.'
    ],
    primaryContributions: [
      ['m_forearms', 50, 'Crushing isometric grip & wrist endurance'],
      ['m_trapezius_upper', 35, 'Heavy isometric scapular elevation']
    ],
    secondaryContributions: [
      ['m_core', 15, 'Braced spinal stabilization']
    ],
    stabilizerContributions: [
      ['m_gluteus_medius', 20, 'Pelvic balance in single-leg gait'],
      ['m_calves_gastrocnemius', 15, 'Ankle stabilization']
    ]
  }));

  return items;
}
