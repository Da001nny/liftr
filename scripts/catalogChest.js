import { createExercise } from './exerciseGenerator.js';

export function getFullExerciseList() {
  const items = [];

  // =========================================================================
  // 1. CHEST (30 exercises)
  // =========================================================================
  items.push(createExercise({
    id: 'ex_barbell_bench_press',
    name: 'Barbell Bench Press',
    description: 'The foundational horizontal push compound movement for chest, front deltoids, and triceps.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'chest',
    videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
    instructions: [
      'Lie flat on the bench with eyes positioned directly under the barbell.',
      'Grip the bar slightly wider than shoulder-width and retract your shoulder blades into the bench.',
      'Unrack the bar, lower it with control to mid-chest while tucking elbows at roughly 45-75 degrees.',
      'Drive powerfully upward until arms are extended, keeping feet driven into the floor.'
    ],
    primaryContributions: [['m_chest_sternal', 60, 'Primary horizontal adduction']],
    secondaryContributions: [
      ['m_deltoid_anterior', 25, 'Shoulder flexion synergy'],
      ['m_triceps_lateral_head', 15, 'Elbow lockout extension']
    ],
    stabilizerContributions: [
      ['m_rotator_cuff', 15, 'Glenohumeral joint stabilization'],
      ['m_core', 10, 'Trunk stability']
    ]
  }));

  items.push(createExercise({
    id: 'ex_incline_barbell_bench_press',
    name: 'Incline Barbell Bench Press',
    description: 'Angled barbell press emphasizing the clavicular head of the pectoralis major and anterior deltoids.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'chest',
    videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8',
    instructions: [
      'Set bench to a 30-degree incline. Grip bar with hands slightly wider than shoulder-width.',
      'Unrack and lower the bar under control toward upper chest near collarbones.',
      'Press upward and slightly backward over shoulders to complete extension.'
    ],
    primaryContributions: [['m_chest_clavicular', 60, 'Clavicular pectoralis upper fibers']],
    secondaryContributions: [
      ['m_deltoid_anterior', 25, 'High shoulder flexion load'],
      ['m_triceps_lateral_head', 15, 'Elbow extension']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Scapular tracking']]
  }));

  items.push(createExercise({
    id: 'ex_decline_barbell_bench_press',
    name: 'Decline Barbell Bench Press',
    description: 'Decline press focusing on the lower sternocostal pectoral fibers with reduced shoulder strain.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'chest',
    instructions: [
      'Secure legs in decline bench rollers. Grip bar slightly wider than shoulder-width.',
      'Lower bar to the lower chest / xiphoid process.',
      'Drive upward locked into the decline plane.'
    ],
    primaryContributions: [['m_chest_costal', 65, 'Lower costal pectoral drive']],
    secondaryContributions: [
      ['m_triceps_lateral_head', 20, 'Elbow extension'],
      ['m_deltoid_anterior', 15, 'Shoulder flexion']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Shoulder stability']]
  }));

  items.push(createExercise({
    id: 'ex_flat_dumbbell_press',
    name: 'Flat Dumbbell Press',
    description: 'Allows greater range of motion and converging path for chest muscle fibers.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'chest',
    instructions: [
      'Sit on bench with dumbbells resting on knees, kick back into lying position.',
      'Press dumbbells up with a natural convergence at the peak without clashing weights.',
      'Lower dumbbells slowly until deep stretch is felt in mid-chest.'
    ],
    primaryContributions: [['m_chest_sternal', 65, 'Mid-chest horizontal adduction']],
    secondaryContributions: [
      ['m_deltoid_anterior', 20, 'Anterior delt assistance'],
      ['m_triceps_medial_head', 15, 'Triceps extension']
    ],
    stabilizerContributions: [['m_rotator_cuff', 20, 'Unilateral stabilization']]
  }));

  items.push(createExercise({
    id: 'ex_incline_dumbbell_press',
    name: 'Incline Dumbbell Press',
    description: 'Gold standard upper chest builder providing independent limb stabilization and natural arch.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'chest',
    instructions: [
      'Set incline to 30-45 degrees. Kick dumbbells into position over upper chest.',
      'Lower dumbbells with elbows at roughly 60 degrees from torso.',
      'Press upward in an arc bringing bells together over upper chest.'
    ],
    primaryContributions: [['m_chest_clavicular', 65, 'Upper chest focus']],
    secondaryContributions: [
      ['m_deltoid_anterior', 20, 'Shoulder flexion'],
      ['m_triceps_lateral_head', 15, 'Lockout']
    ],
    stabilizerContributions: [['m_rotator_cuff', 20, 'High unilateral joint stability']]
  }));

  items.push(createExercise({
    id: 'ex_decline_dumbbell_press',
    name: 'Decline Dumbbell Press',
    description: 'Targets the lower pectoralis fibers while allowing natural wrist rotation.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'chest',
    instructions: [
      'Secure feet on decline bench, lie back with dumbbells.',
      'Lower weights to sides of lower chest, then press back to full extension.'
    ],
    primaryContributions: [['m_chest_costal', 70, 'Lower chest adduction']],
    secondaryContributions: [
      ['m_triceps_lateral_head', 20, 'Triceps lockout'],
      ['m_deltoid_anterior', 10, 'Minimal shoulder flexion']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Shoulder control']]
  }));

  items.push(createExercise({
    id: 'ex_flat_dumbbell_fly',
    name: 'Flat Dumbbell Fly',
    description: 'Isolation chest movement providing continuous loaded stretch on the pectoral fibers.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'chest',
    instructions: [
      'Lie flat with dumbbells extended over chest, palms facing each other.',
      'Lower arms laterally in an arc with a slight elbow bend until a comfortable chest stretch is achieved.',
      'Contract pectorals to bring dumbbells back along the same arc.'
    ],
    primaryContributions: [['m_chest_sternal', 80, 'Pure horizontal adduction']],
    secondaryContributions: [
      ['m_deltoid_anterior', 20, 'Anterior shoulder support']
    ],
    stabilizerContributions: [
      ['m_biceps_short_head', 15, 'Elbow angle stabilization'],
      ['m_rotator_cuff', 15, 'Shoulder joint control']
    ]
  }));

  items.push(createExercise({
    id: 'ex_incline_dumbbell_fly',
    name: 'Incline Dumbbell Fly',
    description: 'Upper pectoral isolation providing stretch and contraction on a 30-degree incline.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'chest',
    instructions: [
      'Set bench to 30 degrees incline. Hold dumbbells overhead with palms facing inward.',
      'Open arms wide with slight elbow bend, feeling stretch across clavicular head.',
      'Squeeze upper chest to return dumbbells to top.'
    ],
    primaryContributions: [['m_chest_clavicular', 80, 'Upper chest horizontal adduction']],
    secondaryContributions: [['m_deltoid_anterior', 20, 'Anterior deltoid synergy']],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Glenohumeral protection']]
  }));

  items.push(createExercise({
    id: 'ex_cable_crossover_high_to_low',
    name: 'Cable Crossover (High to Low)',
    description: 'Constant-tension cable adduction targeting lower and sternal pectoral fibers.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'chest',
    instructions: [
      'Set pulleys above head height. Grasp handles and step forward with one foot.',
      'With slight elbow bend, pull handles downward and together in front of waist.',
      'Squeeze lower chest hard at peak contraction, return under control.'
    ],
    primaryContributions: [['m_chest_costal', 75, 'Downward adduction focus']],
    secondaryContributions: [
      ['m_chest_sternal', 15, 'Sternal assistance'],
      ['m_deltoid_anterior', 10, 'Anterior delt']
    ],
    stabilizerContributions: [['m_core', 15, 'Anti-extension standing core']]
  }));

  items.push(createExercise({
    id: 'ex_cable_fly_low_to_high',
    name: 'Cable Fly (Low to High)',
    description: 'Scooping cable motion aligning with upper pectoral fibers running from collarbone.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'chest',
    instructions: [
      'Set pulleys to lowest position. Grasp handles with palms facing upward.',
      'Sweep hands upward and inward meeting at upper chest height.',
      'Pause and contract clavicular pectorals before lowering slowly.'
    ],
    primaryContributions: [['m_chest_clavicular', 75, 'Upward adduction angle']],
    secondaryContributions: [
      ['m_deltoid_anterior', 20, 'Shoulder flexion synergy'],
      ['m_chest_sternal', 5, 'Sternal assistance']
    ],
    stabilizerContributions: [['m_core', 15, 'Core balance']]
  }));

  items.push(createExercise({
    id: 'ex_middle_cable_fly',
    name: 'Middle Cable Fly (Chest Level)',
    description: 'Horizontal cable fly matching mid-pectoral fibers with peak tension in contraction.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'chest',
    instructions: [
      'Set pulleys at chest level. Step forward into slight staggered stance.',
      'Hug arms inward in horizontal plane, squeezing chest tightly at midpoint.',
      'Control the eccentric stretch back to start.'
    ],
    primaryContributions: [['m_chest_sternal', 80, 'Sternal horizontal adduction']],
    secondaryContributions: [
      ['m_deltoid_anterior', 15, 'Shoulder flexion'],
      ['m_chest_clavicular', 5, 'Upper chest synergist']
    ],
    stabilizerContributions: [['m_core', 15, 'Standing trunk stabilization']]
  }));

  items.push(createExercise({
    id: 'ex_machine_chest_press',
    name: 'Machine Chest Press',
    description: 'Guided chest pressing allowing high mechanical tension with minimal balance demands.',
    equipment: 'machine',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'chest',
    instructions: [
      'Adjust seat so handles align with mid-chest. Plant feet flat.',
      'Press handles forward smoothly until elbows are nearly extended.',
      'Return slowly feeling loaded pectoral stretch.'
    ],
    primaryContributions: [['m_chest_sternal', 65, 'Direct horizontal pressing']],
    secondaryContributions: [
      ['m_triceps_lateral_head', 20, 'Triceps extension'],
      ['m_deltoid_anterior', 15, 'Anterior delt']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Machine guided stability']]
  }));

  items.push(createExercise({
    id: 'ex_incline_machine_chest_press',
    name: 'Incline Machine Chest Press',
    description: 'Converging incline machine press maximizing upper chest hypertrophy safely.',
    equipment: 'machine',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'chest',
    instructions: [
      'Adjust seat height so handles sit just below collarbone level.',
      'Press upward along machine track, squeezing upper chest at peak.',
      'Lower weights smoothly to starting depth.'
    ],
    primaryContributions: [['m_chest_clavicular', 70, 'Targeted upper chest path']],
    secondaryContributions: [
      ['m_deltoid_anterior', 15, 'Shoulder flexion'],
      ['m_triceps_lateral_head', 15, 'Triceps extension']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Guided track stabilization']]
  }));

  items.push(createExercise({
    id: 'ex_pec_deck_fly',
    name: 'Pec Deck Machine Fly',
    description: 'Pure chest isolation with fixed elbow position eliminating triceps involvement.',
    equipment: 'machine',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'chest',
    instructions: [
      'Adjust seat so arms are roughly horizontal to floor when gripping pads/handles.',
      'Pull arms together across chest with smooth squeeze.',
      'Allow weights to stretch chest slowly back without losing shoulder positioning.'
    ],
    primaryContributions: [['m_chest_sternal', 85, 'Pure horizontal adduction']],
    secondaryContributions: [
      ['m_deltoid_anterior', 15, 'Anterior deltoid']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Joint stability']]
  }));

  items.push(createExercise({
    id: 'ex_push_up',
    name: 'Push-Up',
    description: 'Bodyweight cornerstone building chest, anterior delts, triceps, and abdominal core.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'chest',
    instructions: [
      'Place hands slightly wider than shoulder-width, body in a rigid straight line plank.',
      'Lower chest until 1-2 inches off floor with elbows at 45-degree angle.',
      'Push the ground away to full elbow extension, protracting shoulders at top.'
    ],
    primaryContributions: [['m_chest_sternal', 60, 'Bodyweight horizontal press']],
    secondaryContributions: [
      ['m_triceps_lateral_head', 20, 'Elbow extension'],
      ['m_deltoid_anterior', 20, 'Shoulder flexion']
    ],
    stabilizerContributions: [
      ['m_rectus_abdominis', 20, 'Anti-extension core plank'],
      ['m_serratus_anterior', 15, 'Scapular protraction']
    ]
  }));

  items.push(createExercise({
    id: 'ex_incline_push_up',
    name: 'Incline Push-Up (Hands Elevated)',
    description: 'Elevated hands regression reducing load while maintaining movement pattern.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'chest',
    instructions: [
      'Place hands on sturdy bench or box. Keep body straight from head to heels.',
      'Lower chest to edge of bench and push back up smoothly.'
    ],
    primaryContributions: [['m_chest_costal', 55, 'Lower chest angle focus']],
    secondaryContributions: [
      ['m_chest_sternal', 20, 'Mid-chest assistance'],
      ['m_triceps_medial_head', 15, 'Triceps extension'],
      ['m_deltoid_anterior', 10, 'Front delt']
    ],
    stabilizerContributions: [['m_rectus_abdominis', 15, 'Core bracing']]
  }));

  items.push(createExercise({
    id: 'ex_decline_push_up',
    name: 'Decline Push-Up (Feet Elevated)',
    description: 'Elevated feet variation shifting body mass toward upper pectorals and shoulders.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'chest',
    instructions: [
      'Place feet on bench or box, hands on floor beneath shoulders.',
      'Lower chest toward floor maintaining tight core.',
      'Press back up to locked arms.'
    ],
    primaryContributions: [['m_chest_clavicular', 65, 'Upper chest emphasis']],
    secondaryContributions: [
      ['m_deltoid_anterior', 20, 'Increased vertical shoulder load'],
      ['m_triceps_lateral_head', 15, 'Lockout']
    ],
    stabilizerContributions: [['m_rectus_abdominis', 20, 'Core anti-extension']]
  }));

  items.push(createExercise({
    id: 'ex_weighted_push_up',
    name: 'Weighted Push-Up',
    description: 'Progressive overload push-up using weight vest or plate on upper back.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'chest',
    instructions: [
      'Position weight plate on upper back or wear weighted vest.',
      'Perform strict full range push-ups without sagging hips.'
    ],
    primaryContributions: [['m_chest_sternal', 60, 'Heavy bodyweight resistance']],
    secondaryContributions: [
      ['m_deltoid_anterior', 20, 'Anterior delt'],
      ['m_triceps_lateral_head', 20, 'Triceps extension']
    ],
    stabilizerContributions: [
      ['m_rectus_abdominis', 25, 'High core brace load'],
      ['m_serratus_anterior', 15, 'Scapular health']
    ]
  }));

  items.push(createExercise({
    id: 'ex_chest_dips',
    name: 'Chest Dips (Leaning Forward)',
    description: 'Bodyweight or weighted dip with forward torso lean to maximize lower chest recruitment.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'chest',
    instructions: [
      'Grip parallel bars, lean torso forward at roughly 30 degrees with knees bent.',
      'Lower body until elbows reach 90 degrees and chest feels a deep loaded stretch.',
      'Press upward through palms focusing on pectoral contraction rather than triceps.'
    ],
    primaryContributions: [['m_chest_costal', 65, 'Lower pectoral drive']],
    secondaryContributions: [
      ['m_triceps_long_head', 20, 'Triceps extension'],
      ['m_deltoid_anterior', 15, 'Shoulder extension / flexion']
    ],
    stabilizerContributions: [['m_rotator_cuff', 20, 'High glenohumeral stability demand']]
  }));

  items.push(createExercise({
    id: 'ex_smith_machine_bench_press',
    name: 'Smith Machine Bench Press',
    description: 'Fixed bar path pressing allowing complete focus on pectoral muscle fiber recruitment.',
    equipment: 'smith_machine',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'chest',
    instructions: [
      'Position flat bench so bar touches mid-chest on descent.',
      'Unlock bar, lower smoothly to light chest touch, and press to lockout.'
    ],
    primaryContributions: [['m_chest_sternal', 65, 'Pectoral adduction']],
    secondaryContributions: [
      ['m_triceps_lateral_head', 20, 'Triceps extension'],
      ['m_deltoid_anterior', 15, 'Front delt synergy']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Track stabilized']]
  }));

  items.push(createExercise({
    id: 'ex_smith_machine_incline_press',
    name: 'Smith Machine Incline Press',
    description: 'Incline angle on fixed bar path maximizing clavicular chest tension with safe failure.',
    equipment: 'smith_machine',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'chest',
    instructions: [
      'Set incline bench at 30 degrees directly under Smith bar.',
      'Lower bar to upper chest and drive upward with constant pectoral tension.'
    ],
    primaryContributions: [['m_chest_clavicular', 70, 'Clavicular pectorals']],
    secondaryContributions: [
      ['m_deltoid_anterior', 15, 'Front deltoid'],
      ['m_triceps_lateral_head', 15, 'Triceps extension']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Guided tracking']]
  }));

  items.push(createExercise({
    id: 'ex_neutral_grip_dumbbell_press',
    name: 'Neutral Grip Dumbbell Press',
    description: 'Dumbbell press with palms facing each other to spare shoulders and isolate sternal chest.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'chest',
    instructions: [
      'Lie flat holding dumbbells with neutral palms-in grip.',
      'Tuck elbows close to ribs on descent, press up while maintaining neutral wrists.'
    ],
    primaryContributions: [['m_chest_sternal', 60, 'Sternal chest adduction']],
    secondaryContributions: [
      ['m_triceps_medial_head', 25, 'Tucked elbow triceps load'],
      ['m_deltoid_anterior', 15, 'Anterior shoulder']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Shoulder joint friendly']]
  }));

  items.push(createExercise({
    id: 'ex_svend_press',
    name: 'Svend Press (Plate Squeeze Press)',
    description: 'Standing isometric pectoral squeeze press using weight plates.',
    equipment: 'barbell',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'chest',
    instructions: [
      'Stand tall sandwiching two small bumper or iron plates between your flat palms at chest height.',
      'Squeeze hands together as hard as possible, pressing plates straight forward until arms extend.',
      'Hold peak squeeze for 1-2 seconds, then return to chest.'
    ],
    primaryContributions: [['m_chest_sternal', 80, 'Peak isometric adduction']],
    secondaryContributions: [
      ['m_deltoid_anterior', 20, 'Horizontal arm support']
    ],
    stabilizerContributions: [['m_core', 15, 'Standing posture']]
  }));

  items.push(createExercise({
    id: 'ex_floor_press_barbell',
    name: 'Barbell Floor Press',
    description: 'Partial range pressing off the floor emphasizing triceps lockout and reducing shoulder extension.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'chest',
    instructions: [
      'Lie flat on floor with knees bent and feet flat under a rack.',
      'Unrack barbell and lower until triceps rest gently on floor without bouncing.',
      'Press powerfully upward to lockout.'
    ],
    primaryContributions: [['m_chest_sternal', 55, 'Upper range horizontal press']],
    secondaryContributions: [
      ['m_triceps_lateral_head', 30, 'Strong elbow lockout'],
      ['m_deltoid_anterior', 15, 'Front delt']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Shoulder protected by floor']]
  }));

  items.push(createExercise({
    id: 'ex_floor_press_dumbbell',
    name: 'Dumbbell Floor Press',
    description: 'Floor press using dumbbells to allow neutral or angled wrist variations.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'chest',
    instructions: [
      'Lie on floor with dumbbells at chest level. Press up to full extension.',
      'Lower until upper arms touch floor pause briefly, press up.'
    ],
    primaryContributions: [['m_chest_sternal', 55, 'Horizontal adduction']],
    secondaryContributions: [
      ['m_triceps_lateral_head', 30, 'Triceps extension'],
      ['m_deltoid_anterior', 15, 'Anterior delt']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Unilateral stabilization']]
  }));

  items.push(createExercise({
    id: 'ex_landmine_chest_press',
    name: 'Landmine Chest Press (Single-Arm)',
    description: 'Angular standing press following natural shoulder biomechanics with high upper chest stimulus.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'chest',
    instructions: [
      'Stand facing landmine station, hold end of barbell at shoulder with one hand in staggered stance.',
      'Press barbell forward and upward following the arc, squeezing upper chest at peak.',
      'Lower slowly under control.'
    ],
    primaryContributions: [['m_chest_clavicular', 60, 'Angled upward press']],
    secondaryContributions: [
      ['m_deltoid_anterior', 25, 'Anterior shoulder drive'],
      ['m_triceps_medial_head', 15, 'Lockout']
    ],
    stabilizerContributions: [
      ['m_obliques', 20, 'Anti-rotation core brace'],
      ['m_serratus_anterior', 15, 'Scapular upward rotation']
    ]
  }));

  items.push(createExercise({
    id: 'ex_single_arm_cable_chest_press',
    name: 'Single-Arm Cable Chest Press',
    description: 'Standing unilateral cable press delivering continuous resistance and anti-rotational core work.',
    equipment: 'cable',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'chest',
    instructions: [
      'Set cable at chest height. Take handle in one hand, step into staggered stance.',
      'Press straight forward without letting torso rotate.',
      'Return slowly under cable stretch.'
    ],
    primaryContributions: [['m_chest_sternal', 65, 'Unilateral pectoral adduction']],
    secondaryContributions: [
      ['m_deltoid_anterior', 20, 'Front delt'],
      ['m_triceps_lateral_head', 15, 'Triceps']
    ],
    stabilizerContributions: [['m_obliques', 25, 'Anti-rotation core stability']]
  }));

  items.push(createExercise({
    id: 'ex_seated_cable_crossover',
    name: 'Seated Cable Crossover',
    description: 'Seated variation eliminating momentum and core compensation for pure chest isolation.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'chest',
    instructions: [
      'Place upright bench between cable towers. Sit back and grasp handles.',
      'Adduct arms across chest in a smooth arc, pausing at peak squeeze.'
    ],
    primaryContributions: [['m_chest_sternal', 80, 'Strict seated adduction']],
    secondaryContributions: [
      ['m_deltoid_anterior', 15, 'Anterior delt'],
      ['m_chest_costal', 5, 'Lower fibers']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Shoulder tracking']]
  }));

  items.push(createExercise({
    id: 'ex_hammer_strength_flat_press',
    name: 'Hammer Strength Flat Press',
    description: 'Plate-loaded converging press mimicking dumbbell path with barbell load capacity.',
    equipment: 'machine',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'chest',
    instructions: [
      'Load plates on machine, adjust seat so handles align with lower/mid pectoral line.',
      'Drive handles outward and forward along converging path, squeeze chest hard.'
    ],
    primaryContributions: [['m_chest_sternal', 65, 'Converging horizontal drive']],
    secondaryContributions: [
      ['m_triceps_lateral_head', 20, 'Triceps'],
      ['m_deltoid_anterior', 15, 'Anterior shoulder']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Independent arm tracking']]
  }));

  items.push(createExercise({
    id: 'ex_hammer_strength_incline_press',
    name: 'Hammer Strength Incline Press',
    description: 'Converging plate-loaded machine isolating upper chest without rotator cuff strain.',
    equipment: 'machine',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'chest',
    instructions: [
      'Adjust seat so handles are at collarbone level.',
      'Press upward along diverging/converging path, control the descent.'
    ],
    primaryContributions: [['m_chest_clavicular', 70, 'Upper chest recruitment']],
    secondaryContributions: [
      ['m_deltoid_anterior', 15, 'Anterior delt'],
      ['m_triceps_lateral_head', 15, 'Triceps extension']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Machine stability']]
  }));

  return items;
}
