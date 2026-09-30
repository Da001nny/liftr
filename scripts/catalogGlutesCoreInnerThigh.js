import { createExercise } from './exerciseGenerator.js';

export function getGlutesCoreInnerThighExerciseList() {
  const items = [];

  // =========================================================================
  // 6. GLUTES (18 exercises)
  // =========================================================================
  items.push(createExercise({
    id: 'ex_barbell_hip_thrust',
    name: 'Barbell Hip Thrust',
    description: 'The premier glute hypertrophy exercise delivering peak horizontal tension at full hip extension.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'glutes',
    videoUrl: 'https://www.youtube.com/embed/SEdqd1n0cvg',
    instructions: [
      'Sit on floor with upper back against bench, loaded barbell over hips (with thick pad).',
      'Plant feet hip-width with shins vertical at top of movement.',
      'Drive through heels, extending hips until thighs and torso form a straight horizontal line.',
      'Posteriorly tilt pelvis and squeeze glutes hard at top for 1-2 seconds, lower slowly.'
    ],
    primaryContributions: [
      ['m_gluteus_maximus', 80, 'Peak hip extension in shortened position'],
      ['m_gluteus_medius', 10, 'Femoral external rotation & abduction']
    ],
    secondaryContributions: [
      ['m_hamstrings', 10, 'Hamstring hip extension synergy']
    ],
    stabilizerContributions: [
      ['m_core', 20, 'Pelvic tilt control & bracing'],
      ['m_adductor_magnus', 15, 'Medial hip tracking']
    ]
  }));

  items.push(createExercise({
    id: 'ex_single_leg_hip_thrust',
    name: 'Single-Leg Hip Thrust (Bodyweight or Dumbbell)',
    description: 'Unilateral hip thrust eliminating glute strength discrepancies and challenging pelvic stability.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'glutes',
    instructions: [
      'Upper back on bench, lift one foot off floor with 90-degree knee bend.',
      'Drive working heel into floor to raise hips to full extension, squeeze glute at top.'
    ],
    primaryContributions: [
      ['m_gluteus_maximus', 75, 'Unilateral glute drive'],
      ['m_gluteus_medius', 15, 'High pelvic stability demand']
    ],
    secondaryContributions: [
      ['m_hamstrings', 10, 'Hamstring synergy']
    ],
    stabilizerContributions: [['m_core', 20, 'Anti-rotation core']]
  }));

  items.push(createExercise({
    id: 'ex_kas_glute_bridge',
    name: 'Kas Glute Bridge (Slow Tempo / Upper Range)',
    description: 'Targeted glute movement using a smaller range of motion to keep tension strictly on the glute max.',
    equipment: 'barbell',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'glutes',
    instructions: [
      'Position back on bench as in hip thrust. Move purely at the hip joint without bending knees forward.',
      'Descend only halfway, drive up and squeeze glutes for 2 seconds at peak.'
    ],
    primaryContributions: [
      ['m_gluteus_maximus', 90, 'Constant tension upper range glute isolation'],
      ['m_gluteus_medius', 10, 'External rotation']
    ],
    secondaryContributions: [],
    stabilizerContributions: [['m_core', 15, 'Pelvic control']]
  }));

  items.push(createExercise({
    id: 'ex_dumbbell_glute_bridge',
    name: 'Dumbbell Glute Bridge (Floor)',
    description: 'Floor-based glute bridge with dumbbell resting across pelvis, friendly for all fitness levels.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'glutes',
    instructions: [
      'Lie flat on back with knees bent, feet flat on floor. Hold dumbbell over hips.',
      'Drive heels down to bridge hips upward until straight line from knees to shoulders.'
    ],
    primaryContributions: [
      ['m_gluteus_maximus', 85, 'Glute extension']
    ],
    secondaryContributions: [
      ['m_hamstrings', 15, 'Hamstring assist']
    ],
    stabilizerContributions: [['m_core', 10, 'Core brace']]
  }));

  items.push(createExercise({
    id: 'ex_cable_glute_kickback',
    name: 'Cable Glute Kickback (Straight Leg or Bent)',
    description: 'Isolated hip extension using ankle cuff to deliver peak glute contraction.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'glutes',
    instructions: [
      'Attach ankle strap to low cable. Face machine, hinge slightly at hips holding pole.',
      'Kick working leg straight backward, squeezing glute at top without arching lower back.'
    ],
    primaryContributions: [
      ['m_gluteus_maximus', 85, 'Isolated hip extension']
    ],
    secondaryContributions: [
      ['m_gluteus_medius', 10, 'Abduction synergy'],
      ['m_hamstrings', 5, 'Hamstrings']
    ],
    stabilizerContributions: [['m_gluteus_medius', 20, 'Standing leg stability']]
  }));

  items.push(createExercise({
    id: 'ex_machine_glute_kickback',
    name: 'Machine Glute Kickback',
    description: 'Guided track plate or pin-loaded kickback isolating glutes with fixed torso support.',
    equipment: 'machine',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'glutes',
    instructions: [
      'Place working foot on footplate, chest against pad. Drive leg backward and upward.'
    ],
    primaryContributions: [
      ['m_gluteus_maximus', 90, 'Machine guided glute max']
    ],
    secondaryContributions: [
      ['m_hamstrings', 10, 'Hamstrings']
    ],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_hyperextension_glute_focus',
    name: '45-Degree Hyperextension (Glute Biased)',
    description: 'Feet flared 45 degrees and spine rounded to turn back extension into a pure glute builder.',
    equipment: 'bodyweight',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'glutes',
    instructions: [
      'Set pad below hip crease. Turn toes out 45 degrees, round upper back (slight hunch).',
      'Hinge forward, then extend hips by driving hips into pad and squeezing glutes tightly.'
    ],
    primaryContributions: [
      ['m_gluteus_maximus', 80, 'Glute max extension with round back']
    ],
    secondaryContributions: [
      ['m_hamstrings', 20, 'Hamstring synergy']
    ],
    stabilizerContributions: [['m_adductor_magnus', 10, 'Hip stability']]
  }));

  items.push(createExercise({
    id: 'ex_cable_pull_through',
    name: 'Cable Pull-Through',
    description: 'Teaches powerful hip hinge mechanics with horizontal cable resistance loading the glutes.',
    equipment: 'cable',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'glutes',
    instructions: [
      'Attach rope to low pulley. Face away from cable with rope between legs.',
      'Hinge hips back feeling glute/hamstring stretch, snap hips forward to standing lockout.'
    ],
    primaryContributions: [
      ['m_gluteus_maximus', 65, 'Horizontal hip extension'],
      ['m_hamstrings', 25, 'Hamstring hinge']
    ],
    secondaryContributions: [
      ['m_erector_spinae', 10, 'Spinal support']
    ],
    stabilizerContributions: [['m_core', 15, 'Core brace']]
  }));

  items.push(createExercise({
    id: 'ex_frog_pumps',
    name: 'Frog Pumps (Glute Burnout)',
    description: 'Soles of feet together in butterfly position, removing hamstring involvement for glutes.',
    equipment: 'bodyweight',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'glutes',
    instructions: [
      'Lie on floor with soles of feet pressed together and knees flared wide.',
      'Bridge hips up rapidly, squeezing glutes tightly at top for high repetitions.'
    ],
    primaryContributions: [
      ['m_gluteus_maximus', 80, 'Glute max in external rotation'],
      ['m_gluteus_medius', 20, 'Abduction holding knees apart']
    ],
    secondaryContributions: [],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_curtsy_lunge',
    name: 'Curtsy Lunge (Dumbbell)',
    description: 'Crossing leg behind torso to place deep loaded stretch on the gluteus medius and maximus.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'glutes',
    instructions: [
      'Step one leg back and across behind front leg as if curtsying.',
      'Lower hips until front thigh is parallel, push through front heel to stand.'
    ],
    primaryContributions: [
      ['m_gluteus_maximus', 50, 'Glute max extension'],
      ['m_gluteus_medius', 35, 'Loaded lateral hip stabilization']
    ],
    secondaryContributions: [
      ['m_quadriceps', 15, 'Quad drive']
    ],
    stabilizerContributions: [['m_adductor_magnus', 15, 'Inner thigh balance']]
  }));

  items.push(createExercise({
    id: 'ex_b_stance_romanian_deadlift',
    name: 'B-Stance Romanian Deadlift (Kickstand RDL)',
    description: 'Kickstand single-leg RDL offering stability of two legs with unilateral glute bias.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'glutes',
    instructions: [
      'Front foot flat, back foot resting on toes 10 inches behind for kickstand balance.',
      'Hinge hips back loaded onto front glute, drive hip forward to stand.'
    ],
    primaryContributions: [
      ['m_gluteus_maximus', 55, 'Targeted glute hinge'],
      ['m_hamstrings', 35, 'Hamstring stretch']
    ],
    secondaryContributions: [
      ['m_gluteus_medius', 10, 'Hip stabilization']
    ],
    stabilizerContributions: [['m_core', 15, 'Anti-rotation core']]
  }));

  items.push(createExercise({
    id: 'ex_step_up_glute_biased',
    name: 'Glute-Biased Step-Up (Slow Eccentric)',
    description: 'Leaning torso forward over working thigh on box to maximize glute hip extension.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'glutes',
    instructions: [
      'Place foot on box at knee height. Lean torso forward over thigh.',
      'Drive straight up through heel without pushing off trailing toes, lower slowly over 3 seconds.'
    ],
    primaryContributions: [
      ['m_gluteus_maximus', 65, 'High hip extension angle'],
      ['m_quadriceps', 25, 'Knee extension assist']
    ],
    secondaryContributions: [
      ['m_hamstrings', 10, 'Hamstrings']
    ],
    stabilizerContributions: [['m_gluteus_medius', 25, 'Unilateral balance']]
  }));

  items.push(createExercise({
    id: 'ex_lateral_band_walk',
    name: 'Lateral Band Walk (Monster Walk)',
    description: 'Resistance band around ankles or knees activating the gluteus medius and hip abductors.',
    equipment: 'band',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'glutes',
    instructions: [
      'Loop mini-band around ankles, soften knees into quarter squat.',
      'Step laterally keeping toes forward and tension continuously on band.'
    ],
    primaryContributions: [
      ['m_gluteus_medius', 75, 'Direct hip abduction'],
      ['m_gluteus_minimus', 15, 'Deep abductor']
    ],
    secondaryContributions: [
      ['m_gluteus_maximus', 10, 'External rotation support']
    ],
    stabilizerContributions: [['m_core', 10, 'Athletic posture']]
  }));

  items.push(createExercise({
    id: 'ex_clamshell_banded',
    name: 'Banded Clamshell',
    description: 'Sidelying hip external rotation isolating the gluteus medius and deep hip rotators.',
    equipment: 'band',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'glutes',
    instructions: [
      'Lie on side with hips and knees at 45 degrees, band around knees, feet touching.',
      'Open top knee toward ceiling without rolling hips backward.'
    ],
    primaryContributions: [
      ['m_gluteus_medius', 80, 'Hip external rotation and abduction'],
      ['m_gluteus_minimus', 20, 'Deep lateral pelvis']
    ],
    secondaryContributions: [],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_cable_hip_abduction',
    name: 'Cable Hip Abduction (Standing)',
    description: 'Ankle cuff cable abduction building the upper shelf of the gluteus medius.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'glutes',
    instructions: [
      'Attach cuff to ankle on far leg. Abduct leg out to side against cable resistance.'
    ],
    primaryContributions: [
      ['m_gluteus_medius', 80, 'Standing abduction'],
      ['m_gluteus_minimus', 15, 'Minimus']
    ],
    secondaryContributions: [
      ['m_gluteus_maximus', 5, 'Upper max fibers']
    ],
    stabilizerContributions: [['m_gluteus_medius', 20, 'Support leg stability']]
  }));

  items.push(createExercise({
    id: 'ex_seated_machine_hip_abduction',
    name: 'Seated Machine Hip Abduction',
    description: 'Strict machine abductor exercise targeting the gluteus medius, minimus, and upper max.',
    equipment: 'machine',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'glutes',
    instructions: [
      'Sit back in machine with pads against outer knees.',
      'Push knees outward as wide as possible, pause for 1 second, control return.'
    ],
    primaryContributions: [
      ['m_gluteus_medius', 70, 'Pure seated hip abduction'],
      ['m_gluteus_maximus', 20, 'Upper glute max abduction']
    ],
    secondaryContributions: [
      ['m_gluteus_minimus', 10, 'Minimus']
    ],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_standing_cable_kickback_angled',
    name: '45-Degree Angled Cable Glute Kickback',
    description: 'Combines hip extension with slight abduction to recruit both gluteus maximus and medius.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'glutes',
    instructions: [
      'Kick leg back at a 45-degree angle outward from body, squeezing upper outer glute.'
    ],
    primaryContributions: [
      ['m_gluteus_maximus', 70, 'Extension'],
      ['m_gluteus_medius', 30, 'Abduction synergy']
    ],
    secondaryContributions: [],
    stabilizerContributions: [['m_core', 15, 'Core brace']]
  }));

  items.push(createExercise({
    id: 'ex_dumbbell_sumo_squat_glutes',
    name: 'Dumbbell Sumo Squat (Glute Focus)',
    description: 'Wide stance squat with dumbbell held between legs targeting glutes and inner thighs.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'glutes',
    instructions: [
      'Stand with wide stance, toes turned out 45 degrees holding dumbbell hanging vertically.',
      'Squat down opening knees wide, drive through heels squeezing glutes at top.'
    ],
    primaryContributions: [
      ['m_gluteus_maximus', 60, 'Glute extension from wide base'],
      ['m_adductor_magnus', 25, 'Adductor synergy']
    ],
    secondaryContributions: [
      ['m_quadriceps', 15, 'Quads']
    ],
    stabilizerContributions: [['m_core', 15, 'Core posture']]
  }));

  // =========================================================================
  // 7. CORE (15 exercises)
  // =========================================================================
  items.push(createExercise({
    id: 'ex_hanging_leg_raise',
    name: 'Hanging Leg Raise',
    description: 'Gold standard lower abdominal exercise flexing pelvis toward ribcage from a dead hang.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'core',
    videoUrl: 'https://www.youtube.com/embed/hdng3Nm1x_E',
    instructions: [
      'Hang from pull-up bar with overhand grip, legs straight.',
      'Posteriorly tilt pelvis and raise straight legs up until parallel to floor or touching bar.',
      'Control the descent slowly without swinging.'
    ],
    primaryContributions: [
      ['m_rectus_abdominis', 70, 'Lower abdominal pelvic flexion'],
      ['m_transverse_abdominis', 20, 'Deep intra-abdominal brace']
    ],
    secondaryContributions: [
      ['m_obliques', 10, 'Lateral stability']
    ],
    stabilizerContributions: [
      ['m_latissimus_dorsi', 15, 'Shoulder depression hang'],
      ['m_forearms', 20, 'Grip']
    ]
  }));

  items.push(createExercise({
    id: 'ex_captains_chair_knee_raise',
    name: 'Captain\'s Chair Knee Raise',
    description: 'Supported forearm knee raise targeting rectus abdominis with zero lower back strain.',
    equipment: 'bodyweight',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'core',
    instructions: [
      'Support body on forearm pads of tower, back against pad.',
      'Curl knees up toward chest, curling pelvis upward at peak.'
    ],
    primaryContributions: [
      ['m_rectus_abdominis', 75, 'Pelvic flexion on pad'],
      ['m_transverse_abdominis', 15, 'Core compression']
    ],
    secondaryContributions: [
      ['m_obliques', 10, 'Obliques']
    ],
    stabilizerContributions: [['m_serratus_anterior', 10, 'Scapular support']]
  }));

  items.push(createExercise({
    id: 'ex_ab_wheel_rollout',
    name: 'Ab Wheel Rollout',
    description: 'Extreme anti-extension core exercise building bulletproof abdominal wall strength.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'core',
    instructions: [
      'Kneel on pad holding ab wheel beneath shoulders with slightly rounded upper back.',
      'Roll wheel forward extending body as far as possible without letting lumbar spine sag.',
      'Pull back by flexing abdominals to return to start.'
    ],
    primaryContributions: [
      ['m_rectus_abdominis', 60, 'Anti-extension eccentric resistance'],
      ['m_transverse_abdominis', 30, 'Deep spinal bracing']
    ],
    secondaryContributions: [
      ['m_latissimus_dorsi', 10, 'Shoulder extension pullover pull']
    ],
    stabilizerContributions: [
      ['m_serratus_anterior', 20, 'Scapular stability'],
      ['m_gluteus_maximus', 15, 'Pelvic posterior tilt']
    ]
  }));

  items.push(createExercise({
    id: 'ex_cable_woodchopper',
    name: 'Cable Woodchopper (High to Low / Diagonal)',
    description: 'Rotational power exercise building functional oblique and transverse abdominal strength.',
    equipment: 'cable',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'core',
    instructions: [
      'Stand sideways to high cable holding handle with both hands extended.',
      'Rotate torso diagonally downward across body toward opposite hip, pivoting back foot.',
      'Control cable return with core.'
    ],
    primaryContributions: [
      ['m_obliques', 75, 'Internal and external oblique rotation'],
      ['m_transverse_abdominis', 15, 'Rotational core stabilization']
    ],
    secondaryContributions: [
      ['m_rectus_abdominis', 10, 'Trunk flexion synergy']
    ],
    stabilizerContributions: [['m_deltoid_anterior', 15, 'Arm guide']]
  }));

  items.push(createExercise({
    id: 'ex_cable_crunch',
    name: 'Cable Kneeling Crunch (Rope)',
    description: 'Allows progressive overload on the rectus abdominis with constant cable tension.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'core',
    instructions: [
      'Kneel below high pulley holding rope at temples. Keep hips fixed in place.',
      'Curl torso downward curling ribcage toward pelvis, exhaling fully at bottom.',
      'Allow cable to stretch abs back to start without sitting back on heels.'
    ],
    primaryContributions: [
      ['m_rectus_abdominis', 85, 'Pure spinal flexion against resistance']
    ],
    secondaryContributions: [
      ['m_obliques', 15, 'Lateral ab assistance']
    ],
    stabilizerContributions: [['m_serratus_anterior', 10, 'Arm anchor']]
  }));

  items.push(createExercise({
    id: 'ex_decline_sit_up',
    name: 'Decline Bench Sit-Up',
    description: 'Extended range sit-up targeting the upper and mid rectus abdominis.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'core',
    instructions: [
      'Hook feet in decline bench, cross arms over chest.',
      'Lower torso until hovering above bench, curl spine up to seated.'
    ],
    primaryContributions: [
      ['m_rectus_abdominis', 80, 'Full range spinal flexion']
    ],
    secondaryContributions: [
      ['m_obliques', 15, 'Oblique support'],
      ['m_transverse_abdominis', 5, 'Core']
    ],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_elbow_plank',
    name: 'Elbow Plank (Front Plank)',
    description: 'Fundamental isometric anti-extension core hold building endurance and pelvic control.',
    equipment: 'bodyweight',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'core',
    instructions: [
      'Rest on forearms and toes with elbows under shoulders.',
      'Squeeze glutes, tuck pelvis, pull belly button inward, hold completely motionless.'
    ],
    primaryContributions: [
      ['m_transverse_abdominis', 50, 'Isometric intra-abdominal brace'],
      ['m_rectus_abdominis', 40, 'Anti-extension resistance']
    ],
    secondaryContributions: [
      ['m_obliques', 10, 'Lateral stability']
    ],
    stabilizerContributions: [
      ['m_serratus_anterior', 20, 'Scapular protraction on elbows'],
      ['m_gluteus_maximus', 15, 'Pelvic alignment']
    ]
  }));

  items.push(createExercise({
    id: 'ex_side_plank',
    name: 'Side Plank',
    description: 'Isometric anti-lateral flexion hold strengthening the obliques and quadratus lumborum.',
    equipment: 'bodyweight',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'core',
    instructions: [
      'Lie on side propped on elbow. Lift hips creating a straight diagonal line from head to feet.',
      'Hold position without letting bottom hip sag toward floor.'
    ],
    primaryContributions: [
      ['m_obliques', 75, 'Anti-lateral flexion hold'],
      ['m_transverse_abdominis', 15, 'Core compression']
    ],
    secondaryContributions: [
      ['m_gluteus_medius', 10, 'Lateral hip stabilization']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Shoulder support']]
  }));

  items.push(createExercise({
    id: 'ex_russian_twists',
    name: 'Russian Twists (Weighted / Bodyweight)',
    description: 'Rotational core movement challenging obliques and hip flexor coordination.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'core',
    instructions: [
      'Sit with knees bent, feet elevated off floor, torso leaned back 45 degrees.',
      'Rotate torso side to side, tapping weight on floor beside hips.'
    ],
    primaryContributions: [
      ['m_obliques', 70, 'Dynamic trunk rotation'],
      ['m_rectus_abdominis', 20, 'V-sit isometric hold']
    ],
    secondaryContributions: [
      ['m_transverse_abdominis', 10, 'TVA brace']
    ],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_dragon_flag',
    name: 'Dragon Flag (Bruce Lee Ab Movement)',
    description: 'Legendary advanced core test keeping the entire body rigid while hinging off the upper back.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'core',
    instructions: [
      'Lie on bench gripping edge behind head. Drive legs and torso straight up to vertical.',
      'Lower straight body slowly in one line until hovering above bench, then pull back up.'
    ],
    primaryContributions: [
      ['m_rectus_abdominis', 70, 'Extreme eccentric bodyweight leverage'],
      ['m_transverse_abdominis', 20, 'Total body tension']
    ],
    secondaryContributions: [
      ['m_latissimus_dorsi', 10, 'Bench grip pulling lever']
    ],
    stabilizerContributions: [
      ['m_gluteus_maximus', 25, 'Posterior hip lock'],
      ['m_erector_spinae', 15, 'Spine support']
    ]
  }));

  items.push(createExercise({
    id: 'ex_toes_to_bar',
    name: 'Toes-to-Bar (Hanging)',
    description: 'Full range gymnastics abdominal pull bringing toes all the way to contact the pull-up bar.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'core',
    instructions: [
      'Hang from bar. Initiate by flexing lats, curl hips and legs up until toes touch the bar.'
    ],
    primaryContributions: [
      ['m_rectus_abdominis', 70, 'Complete abdominal curl'],
      ['m_transverse_abdominis', 15, 'Compression']
    ],
    secondaryContributions: [
      ['m_latissimus_dorsi', 15, 'Active shoulder extension']
    ],
    stabilizerContributions: [['m_forearms', 20, 'Grip']]
  }));

  items.push(createExercise({
    id: 'ex_pallof_press',
    name: 'Pallof Press (Anti-Rotation)',
    description: 'Pure anti-rotation core trainer building athletic rotational resistance.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'core',
    instructions: [
      'Stand perpendicular to cable tower holding handle at sternum with both hands.',
      'Press hands straight out in front of chest, fighting cable\'s rotational pull.',
      'Hold 2 seconds with arms locked, return to chest.'
    ],
    primaryContributions: [
      ['m_transverse_abdominis', 50, 'Isometric anti-rotation brace'],
      ['m_obliques', 40, 'Rotational resistance']
    ],
    secondaryContributions: [
      ['m_rectus_abdominis', 10, 'Anterior core support']
    ],
    stabilizerContributions: [['m_gluteus_medius', 15, 'Standing hip anchor']]
  }));

  items.push(createExercise({
    id: 'ex_mountain_climbers',
    name: 'Mountain Climbers (Dynamic Plank)',
    description: 'High tempo plank variation driving knees to chest for dynamic core and hip endurance.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'core',
    instructions: [
      'In high push-up plank, drive alternate knees toward chest rapidly while keeping hips level.'
    ],
    primaryContributions: [
      ['m_rectus_abdominis', 60, 'Dynamic knee drive core brace'],
      ['m_transverse_abdominis', 25, 'Plank stability']
    ],
    secondaryContributions: [
      ['m_obliques', 15, 'Alternating hip rotation']
    ],
    stabilizerContributions: [['m_serratus_anterior', 15, 'Scapular stability']]
  }));

  items.push(createExercise({
    id: 'ex_dead_bug',
    name: 'Dead Bug (Contralateral Limb Reach)',
    description: 'Rehabilitation and athletic staple teaching lumbar stabilization with contralateral limb movement.',
    equipment: 'bodyweight',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'core',
    instructions: [
      'Lie on back with knees bent 90 degrees and arms pointing to ceiling. Press lower back flat into floor.',
      'Simultaneously lower right arm overhead and left leg toward floor without arching lower back.',
      'Return to center and switch sides.'
    ],
    primaryContributions: [
      ['m_transverse_abdominis', 60, 'Anti-extension deep pelvic control'],
      ['m_rectus_abdominis', 30, 'Spinal flat compression']
    ],
    secondaryContributions: [
      ['m_obliques', 10, 'Contralateral diagonal stability']
    ],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_bird_dog',
    name: 'Bird Dog (Quadruped Reach)',
    description: 'McGill Big 3 movement building spinal stability and posterior chain connection.',
    equipment: 'bodyweight',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'core',
    instructions: [
      'On hands and knees, reach opposite arm forward and leg backward in line with spine. Hold 2 seconds.'
    ],
    primaryContributions: [
      ['m_erector_spinae', 45, 'Multifidus & erector spinal stability'],
      ['m_transverse_abdominis', 35, 'Core pelvic stabilization']
    ],
    secondaryContributions: [
      ['m_gluteus_maximus', 20, 'Hip extension reach']
    ],
    stabilizerContributions: [['m_deltoid_posterior', 10, 'Shoulder balance']]
  }));

  // =========================================================================
  // 8. INNER THIGH (10 exercises)
  // =========================================================================
  items.push(createExercise({
    id: 'ex_seated_machine_hip_adduction',
    name: 'Seated Machine Hip Adduction',
    description: 'Strict machine adductor movement squeezing legs inward against resistance.',
    equipment: 'machine',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'inner_thigh',
    videoUrl: 'https://www.youtube.com/embed/s32e3h2pL9I',
    instructions: [
      'Sit in machine with legs open wide, pads on inner knees/thighs.',
      'Squeeze knees inward together smoothly, hold contraction for 1-2 seconds at center.',
      'Return slowly feeling loaded adductor stretch.'
    ],
    primaryContributions: [
      ['m_adductor_magnus', 60, 'Adductor magnus power'],
      ['m_adductor_longus', 30, 'Adductor longus & brevis']
    ],
    secondaryContributions: [
      ['m_gracilis', 10, 'Medial knee adduction assist']
    ],
    stabilizerContributions: [['m_core', 10, 'Seated posture']]
  }));

  items.push(createExercise({
    id: 'ex_standing_cable_hip_adduction',
    name: 'Standing Cable Hip Adduction',
    description: 'Ankle cuff cable adduction pulling leg across the centerline of the body.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'inner_thigh',
    instructions: [
      'Attach ankle cuff to near-side leg. Stand perpendicular to low pulley.',
      'Pull working leg across front of standing leg, squeezing inner thigh.'
    ],
    primaryContributions: [
      ['m_adductor_longus', 60, 'Adductor longus active pull'],
      ['m_adductor_magnus', 30, 'Adductor magnus']
    ],
    secondaryContributions: [
      ['m_gracilis', 10, 'Gracilis']
    ],
    stabilizerContributions: [['m_gluteus_medius', 20, 'Standing leg stability']]
  }));

  items.push(createExercise({
    id: 'ex_copenhagen_plank',
    name: 'Copenhagen Plank (Adductor Side Plank)',
    description: 'Elite adductor strengthening exercise proven in sports science to prevent groin strains.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'inner_thigh',
    instructions: [
      'Place top foot on bench, bottom leg hanging beneath. Prop body up on elbow in side plank.',
      'Hold position supporting body mass through top inner thigh and oblique.'
    ],
    primaryContributions: [
      ['m_adductor_magnus', 55, 'High isometric adductor shear resistance'],
      ['m_gracilis', 25, 'Medial knee stabilization']
    ],
    secondaryContributions: [
      ['m_obliques', 20, 'Side plank lateral core']
    ],
    stabilizerContributions: [['m_gluteus_medius', 15, 'Pelvic alignment']]
  }));

  items.push(createExercise({
    id: 'ex_sumo_deadlift_adductor_bias',
    name: 'Sumo Deadlift (Adductor Biased)',
    description: 'Ultra-wide stance deadlift maximizing mechanical tension on the adductor magnus.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'inner_thigh',
    instructions: [
      'Take an ultra-wide stance with shins vertical against bar. Drive knees wide outward.',
      'Push floor apart through heels, driving adductors and glutes to lockout.'
    ],
    primaryContributions: [
      ['m_adductor_magnus', 50, 'Heavy adductor magnus hip extension'],
      ['m_gluteus_maximus', 30, 'Glute extension']
    ],
    secondaryContributions: [
      ['m_quadriceps', 20, 'Knee extension']
    ],
    stabilizerContributions: [
      ['m_erector_spinae', 25, 'Spine support'],
      ['m_forearms', 20, 'Grip']
    ]
  }));

  items.push(createExercise({
    id: 'ex_wide_stance_leg_press',
    name: 'Wide-Stance Leg Press (Feet High & Wide)',
    description: 'Feet placed high and wide on platform to recruit the adductors and deep glutes.',
    equipment: 'machine',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'inner_thigh',
    instructions: [
      'Place feet at top outer corners of sled with toes turned 45 degrees outward.',
      'Lower sled deep, keeping knees tracking over toes, press back up.'
    ],
    primaryContributions: [
      ['m_adductor_magnus', 50, 'Adductor magnus extension assist'],
      ['m_quadriceps', 30, 'Knee extension']
    ],
    secondaryContributions: [
      ['m_gluteus_maximus', 20, 'Glute max']
    ],
    stabilizerContributions: []
  }));

  items.push(createExercise({
    id: 'ex_cossack_squat',
    name: 'Cossack Squat (Lateral Squat)',
    description: 'Full depth lateral squat loaded on one leg while putting trailing leg adductors on deep stretch.',
    equipment: 'bodyweight',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'inner_thigh',
    instructions: [
      'Stand with wide feet. Squat down to one side, keeping other leg straight with toes rotated up.',
      'Achieve deep hip flexion, push through heel to return to center.'
    ],
    primaryContributions: [
      ['m_adductor_magnus', 50, 'Eccentric stretch & concentric adductor drive'],
      ['m_quadriceps', 35, 'Working quad knee extension']
    ],
    secondaryContributions: [
      ['m_gluteus_maximus', 15, 'Glute extension']
    ],
    stabilizerContributions: [['m_core', 15, 'Upright balance']]
  }));

  items.push(createExercise({
    id: 'ex_lateral_lunge_dumbbell',
    name: 'Dumbbell Lateral Lunge (Side Lunge)',
    description: 'Dynamic frontal plane movement building adductor deceleration and lateral hip strength.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'inner_thigh',
    instructions: [
      'Step wide to the side, sinking hips back into lunge while keeping trailing leg straight.',
      'Push off working foot to return to standing.'
    ],
    primaryContributions: [
      ['m_adductor_magnus', 50, 'Adductors'],
      ['m_quadriceps', 35, 'Quads']
    ],
    secondaryContributions: [
      ['m_gluteus_maximus', 15, 'Glutes']
    ],
    stabilizerContributions: [['m_gluteus_medius', 15, 'Lateral hip control']]
  }));

  items.push(createExercise({
    id: 'ex_cable_adductor_kick_in',
    name: 'Cable Adductor Kick-In (Low Pulley)',
    description: 'Constant tension inner thigh pull crossing leg inward past midline.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'inner_thigh',
    instructions: [
      'Cuff on ankle, pull leg inward across body with straight knee, pause 1 second.'
    ],
    primaryContributions: [
      ['m_adductor_longus', 65, 'Adductor longus'],
      ['m_adductor_magnus', 25, 'Adductor magnus']
    ],
    secondaryContributions: [
      ['m_gracilis', 10, 'Gracilis']
    ],
    stabilizerContributions: [['m_gluteus_medius', 15, 'Support hip']]
  }));

  items.push(createExercise({
    id: 'ex_adductor_squeeze_ball',
    name: 'Isometric Adductor Squeeze (Medicine Ball or Yoga Block)',
    description: 'Isometric adductor hold building tendon strength and pelvic stability.',
    equipment: 'bodyweight',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'inner_thigh',
    instructions: [
      'Lie on back with knees bent. Place medicine ball or foam block between knees.',
      'Squeeze knees together as hard as possible for 10-15 seconds per rep.'
    ],
    primaryContributions: [
      ['m_adductor_longus', 60, 'Peak isometric adductor squeeze'],
      ['m_adductor_magnus', 30, 'Adductor magnus']
    ],
    secondaryContributions: [
      ['m_gracilis', 10, 'Gracilis']
    ],
    stabilizerContributions: [['m_core', 10, 'Pelvic floor & core']]
  }));

  items.push(createExercise({
    id: 'ex_dumbbell_goblet_sumo_squat',
    name: 'Dumbbell Goblet Sumo Squat',
    description: 'Upright goblet hold allowing deep adductor stretch and safe knee tracking.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'inner_thigh',
    instructions: [
      'Hold dumbbell at chest with wide stance, toes turned out.',
      'Squat deep between knees, pushing knees out against adductors, drive up.'
    ],
    primaryContributions: [
      ['m_adductor_magnus', 50, 'Adductor magnus loaded stretch'],
      ['m_quadriceps', 30, 'Quads']
    ],
    secondaryContributions: [
      ['m_gluteus_maximus', 20, 'Glutes']
    ],
    stabilizerContributions: [['m_core', 15, 'Torso posture']]
  }));

  return items;
}
