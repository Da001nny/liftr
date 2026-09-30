import { createExercise } from './exerciseGenerator.js';

export function getBackExerciseList() {
  const items = [];

  items.push(createExercise({
    id: 'ex_conventional_deadlift',
    name: 'Conventional Barbell Deadlift',
    description: 'The king of posterior chain movements engaging the spinal erectors, lats, glutes, and hamstrings.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'back',
    videoUrl: 'https://www.youtube.com/embed/op9kVnSso6Q',
    instructions: [
      'Stand with feet hip-width apart, barbell over mid-foot.',
      'Hinge at hips, grip bar just outside knees. Depress lats and brace core.',
      'Drive feet through floor, extending knees and hips simultaneously to lockout.'
    ],
    primaryContributions: [
      ['m_erector_spinae', 50, 'Spinal extension & isometric back brace'],
      ['m_latissimus_dorsi', 15, 'Bar path stabilization']
    ],
    secondaryContributions: [
      ['m_gluteus_maximus', 20, 'Hip extension power'],
      ['m_hamstrings', 15, 'Posterior chain load']
    ],
    stabilizerContributions: [
      ['m_trapezius_upper', 25, 'Shoulder girdle hang'],
      ['m_forearms', 25, 'Grip endurance'],
      ['m_transverse_abdominis', 25, 'Intra-abdominal pressure']
    ]
  }));

  items.push(createExercise({
    id: 'ex_sumo_deadlift',
    name: 'Sumo Barbell Deadlift',
    description: 'Wide stance deadlift variation shifting more demand onto the adductors and quads while working the back.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'back',
    instructions: [
      'Stand with feet wide pointing toward plates. Grip bar inside knees.',
      'Open knees out over toes, keep torso upright, and drive through heels to lockout.'
    ],
    primaryContributions: [
      ['m_erector_spinae', 40, 'Spinal stabilization'],
      ['m_gluteus_maximus', 30, 'Hip extension']
    ],
    secondaryContributions: [
      ['m_adductor_magnus', 15, 'Adductor drive'],
      ['m_quadriceps', 15, 'Knee extension initiation']
    ],
    stabilizerContributions: [
      ['m_trapezius_upper', 20, 'Scapular stabilization'],
      ['m_forearms', 20, 'Grip']
    ]
  }));

  items.push(createExercise({
    id: 'ex_barbell_bent_over_row_overhand',
    name: 'Barbell Bent-Over Row (Overhand)',
    description: 'Classic horizontal pulling compound exercise targeting the upper back, rhomboids, and lats.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'back',
    videoUrl: 'https://www.youtube.com/embed/G8l_8chR5BE',
    instructions: [
      'Hinge at hips with torso around 45 degrees, back flat. Grip bar with overhand grip.',
      'Pull bar toward lower ribcage / navel by driving elbows back.',
      'Squeeze shoulder blades together at top, lower under control.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 45, 'Horizontal shoulder extension'],
      ['m_trapezius_middle', 30, 'Scapular retraction']
    ],
    secondaryContributions: [
      ['m_biceps_short_head', 15, 'Elbow flexion'],
      ['m_deltoid_posterior', 10, 'Rear delt synergy']
    ],
    stabilizerContributions: [
      ['m_erector_spinae', 25, 'Isometric hinge support'],
      ['m_hamstrings', 15, 'Hips support']
    ]
  }));

  items.push(createExercise({
    id: 'ex_barbell_row_underhand',
    name: 'Barbell Bent-Over Row (Underhand / Yates)',
    description: 'Supinated grip row variation emphasizing lower lat recruitment and greater bicep leverage.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'back',
    instructions: [
      'Hold barbell with palms facing forward (underhand). Torso at 50-60 degrees.',
      'Pull bar smoothly into lower waist while keeping elbows tucked close to torso.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 55, 'Lower lat fibers'],
      ['m_trapezius_middle', 20, 'Mid-back squeeze']
    ],
    secondaryContributions: [
      ['m_biceps_long_head', 25, 'Supinated elbow flexion']
    ],
    stabilizerContributions: [['m_erector_spinae', 25, 'Torso stabilization']]
  }));

  items.push(createExercise({
    id: 'ex_pendlay_row',
    name: 'Pendlay Row (Strict Dead-Stop)',
    description: 'Strict horizontal row starting from a dead stop on the floor each rep, building explosive pulling power.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'back',
    instructions: [
      'Torso parallel to floor with plates resting on ground. Overhand grip slightly wider than shoulder.',
      'Explosively pull bar into sternum without rising with hips.',
      'Return bar completely to floor for dead stop between reps.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 40, 'Explosive lat pull'],
      ['m_trapezius_middle', 35, 'Upper back power']
    ],
    secondaryContributions: [
      ['m_deltoid_posterior', 15, 'Rear shoulder contraction'],
      ['m_biceps_short_head', 10, 'Arm flexion']
    ],
    stabilizerContributions: [
      ['m_erector_spinae', 30, 'Parallel torso brace'],
      ['m_hamstrings', 20, 'Posterior chain base']
    ]
  }));

  items.push(createExercise({
    id: 'ex_pull_up',
    name: 'Pull-Up (Overhand Wide Grip)',
    description: 'Benchmark bodyweight vertical pull building wide lat wingspan and upper back density.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'back',
    videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
    instructions: [
      'Grip bar with overhand grip wider than shoulders. Hang in full dead hang.',
      'Depress scapulae and pull elbows down and back toward ribs.',
      'Bring chin clearing over bar, pause, and lower to full dead hang.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 60, 'Vertical shoulder adduction'],
      ['m_teres_major', 15, 'Upper lat assist']
    ],
    secondaryContributions: [
      ['m_biceps_short_head', 15, 'Elbow flexion'],
      ['m_trapezius_lower', 10, 'Scapular depression']
    ],
    stabilizerContributions: [
      ['m_core', 15, 'Anti-swing core brace'],
      ['m_forearms', 20, 'Grip hang']
    ]
  }));

  items.push(createExercise({
    id: 'ex_chin_up',
    name: 'Chin-Up (Underhand Supinated Grip)',
    description: 'Supinated vertical pull maximizing biceps leverage while powerfully working the lats.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'back',
    instructions: [
      'Grip bar shoulder-width with palms facing you (underhand).',
      'Pull chest up toward bar, driving elbows downward.',
      'Lower smoothly to full elbow extension.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 55, 'Lat adduction'],
      ['m_biceps_long_head', 30, 'Biceps flexion']
    ],
    secondaryContributions: [
      ['m_trapezius_lower', 15, 'Scapular depression']
    ],
    stabilizerContributions: [
      ['m_rectus_abdominis', 15, 'Hollow body brace'],
      ['m_forearms', 15, 'Grip']
    ]
  }));

  items.push(createExercise({
    id: 'ex_neutral_grip_pull_up',
    name: 'Neutral Grip Pull-Up',
    description: 'Parallel grip pull-up offering shoulder-friendly biomechanics and strong brachialis recruitment.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'back',
    instructions: [
      'Grasp parallel handles with palms facing each other.',
      'Pull body up leading with chest until chin passes handles.',
      'Lower under complete control.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 55, 'Lat vertical pull'],
      ['m_brachialis', 25, 'Neutral elbow flexion']
    ],
    secondaryContributions: [
      ['m_trapezius_middle', 10, 'Mid-back'],
      ['m_teres_major', 10, 'Upper lat synergy']
    ],
    stabilizerContributions: [['m_core', 15, 'Trunk stability']]
  }));

  items.push(createExercise({
    id: 'ex_lat_pulldown_wide',
    name: 'Wide-Grip Lat Pulldown',
    description: 'Cable machine vertical pull isolating the latissimus dorsi with adjustable resistance.',
    equipment: 'cable',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'back',
    instructions: [
      'Sit facing machine with thighs secured under pads. Grasp bar wide with overhand grip.',
      'Lean back slightly (10-15 degrees), pull bar down toward upper chest touching collarbones.',
      'Squeeze lats at bottom, allow bar to return smoothly to full overhead stretch.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 65, 'Frontal plane lat adduction'],
      ['m_teres_major', 15, 'Upper lat assistance']
    ],
    secondaryContributions: [
      ['m_biceps_short_head', 10, 'Elbow flexion'],
      ['m_trapezius_lower', 10, 'Scapular depression']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Shoulder joint control']]
  }));

  items.push(createExercise({
    id: 'ex_lat_pulldown_close_grip',
    name: 'Close-Grip Lat Pulldown (V-Bar)',
    description: 'Close neutral-grip cable pulldown allowing deep lat stretch and long range of motion.',
    equipment: 'cable',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'back',
    instructions: [
      'Attach V-bar handle to pulldown cable. Secure thighs.',
      'Pull handle down to upper chest, keeping elbows tight to body.',
      'Elevate arms slowly to feel extreme lat stretch.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 65, 'Sagittal plane lat extension'],
      ['m_biceps_long_head', 20, 'Neutral arm flexion']
    ],
    secondaryContributions: [
      ['m_trapezius_middle', 15, 'Mid-back retraction']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Scapular stability']]
  }));

  items.push(createExercise({
    id: 'ex_lat_pulldown_reverse_grip',
    name: 'Reverse-Grip Lat Pulldown',
    description: 'Underhand pulldown variation increasing bicep leverage and targeting lower lats.',
    equipment: 'cable',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'back',
    instructions: [
      'Grip straight bar shoulder-width with palms facing you.',
      'Pull down to mid-chest with elbows driving back and down.',
      'Control the ascent to full stretch.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 60, 'Lower lat focus'],
      ['m_biceps_short_head', 25, 'Supinated bicep synergy']
    ],
    secondaryContributions: [
      ['m_trapezius_lower', 15, 'Scapular depression']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Shoulder control']]
  }));

  items.push(createExercise({
    id: 'ex_seated_cable_row',
    name: 'Seated Cable Row (V-Bar)',
    description: 'Horizontal cable row building mid-back thickness, rhomboids, and lower lats.',
    equipment: 'cable',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'back',
    instructions: [
      'Sit on bench with feet on footplates, knees slightly bent. Grasp V-bar handle.',
      'Sit upright with chest proud. Pull handle into navel, driving elbows back.',
      'Squeeze mid-back tightly, then extend arms with slight forward hinge stretch.'
    ],
    primaryContributions: [
      ['m_trapezius_middle', 45, 'Rhomboid & mid-trap retraction'],
      ['m_latissimus_dorsi', 35, 'Horizontal lat extension']
    ],
    secondaryContributions: [
      ['m_biceps_long_head', 10, 'Elbow flexion'],
      ['m_deltoid_posterior', 10, 'Rear delt synergy']
    ],
    stabilizerContributions: [['m_erector_spinae', 20, 'Isometric upright posture']]
  }));

  items.push(createExercise({
    id: 'ex_single_arm_dumbbell_row',
    name: 'Single-Arm Dumbbell Row',
    description: 'Unilateral free-weight row correcting muscular imbalances and allowing immense stretch.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'back',
    instructions: [
      'Place one knee and hand on flat bench, torso parallel to floor.',
      'Hold dumbbell with free hand hanging straight down.',
      'Pull dumbbell in an arc toward hip, driving elbow to ceiling.',
      'Lower under control to a deep lat stretch.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 55, 'Unilateral lat row'],
      ['m_trapezius_middle', 25, 'Scapular retraction']
    ],
    secondaryContributions: [
      ['m_biceps_long_head', 10, 'Arm flexion'],
      ['m_deltoid_posterior', 10, 'Rear shoulder']
    ],
    stabilizerContributions: [['m_core', 15, 'Anti-rotation core']]
  }));

  items.push(createExercise({
    id: 'ex_meadows_row',
    name: 'Meadows Row (Landmine)',
    description: 'Overhand landmine row developed by John Meadows to blast the upper lats, teres major, and rear delts.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'back',
    instructions: [
      'Stand perpendicular to end of landmine bar in staggered stance.',
      'Grip the thick collar with an overhand grip.',
      'Row the elbow up and out to side, achieving deep squeeze in upper lat and teres.',
      'Lower slowly to floor stretch.'
    ],
    primaryContributions: [
      ['m_teres_major', 40, 'Upper lat / teres emphasis'],
      ['m_latissimus_dorsi', 30, 'Lat pull']
    ],
    secondaryContributions: [
      ['m_deltoid_posterior', 20, 'Rear delt contraction'],
      ['m_biceps_short_head', 10, 'Bicep assist']
    ],
    stabilizerContributions: [['m_obliques', 20, 'Anti-rotational stability']]
  }));

  items.push(createExercise({
    id: 'ex_kroc_row',
    name: 'Kroc Row (Heavy High-Rep Dumbbell Row)',
    description: 'Heavy high-rep dumbbell row incorporating controlled body English to build grip and back mass.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'back',
    instructions: [
      'Brace with hand on dumbbell rack or bench.',
      'Using a heavy dumbbell, explode elbow toward hip for 15-25 brutal reps with full stretch at bottom.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 50, 'Heavy overload lat work'],
      ['m_trapezius_middle', 25, 'Mid-back thickness']
    ],
    secondaryContributions: [
      ['m_forearms', 15, 'Crushing grip load'],
      ['m_deltoid_posterior', 10, 'Rear delt']
    ],
    stabilizerContributions: [['m_erector_spinae', 20, 'Spinal support']]
  }));

  items.push(createExercise({
    id: 'ex_t_bar_row_chest_supported',
    name: 'Chest-Supported T-Bar Row',
    description: 'Eliminates lower back fatigue entirely, allowing pure mid-back and upper lat isolation.',
    equipment: 'machine',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'back',
    instructions: [
      'Lie chest-down on angled pad. Grasp handles with preferred width grip.',
      'Pull weight up by driving elbows back, retracting shoulder blades fully.',
      'Lower smoothly without allowing weight to rest between reps.'
    ],
    primaryContributions: [
      ['m_trapezius_middle', 50, 'Pure rhomboid & mid-trap squeeze'],
      ['m_latissimus_dorsi', 30, 'Lat adduction']
    ],
    secondaryContributions: [
      ['m_deltoid_posterior', 10, 'Rear delt'],
      ['m_biceps_long_head', 10, 'Elbow flexion']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Shoulder control']]
  }));

  items.push(createExercise({
    id: 'ex_t_bar_row_free_weight',
    name: 'T-Bar Row (Free-Weight)',
    description: 'Classic heavy back builder requiring strong spinal erectors and hamstring stabilization.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'back',
    instructions: [
      'Straddle landmine bar with V-handle underneath collar.',
      'Hinge hips at 45 degrees, pull handle to lower abdomen, keeping spine neutral.',
      'Lower to complete stretch.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 45, 'Lat extension drive'],
      ['m_trapezius_middle', 30, 'Mid-back retraction']
    ],
    secondaryContributions: [
      ['m_biceps_long_head', 15, 'Arm flexion'],
      ['m_deltoid_posterior', 10, 'Rear delt']
    ],
    stabilizerContributions: [
      ['m_erector_spinae', 25, 'Spinal erector brace'],
      ['m_hamstrings', 15, 'Hamstring support']
    ]
  }));

  items.push(createExercise({
    id: 'ex_chest_supported_machine_row',
    name: 'Chest-Supported Machine Row',
    description: 'Guided horizontal row with chest pad ensuring zero lower back strain.',
    equipment: 'machine',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'back',
    instructions: [
      'Adjust chest pad and seat height so handles align with mid-chest.',
      'Pull handles back smoothly, squeezing shoulder blades together.',
      'Control the weight stack back to starting stretch.'
    ],
    primaryContributions: [
      ['m_trapezius_middle', 50, 'Mid-back & rhomboids'],
      ['m_latissimus_dorsi', 35, 'Lats']
    ],
    secondaryContributions: [
      ['m_biceps_short_head', 15, 'Biceps synergy']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Scapular tracking']]
  }));

  items.push(createExercise({
    id: 'ex_straight_arm_cable_pulldown',
    name: 'Straight-Arm Cable Pulldown',
    description: 'Pure lat isolation movement eliminating biceps involvement via extended elbows.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'back',
    instructions: [
      'Stand facing high cable with straight or rope attachment. Grasp with arms extended.',
      'Hinge forward slightly at hips. With straight arms, sweep bar down in an arc to thighs.',
      'Contract lats hard at bottom, then return slowly to forehead height.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 75, 'Pure shoulder extension isolation'],
      ['m_teres_major', 15, 'Upper lat synergy']
    ],
    secondaryContributions: [
      ['m_triceps_long_head', 10, 'Isometric elbow extension support']
    ],
    stabilizerContributions: [
      ['m_rectus_abdominis', 15, 'Anti-extension core brace'],
      ['m_serratus_anterior', 10, 'Ribcage stabilization']
    ]
  }));

  items.push(createExercise({
    id: 'ex_dumbbell_pullover',
    name: 'Dumbbell Pullover',
    description: 'Classic exercise expanding ribcage and providing loaded eccentric stretch to the lats and serratus.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'back',
    instructions: [
      'Lie perpendicular across bench with upper back supported, hips lowered slightly.',
      'Hold dumbbell with palms flat under top plate over chest.',
      'Lower dumbbell back over head in an arc until deep lat stretch is achieved.',
      'Pull dumbbell back over chest using lats.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 65, 'Long-lever lat extension'],
      ['m_teres_major', 15, 'Teres synergy']
    ],
    secondaryContributions: [
      ['m_chest_costal', 10, 'Lower chest stretch assistance'],
      ['m_triceps_long_head', 10, 'Shoulder extension assist']
    ],
    stabilizerContributions: [
      ['m_serratus_anterior', 20, 'Scapular control'],
      ['m_core', 15, 'Pelvic anchor']
    ]
  }));

  items.push(createExercise({
    id: 'ex_single_arm_cable_lat_pulldown',
    name: 'Single-Arm Kneeling Cable Lat Pulldown',
    description: 'Unilateral cable pulldown aligning line of pull directly with individual lat fiber angles.',
    equipment: 'cable',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'back',
    instructions: [
      'Half-kneel facing cable tower with single handle attached high.',
      'Reach up to full stretch, pull elbow down tight to ribcage.',
      'Pause and squeeze lower lat, return slowly.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 75, 'Optimized lat fiber alignment'],
      ['m_teres_major', 10, 'Upper lat synergy']
    ],
    secondaryContributions: [
      ['m_biceps_short_head', 15, 'Arm flexion']
    ],
    stabilizerContributions: [['m_obliques', 15, 'Anti-rotation core']]
  }));

  items.push(createExercise({
    id: 'ex_inverted_row',
    name: 'Inverted Row (Australian Pull-Up)',
    description: 'Horizontal bodyweight pull on barbell or rings developing mid-back control and posture.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'back',
    instructions: [
      'Set barbell in rack at waist height. Hang underneath with heels on floor.',
      'Maintain rigid straight plank body line. Pull chest up to touch bar.',
      'Lower under control to full arm hang.'
    ],
    primaryContributions: [
      ['m_trapezius_middle', 45, 'Scapular retraction'],
      ['m_latissimus_dorsi', 35, 'Horizontal pulling']
    ],
    secondaryContributions: [
      ['m_biceps_long_head', 10, 'Bicep assist'],
      ['m_deltoid_posterior', 10, 'Rear delt']
    ],
    stabilizerContributions: [
      ['m_rectus_abdominis', 20, 'Plank core brace'],
      ['m_gluteus_maximus', 15, 'Hip extension']
    ]
  }));

  items.push(createExercise({
    id: 'ex_rack_pull',
    name: 'Rack Pull (Block Pull)',
    description: 'Partial deadlift from knee height overloading the upper back, traps, and spinal erectors.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'back',
    instructions: [
      'Set bar on safety pins just below or at knee level.',
      'Hinge hips back, brace core, and drive through hips to full upright lockout.',
      'Lower bar to pins under control.'
    ],
    primaryContributions: [
      ['m_erector_spinae', 50, 'Spinal extension overload'],
      ['m_trapezius_upper', 25, 'Heavy trap hang']
    ],
    secondaryContributions: [
      ['m_latissimus_dorsi', 15, 'Bar path lat engagement'],
      ['m_gluteus_maximus', 10, 'Hip lockout']
    ],
    stabilizerContributions: [['m_forearms', 25, 'Massive grip overload']]
  }));

  items.push(createExercise({
    id: 'ex_good_morning_barbell',
    name: 'Barbell Good Morning',
    description: 'Hip hinge movement placing enormous eccentric overload on spinal erectors and hamstrings.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'back',
    instructions: [
      'Place barbell across upper back as in a squat. Soften knees slightly.',
      'Hinge hips backward keeping spine locked flat until torso is near parallel.',
      'Drive hips forward to return to standing.'
    ],
    primaryContributions: [
      ['m_erector_spinae', 55, 'Dynamic spinal erector extension'],
      ['m_hamstrings', 30, 'Hamstring hip extension']
    ],
    secondaryContributions: [
      ['m_gluteus_maximus', 15, 'Glute lockout']
    ],
    stabilizerContributions: [['m_core', 20, 'Abdominal bracing']]
  }));

  items.push(createExercise({
    id: 'ex_hyperextension_back',
    name: 'Back Extension (Hyperextension Bench)',
    description: 'Focused spinal extension exercise isolating lower back erectors with glute/hamstring assistance.',
    equipment: 'bodyweight',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'back',
    instructions: [
      'Set pad at hip level on 45-degree bench. Cross arms over chest.',
      'Bend forward at waist with neutral spine, then extend back up until body is straight.'
    ],
    primaryContributions: [
      ['m_erector_spinae', 65, 'Spinal extension']
    ],
    secondaryContributions: [
      ['m_gluteus_maximus', 20, 'Glute extension'],
      ['m_hamstrings', 15, 'Hamstring assist']
    ],
    stabilizerContributions: [['m_core', 10, 'Trunk stability']]
  }));

  items.push(createExercise({
    id: 'ex_reverse_hyperextension',
    name: 'Reverse Hyperextension',
    description: 'Decompresses the lumbar spine while strengthening lower back, glutes, and hamstrings.',
    equipment: 'machine',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'back',
    instructions: [
      'Lie face down on machine with legs hanging. Grip handles firmly.',
      'Swing legs up until parallel with torso, squeezing glutes and lower back.',
      'Lower smoothly into spinal decompression.'
    ],
    primaryContributions: [
      ['m_erector_spinae', 50, 'Lumbar extension without spinal compression'],
      ['m_gluteus_maximus', 30, 'Hip extension']
    ],
    secondaryContributions: [
      ['m_hamstrings', 20, 'Hamstrings']
    ],
    stabilizerContributions: [['m_latissimus_dorsi', 10, 'Handle brace']]
  }));

  items.push(createExercise({
    id: 'ex_snatch_grip_deadlift',
    name: 'Snatch-Grip Deadlift',
    description: 'Extra-wide grip deadlift creating extended range of motion and exceptional upper trap/lat demand.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'back',
    instructions: [
      'Take a very wide collar-to-collar grip on barbell.',
      'Drop hips lower than conventional deadlift, pull bar smoothly from floor to full hip extension.'
    ],
    primaryContributions: [
      ['m_erector_spinae', 45, 'Extended range spinal extension'],
      ['m_trapezius_upper', 25, 'Wide grip trap overload']
    ],
    secondaryContributions: [
      ['m_latissimus_dorsi', 15, 'Lat stability'],
      ['m_hamstrings', 15, 'Hamstrings']
    ],
    stabilizerContributions: [['m_forearms', 30, 'Extreme grip challenge']]
  }));

  items.push(createExercise({
    id: 'ex_seal_row',
    name: 'Seal Row (Barbell on Elevated Bench)',
    description: 'Bench elevated on blocks allowing dead-hang barbell row with zero lower back strain.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'back',
    instructions: [
      'Lie face down on horizontal bench elevated on boxes or pins.',
      'Pull barbell straight up to touch underside of bench, driving elbows to ceiling.',
      'Lower to full hang stretch.'
    ],
    primaryContributions: [
      ['m_trapezius_middle', 50, 'Strict mid-trap and rhomboid pull'],
      ['m_latissimus_dorsi', 30, 'Lats']
    ],
    secondaryContributions: [
      ['m_deltoid_posterior', 10, 'Rear delt'],
      ['m_biceps_short_head', 10, 'Biceps']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Scapular tracking']]
  }));

  items.push(createExercise({
    id: 'ex_neutral_grip_dumbbell_row',
    name: 'Two-Arm Neutral Grip Dumbbell Row (Chest Supported)',
    description: 'Angled bench row with dumbbells allowing independent arm path and deep squeeze.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'back',
    instructions: [
      'Set incline bench to 30-45 degrees, lie prone with dumbbells in hands.',
      'Pull elbows back along ribcage, squeezing mid-back and lats.',
      'Lower slowly to full stretch.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 45, 'Lats'],
      ['m_trapezius_middle', 35, 'Mid-back']
    ],
    secondaryContributions: [
      ['m_biceps_long_head', 10, 'Bicep assist'],
      ['m_deltoid_posterior', 10, 'Rear shoulder']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Shoulder stability']]
  }));

  items.push(createExercise({
    id: 'ex_barbell_shrug',
    name: 'Barbell Shrug',
    description: 'Heavy overload for the upper trapezius fibers to build thick neck and shoulder yoke.',
    equipment: 'barbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'back',
    instructions: [
      'Hold barbell at arm length in front of thighs with shoulder-width grip.',
      'Elevate shoulders straight up toward ears without rolling shoulders.',
      'Hold peak trap contraction for 1 second, lower slowly.'
    ],
    primaryContributions: [
      ['m_trapezius_upper', 85, 'Direct scapular elevation']
    ],
    secondaryContributions: [
      ['m_trapezius_middle', 15, 'Mid-trap support']
    ],
    stabilizerContributions: [['m_forearms', 20, 'Grip endurance']]
  }));

  items.push(createExercise({
    id: 'ex_dumbbell_shrug',
    name: 'Dumbbell Shrug',
    description: 'Allows arms to hang naturally at sides for optimal line of upper trapezius pull.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'back',
    instructions: [
      'Hold dumbbells at sides with palms facing inward.',
      'Shrug shoulders directly upward toward ears, pause at top, lower under control.'
    ],
    primaryContributions: [
      ['m_trapezius_upper', 85, 'Upper trapezius elevation']
    ],
    secondaryContributions: [
      ['m_trapezius_middle', 15, 'Retraction synergy']
    ],
    stabilizerContributions: [['m_forearms', 15, 'Grip']]
  }));

  items.push(createExercise({
    id: 'ex_cable_shrug',
    name: 'Cable Shrug',
    description: 'Constant tension trap elevation using low pulley with straight or angled bar.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'back',
    instructions: [
      'Attach bar to low pulley. Stand tall and elevate shoulders against continuous cable resistance.'
    ],
    primaryContributions: [
      ['m_trapezius_upper', 85, 'Constant tension trap work']
    ],
    secondaryContributions: [
      ['m_trapezius_middle', 15, 'Mid-back']
    ],
    stabilizerContributions: [['m_core', 10, 'Standing posture']]
  }));

  items.push(createExercise({
    id: 'ex_behind_back_barbell_shrug',
    name: 'Behind-the-Back Barbell Shrug',
    description: 'Barbell held behind thighs for enhanced middle and upper trapezius fiber recruitment.',
    equipment: 'barbell',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'back',
    instructions: [
      'Hold barbell behind glutes with overhand grip.',
      'Shrug shoulders upward and slightly backward, pausing at peak contraction.'
    ],
    primaryContributions: [
      ['m_trapezius_upper', 70, 'Scapular elevation'],
      ['m_trapezius_middle', 20, 'Posterior retraction']
    ],
    secondaryContributions: [
      ['m_deltoid_posterior', 10, 'Rear delt synergy']
    ],
    stabilizerContributions: [['m_forearms', 15, 'Grip']]
  }));

  items.push(createExercise({
    id: 'ex_lat_pulldown_behind_neck',
    name: 'Lat Pulldown Behind Neck',
    description: 'Classic vertical pull emphasizing lower traps, rhomboids, and teres with strict form.',
    equipment: 'cable',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'back',
    instructions: [
      'Sit facing pulldown machine, pull bar smoothly behind head to base of neck.',
      'Do not thrust neck forward. Lower under control.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 55, 'Lat adduction'],
      ['m_trapezius_middle', 25, 'Mid-back retraction']
    ],
    secondaryContributions: [
      ['m_trapezius_lower', 10, 'Scapular depression'],
      ['m_biceps_short_head', 10, 'Bicep assist']
    ],
    stabilizerContributions: [['m_rotator_cuff', 20, 'Glenohumeral caution']]
  }));

  items.push(createExercise({
    id: 'ex_v_bar_lat_pulldown',
    name: 'V-Bar Lat Pulldown (Dual Handles)',
    description: 'Dual D-handle or V-bar pulldown offering wrist freedom and deep lat activation.',
    equipment: 'cable',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'back',
    instructions: [
      'Pull handles down to upper chest, flared elbows rotating slightly inward at bottom squeeze.'
    ],
    primaryContributions: [
      ['m_latissimus_dorsi', 65, 'Lats'],
      ['m_teres_major', 15, 'Teres major']
    ],
    secondaryContributions: [
      ['m_biceps_long_head', 10, 'Biceps'],
      ['m_trapezius_lower', 10, 'Lower traps']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Joint stability']]
  }));

  return items;
}
