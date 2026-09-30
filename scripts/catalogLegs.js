import { createExercise } from './exerciseGenerator.js';

export function getLegsExerciseList() {
  const items = [];

  items.push(createExercise({
    id: 'ex_barbell_back_squat_high_bar',
    name: 'Barbell Back Squat (High Bar)',
    description: 'The king of quad builders, demanding knee flexion and deep ankle mobility with bar on traps.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'legs',
    videoUrl: 'https://www.youtube.com/embed/bEv6CCg2BC8',
    instructions: [
      'Rest barbell high across upper trapezius. Stand with feet slightly wider than shoulder-width, toes turned 15-30 degrees.',
      'Inhale deep into abdomen, break at hips and knees simultaneously.',
      'Descend until hip crease is below top of knees, keeping chest proud and knees tracking over toes.',
      'Drive powerfully out of the hole through mid-foot.'
    ],
    primaryContributions: [
      ['m_quadriceps', 60, 'Knee extension drive'],
      ['m_gluteus_maximus', 25, 'Hip extension out of hole']
    ],
    secondaryContributions: [
      ['m_adductor_magnus', 15, 'Medial hip stabilization & extension']
    ],
    stabilizerContributions: [
      ['m_erector_spinae', 25, 'Torso angle support'],
      ['m_core', 20, 'Intra-abdominal pressure'],
      ['m_calves_soleus', 10, 'Ankle dorsiflexion control']
    ]
  }));

  items.push(createExercise({
    id: 'ex_barbell_back_squat_low_bar',
    name: 'Barbell Back Squat (Low Bar)',
    description: 'Powerlifting squat style resting bar across rear delts to recruit maximum posterior chain power.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'legs',
    instructions: [
      'Rest bar across rear delts/scapular spine. Lean torso forward slightly more than high bar.',
      'Sit back into hips, descend to parallel, drive up leading with hips.'
    ],
    primaryContributions: [
      ['m_quadriceps', 45, 'Knee extension'],
      ['m_gluteus_maximus', 35, 'Hip extension']
    ],
    secondaryContributions: [
      ['m_hamstrings', 10, 'Posterior chain synergy'],
      ['m_adductor_magnus', 10, 'Adductor drive']
    ],
    stabilizerContributions: [
      ['m_erector_spinae', 30, 'Forward torso brace'],
      ['m_core', 20, 'Abdominal pressure']
    ]
  }));

  items.push(createExercise({
    id: 'ex_front_squat_barbell',
    name: 'Barbell Front Squat',
    description: 'Bar resting on anterior deltoids forcing an upright torso and extreme quadriceps focus.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'legs',
    instructions: [
      'Rest bar across clavicles and front delts in clean grip or cross-arm grip with elbows driven high.',
      'Descend straight down between knees keeping torso vertical.',
      'Drive out of hole without dropping elbows.'
    ],
    primaryContributions: [
      ['m_quadriceps', 75, 'Maximum knee extension recruitment']
    ],
    secondaryContributions: [
      ['m_gluteus_maximus', 15, 'Hip extension'],
      ['m_rectus_abdominis', 10, 'Thoracic extension synergy']
    ],
    stabilizerContributions: [
      ['m_erector_spinae', 30, 'Thoracic spine support'],
      ['m_transverse_abdominis', 25, 'Anti-flexion core brace']
    ]
  }));

  items.push(createExercise({
    id: 'ex_zercher_squat',
    name: 'Zercher Squat (Bar in Crooks of Elbows)',
    description: 'Bar cradled in the crooks of elbows, building unbreakable core strength and quad drive.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'legs',
    instructions: [
      'Cradle barbell in crooks of elbows against chest with hands clasped.',
      'Squat deep between knees keeping upright posture, drive up forcefully.'
    ],
    primaryContributions: [
      ['m_quadriceps', 65, 'Knee extension'],
      ['m_gluteus_maximus', 20, 'Hip extension']
    ],
    secondaryContributions: [
      ['m_rectus_abdominis', 15, 'Heavy anterior load resistance']
    ],
    stabilizerContributions: [
      ['m_biceps_short_head', 20, 'Isometric bar cradle'],
      ['m_trapezius_upper', 20, 'Upper back brace']
    ]
  }));

  items.push(createExercise({
    id: 'ex_safety_bar_squat',
    name: 'Safety Bar Squat (SSB)',
    description: 'Yoke bar sparing shoulders and wrists while maintaining upright quad-heavy mechanics.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'legs',
    instructions: [
      'Grip handles of Safety Squat Bar resting on shoulders.',
      'Squat under control, resisting bar\'s tendency to pitch torso forward.'
    ],
    primaryContributions: [
      ['m_quadriceps', 65, 'Quads'],
      ['m_gluteus_maximus', 20, 'Glutes']
    ],
    secondaryContributions: [
      ['m_adductor_magnus', 15, 'Adductors']
    ],
    stabilizerContributions: [['m_trapezius_upper', 25, 'Thoracic erector overload']]
  }));

  items.push(createExercise({
    id: 'ex_hack_squat_machine',
    name: 'Hack Squat (Machine)',
    description: 'Supported back sled eliminating spinal balance, allowing complete quadriceps failure safely.',
    equipment: 'machine',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Position back flat against pad, shoulders under shoulder pads. Feet shoulder-width on platform.',
      'Release safety handles, descend until knees achieve deep flexion (below 90 degrees).',
      'Press platform away driving through mid-foot.'
    ],
    primaryContributions: [
      ['m_quadriceps', 80, 'Pure knee extension overload']
    ],
    secondaryContributions: [
      ['m_gluteus_maximus', 20, 'Hip extension assist']
    ],
    stabilizerContributions: [['m_adductor_magnus', 10, 'Knee tracking']]
  }));

  items.push(createExercise({
    id: 'ex_leg_press_45_degree',
    name: '45-Degree Leg Press',
    description: 'Heavy plate-loaded leg press allowing immense quadriceps and glute loading with fixed spine.',
    equipment: 'machine',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Sit firmly in seat with lower back pinned against pad. Place feet shoulder-width on sled.',
      'Lower sled until knees reach 90 degrees without rounding lower back off pad.',
      'Press sled back up without hyperextending or locking knees.'
    ],
    primaryContributions: [
      ['m_quadriceps', 70, 'Quadriceps drive'],
      ['m_gluteus_maximus', 20, 'Glute assistance']
    ],
    secondaryContributions: [
      ['m_adductor_magnus', 10, 'Adductors']
    ],
    stabilizerContributions: [['m_calves_gastrocnemius', 10, 'Ankle drive']]
  }));

  items.push(createExercise({
    id: 'ex_dumbbell_walking_lunge',
    name: 'Dumbbell Walking Lunge',
    description: 'Dynamic unilateral leg builder testing single-leg strength, balance, and glute-quad coordination.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'legs',
    instructions: [
      'Hold dumbbells at sides. Step forward into lunge, lowering back knee until hovering above floor.',
      'Drive through front heel to step directly forward into next lunge stride.'
    ],
    primaryContributions: [
      ['m_quadriceps', 50, 'Front leg knee extension'],
      ['m_gluteus_maximus', 35, 'Hip extension propulsion']
    ],
    secondaryContributions: [
      ['m_hamstrings', 15, 'Deceleration synergy']
    ],
    stabilizerContributions: [
      ['m_gluteus_medius', 25, 'Single-leg pelvic stabilization'],
      ['m_core', 15, 'Upright balance']
    ]
  }));

  items.push(createExercise({
    id: 'ex_reverse_lunge_dumbbell',
    name: 'Dumbbell Reverse Lunge',
    description: 'Knee-friendly lunge variation stepping backward to preserve patellar tendon comfort.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Step backward with one leg, lower hips until front thigh is parallel to floor.',
      'Drive through front heel to return to standing.'
    ],
    primaryContributions: [
      ['m_quadriceps', 50, 'Quads'],
      ['m_gluteus_maximus', 35, 'Glutes']
    ],
    secondaryContributions: [
      ['m_hamstrings', 15, 'Hamstrings']
    ],
    stabilizerContributions: [['m_gluteus_medius', 20, 'Pelvic balance']]
  }));

  items.push(createExercise({
    id: 'ex_bulgarian_split_squat',
    name: 'Bulgarian Split Squat (Rear-Foot Elevated)',
    description: 'The premier single-leg exercise placing devastating hypertrophy stimulus on quads and glutes.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'legs',
    instructions: [
      'Rest laces of back foot on bench behind you. Front foot planted 2-3 feet in front.',
      'Descend until back knee nearly touches floor, front knee bent 90 degrees.',
      'Drive up through front heel to return to top.'
    ],
    primaryContributions: [
      ['m_quadriceps', 55, 'Front leg quad driver'],
      ['m_gluteus_maximus', 35, 'Deep hip extension']
    ],
    secondaryContributions: [
      ['m_adductor_magnus', 10, 'Hip stabilization']
    ],
    stabilizerContributions: [
      ['m_gluteus_medius', 25, 'Unilateral hip balance'],
      ['m_core', 15, 'Trunk stability']
    ]
  }));

  items.push(createExercise({
    id: 'ex_goblet_squat',
    name: 'Goblet Squat (Dumbbell or Kettlebell)',
    description: 'Accessible squat teaching perfect upright posture and deep hip mobility.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Hold dumbbell vertically against chest with elbows pointing down.',
      'Squat deep between knees, pushing knees out, drive up through heels.'
    ],
    primaryContributions: [
      ['m_quadriceps', 65, 'Knee extension'],
      ['m_gluteus_maximus', 25, 'Hip extension']
    ],
    secondaryContributions: [
      ['m_adductor_magnus', 10, 'Adductors']
    ],
    stabilizerContributions: [['m_core', 20, 'Anterior core brace']]
  }));

  items.push(createExercise({
    id: 'ex_sissy_squat_bodyweight',
    name: 'Sissy Squat (Bodyweight / Bench)',
    description: 'Extreme knee flexion isolation movement providing loaded stretch across the rectus femoris.',
    equipment: 'bodyweight',
    movementType: 'isolation',
    difficulty: 'advanced',
    targetRegionId: 'legs',
    instructions: [
      'Lock shins into sissy squat bench or hold sturdy post.',
      'Lean torso back while driving knees forward to achieve complete quad stretch, press up.'
    ],
    primaryContributions: [
      ['m_quadriceps', 95, 'Pure rectus femoris & knee extension stretch']
    ],
    secondaryContributions: [
      ['m_rectus_abdominis', 5, 'Torso anti-extension']
    ],
    stabilizerContributions: [['m_tibialis_anterior', 15, 'Ankle lock']]
  }));

  items.push(createExercise({
    id: 'ex_leg_extension_machine',
    name: 'Leg Extension (Machine)',
    description: 'Open-chain knee extension isolating the rectus femoris and vastus muscles in peak contraction.',
    equipment: 'machine',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Adjust back pad so knees align with machine pivot. Pad resting on lower shins.',
      'Extend knees until legs are straight, squeezing quads hard for 1 second at top.',
      'Lower weight under control to 90 degrees.'
    ],
    primaryContributions: [
      ['m_quadriceps', 100, 'Pure isolated quadriceps knee extension']
    ],
    secondaryContributions: [],
    stabilizerContributions: []
  }));

  // --- HAMSTRINGS ---
  items.push(createExercise({
    id: 'ex_romanian_deadlift_barbell',
    name: 'Barbell Romanian Deadlift (RDL)',
    description: 'Gold standard posterior chain builder focusing on loaded eccentric stretch of the hamstrings.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'legs',
    videoUrl: 'https://www.youtube.com/embed/2SHsk9AzdjA',
    instructions: [
      'Stand tall holding barbell with overhand grip, knees slightly unlocked (soft).',
      'Push hips backward as far as possible while keeping bar brushing down thighs.',
      'Lower until deep stretch is felt in hamstrings (mid-shin level), keeping back flat.',
      'Drive hips forward to return to standing.'
    ],
    primaryContributions: [
      ['m_hamstrings', 60, 'Hamstring eccentric loaded stretch'],
      ['m_gluteus_maximus', 30, 'Hip extension power']
    ],
    secondaryContributions: [
      ['m_erector_spinae', 10, 'Isometric back brace']
    ],
    stabilizerContributions: [
      ['m_latissimus_dorsi', 20, 'Keeping bar close'],
      ['m_forearms', 20, 'Grip']
    ]
  }));

  items.push(createExercise({
    id: 'ex_romanian_deadlift_dumbbell',
    name: 'Dumbbell Romanian Deadlift',
    description: 'Dumbbell variation allowing dumbbells to track beside legs for lower back comfort.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Hold dumbbells in front of thighs, hinge hips back until deep hamstring stretch, drive forward.'
    ],
    primaryContributions: [
      ['m_hamstrings', 60, 'Hamstrings'],
      ['m_gluteus_maximus', 30, 'Glutes']
    ],
    secondaryContributions: [
      ['m_erector_spinae', 10, 'Spinal support']
    ],
    stabilizerContributions: [['m_core', 15, 'Core brace']]
  }));

  items.push(createExercise({
    id: 'ex_stiff_legged_deadlift',
    name: 'Stiff-Legged Deadlift (From Floor)',
    description: 'Starting from the floor with higher hips to maximize hamstring and lower back range.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'legs',
    instructions: [
      'Set up with knees almost straight, hips elevated high. Pull bar off floor using pure posterior chain.'
    ],
    primaryContributions: [
      ['m_hamstrings', 65, 'Long-lever hamstring pull'],
      ['m_erector_spinae', 25, 'Spinal erectors']
    ],
    secondaryContributions: [
      ['m_gluteus_maximus', 10, 'Glutes']
    ],
    stabilizerContributions: [['m_forearms', 20, 'Grip']]
  }));

  items.push(createExercise({
    id: 'ex_lying_leg_curl_machine',
    name: 'Lying Leg Curl (Machine)',
    description: 'Isolates the knee flexion function of the hamstrings across both heads.',
    equipment: 'machine',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Lie face down on machine with pad against lower calves/Achilles tendon.',
      'Curl heels toward glutes without lifting hips off pad.',
      'Hold peak squeeze for 1 second, lower smoothly over 3 seconds.'
    ],
    primaryContributions: [
      ['m_hamstrings', 85, 'Direct knee flexion isolation']
    ],
    secondaryContributions: [
      ['m_calves_gastrocnemius', 15, 'Gastrocnemius knee flexion assist']
    ],
    stabilizerContributions: [['m_gluteus_maximus', 10, 'Hip stabilization against pad']]
  }));

  items.push(createExercise({
    id: 'ex_seated_leg_curl_machine',
    name: 'Seated Leg Curl (Machine)',
    description: 'Places hip in 90 degrees flexion, lengthening hamstrings for superior muscle hypertrophy.',
    equipment: 'machine',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Sit firmly with thigh pad locked down tight. Pad resting on lower calves.',
      'Curl heels down and back under seat to full contraction.',
      'Control the eccentric return feeling deep hamstring stretch.'
    ],
    primaryContributions: [
      ['m_hamstrings', 90, 'Lengthened state hamstring knee flexion']
    ],
    secondaryContributions: [
      ['m_calves_gastrocnemius', 10, 'Calf assist']
    ],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_standing_single_leg_curl',
    name: 'Standing Single-Leg Curl',
    description: 'Unilateral machine curl evening out hamstring strength disparities between limbs.',
    equipment: 'machine',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Brace torso against pad, curl single heel up toward glute with smooth squeeze.'
    ],
    primaryContributions: [
      ['m_hamstrings', 90, 'Unilateral knee flexion']
    ],
    secondaryContributions: [
      ['m_calves_gastrocnemius', 10, 'Calves']
    ],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_nordic_hamstring_curl',
    name: 'Nordic Hamstring Curl',
    description: 'Bodyweight eccentric powerhouse proven to maximize hamstring hypertrophy and injury prevention.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'legs',
    instructions: [
      'Kneel on pad with ankles anchored firmly behind you. Keep hips fully extended in a line.',
      'Slowly lower body forward toward floor, resisting gravity purely with hamstrings.',
      'Catch yourself with hands on floor, push lightly back up.'
    ],
    primaryContributions: [
      ['m_hamstrings', 85, 'Extreme eccentric knee flexion load']
    ],
    secondaryContributions: [
      ['m_gluteus_maximus', 10, 'Hip extension lockout'],
      ['m_calves_gastrocnemius', 5, 'Knee flexion assistance']
    ],
    stabilizerContributions: [
      ['m_rectus_abdominis', 20, 'Torso alignment'],
      ['m_erector_spinae', 15, 'Spine lock']
    ]
  }));

  items.push(createExercise({
    id: 'ex_glute_ham_raise_ghr',
    name: 'Glute-Ham Raise (GHR)',
    description: 'Integrates both knee flexion and hip extension functions of the posterior chain simultaneously.',
    equipment: 'machine',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'legs',
    instructions: [
      'Mount GHR bench with feet locked between rollers and knees on curved pad.',
      'Lower torso forward to horizontal, then bend knees pulling body back upright.'
    ],
    primaryContributions: [
      ['m_hamstrings', 60, 'Combined hip & knee flexion power'],
      ['m_gluteus_maximus', 30, 'Hip extension']
    ],
    secondaryContributions: [
      ['m_erector_spinae', 10, 'Back brace']
    ],
    stabilizerContributions: [['m_calves_gastrocnemius', 15, 'Calf anchoring']]
  }));

  items.push(createExercise({
    id: 'ex_step_up_dumbbell',
    name: 'Dumbbell Step-Up',
    description: 'Functional single-leg drive onto box building unilateral quad power and glute drive.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Hold dumbbells at sides facing sturdy box or bench.',
      'Place entire foot on box, drive through heel to stand tall on top without bouncing off trailing foot.',
      'Lower back down under control.'
    ],
    primaryContributions: [
      ['m_quadriceps', 55, 'Front leg knee extension'],
      ['m_gluteus_maximus', 35, 'Hip extension']
    ],
    secondaryContributions: [
      ['m_hamstrings', 10, 'Hamstrings']
    ],
    stabilizerContributions: [['m_gluteus_medius', 20, 'Pelvic balance']]
  }));

  items.push(createExercise({
    id: 'ex_box_squat_barbell',
    name: 'Barbell Box Squat',
    description: 'Squatting to a box breaks the stretch-shortening cycle to build explosive hip drive.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'legs',
    instructions: [
      'Squat back until sitting gently on box without rocking. Pause, explode upward through heels.'
    ],
    primaryContributions: [
      ['m_quadriceps', 50, 'Quads'],
      ['m_gluteus_maximus', 35, 'Glutes']
    ],
    secondaryContributions: [
      ['m_hamstrings', 15, 'Hamstrings']
    ],
    stabilizerContributions: [['m_erector_spinae', 20, 'Spinal brace']]
  }));

  items.push(createExercise({
    id: 'ex_standing_calf_raise_machine',
    name: 'Standing Calf Raise (Machine)',
    description: 'Full knee extension calf raise maximizing tension on the gastrocnemius.',
    equipment: 'machine',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Place balls of feet on block, shoulders under pads, knees locked straight.',
      'Lower heels into deep calf stretch, explode upward onto big toes.',
      'Hold peak calf contraction for 2 seconds before descending.'
    ],
    primaryContributions: [
      ['m_calves_gastrocnemius', 75, 'Straight-knee gastrocnemius recruitment'],
      ['m_calves_soleus', 25, 'Soleus plantarflexion']
    ],
    secondaryContributions: [],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_seated_calf_raise_machine',
    name: 'Seated Calf Raise (Machine)',
    description: 'Bent knee position slacks the gastrocnemius, isolating the deep soleus muscle.',
    equipment: 'machine',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Sit with knees under pad bent at 90 degrees. Balls of feet on block.',
      'Lower heels to full ankle stretch, drive upward onto toes, pause.'
    ],
    primaryContributions: [
      ['m_calves_soleus', 85, 'Direct soleus isolation (bent knee)'],
      ['m_calves_gastrocnemius', 15, 'Minor gastrocnemius assist']
    ],
    secondaryContributions: [],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_leg_press_calf_raise',
    name: 'Leg Press Calf Raise (Toe Press)',
    description: 'Straight-leg calf extension on leg press sled allowing heavy, safe progressive overload.',
    equipment: 'machine',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Place balls of feet on lower edge of leg press platform with heels hanging free.',
      'Press sled forward through ankle extension, lower under deep stretch.'
    ],
    primaryContributions: [
      ['m_calves_gastrocnemius', 75, 'Gastrocnemius'],
      ['m_calves_soleus', 25, 'Soleus']
    ],
    secondaryContributions: [],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_donkey_calf_raise',
    name: 'Donkey Calf Raise',
    description: 'Bent-over hip angle prestretches the hamstrings and gastrocnemius for peak calf activation.',
    equipment: 'machine',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'legs',
    instructions: [
      'Bend forward at hips resting weight pad across sacrum. Raise heels high, lower to stretch.'
    ],
    primaryContributions: [
      ['m_calves_gastrocnemius', 80, 'Gastrocnemius peak recruitment'],
      ['m_calves_soleus', 20, 'Soleus']
    ],
    secondaryContributions: [],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_single_leg_dumbbell_calf_raise',
    name: 'Single-Leg Dumbbell Calf Raise',
    description: 'Unilateral standing calf raise fixing left-to-right ankle strength imbalances.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Stand on one foot on step holding dumbbell in same-side hand.',
      'Drop heel into deep stretch, drive up high on big toe.'
    ],
    primaryContributions: [
      ['m_calves_gastrocnemius', 75, 'Unilateral gastrocnemius'],
      ['m_calves_soleus', 25, 'Soleus']
    ],
    secondaryContributions: [],
    stabilizerContributions: [['m_tibialis_anterior', 10, 'Ankle balance']]
  }));

  items.push(createExercise({
    id: 'ex_tibialis_anterior_raise_wall',
    name: 'Tibialis Anterior Raise (Wall Lean)',
    description: 'Crucial shin muscle strengthener protecting knees and improving ankle dorsiflexion.',
    equipment: 'bodyweight',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Lean upper back against wall with legs extended in front.',
      'Flex toes upward toward shins as high as possible, hold 1 second, lower slowly.'
    ],
    primaryContributions: [
      ['m_tibialis_anterior', 100, 'Pure ankle dorsiflexion']
    ],
    secondaryContributions: [],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_tibialis_anterior_cable_pull',
    name: 'Tibialis Anterior Cable Pull',
    description: 'Weighted ankle dorsiflexion using ankle strap and low pulley cable.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'legs',
    instructions: [
      'Sit on bench facing low pulley with strap attached around forefoot.',
      'Pull toes back toward knee against cable resistance.'
    ],
    primaryContributions: [
      ['m_tibialis_anterior', 100, 'Loaded shin dorsiflexion']
    ],
    secondaryContributions: [],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_smith_machine_squat',
    name: 'Smith Machine Squat (Feet Forward)',
    description: 'Placing feet forward reduces lower back shear and places massive focus on the quads.',
    equipment: 'smith_machine',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Step feet 12-18 inches in front of bar. Descend deep into upright quad squat, press up.'
    ],
    primaryContributions: [
      ['m_quadriceps', 75, 'Quadriceps focus'],
      ['m_gluteus_maximus', 25, 'Glutes']
    ],
    secondaryContributions: [],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_smith_machine_calf_raise',
    name: 'Smith Machine Standing Calf Raise',
    description: 'Allows heavy standing calf training on wooden block with built-in safety catches.',
    equipment: 'smith_machine',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'legs',
    instructions: [
      'Place calf block under bar. Unhook bar on upper traps, raise heels high onto toes.'
    ],
    primaryContributions: [
      ['m_calves_gastrocnemius', 75, 'Calves'],
      ['m_calves_soleus', 25, 'Soleus']
    ],
    secondaryContributions: [],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_deficit_romanian_deadlift',
    name: 'Deficit Romanian Deadlift (Standing on Plate)',
    description: 'Standing on 2-inch plate for extreme hamstring loaded stretch at bottom of hinge.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'legs',
    instructions: [
      'Stand on 2-inch platform or bumper plate. Hinge deeply past toe level feeling intense hamstring stretch.'
    ],
    primaryContributions: [
      ['m_hamstrings', 65, 'Extended range hamstring stretch'],
      ['m_gluteus_maximus', 25, 'Glutes']
    ],
    secondaryContributions: [
      ['m_erector_spinae', 10, 'Lower back']
    ],
    stabilizerContributions: [['m_core', 15, 'Core brace']]
  }));

  items.push(createExercise({
    id: 'ex_overhead_squat_barbell',
    name: 'Overhead Squat (Barbell)',
    description: 'Olympic lifting test of full-body mobility, balance, thoracic extension, and leg drive.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'legs',
    instructions: [
      'Snatch or press bar wide overhead. Squat deep keeping bar directly over mid-foot with locked elbows.'
    ],
    primaryContributions: [
      ['m_quadriceps', 50, 'Deep knee flexion'],
      ['m_gluteus_maximus', 25, 'Hip extension']
    ],
    secondaryContributions: [
      ['m_trapezius_upper', 15, 'Overhead active trap lock'],
      ['m_core', 10, 'Torso stabilization']
    ],
    stabilizerContributions: [
      ['m_rotator_cuff', 25, 'Shoulder lock'],
      ['m_erector_spinae', 25, 'Thoracic extension']
    ]
  }));

  items.push(createExercise({
    id: 'ex_good_morning_safety_bar',
    name: 'Safety Bar Good Morning',
    description: 'Hinge exercise with SSB bar targeting the hamstrings and spinal erectors comfortably.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'legs',
    instructions: [
      'Hinge hips backward with soft knees, feeling deep hamstring stretch before driving upright.'
    ],
    primaryContributions: [
      ['m_hamstrings', 60, 'Hamstrings'],
      ['m_erector_spinae', 30, 'Spinal erectors']
    ],
    secondaryContributions: [
      ['m_gluteus_maximus', 10, 'Glutes']
    ],
    stabilizerContributions: [['m_core', 15, 'Abdominal pressure']]
  }));

  return items;
}
