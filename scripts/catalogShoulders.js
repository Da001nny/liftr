import { createExercise } from './exerciseGenerator.js';

export function getShouldersExerciseList() {
  const items = [];

  items.push(createExercise({
    id: 'ex_barbell_overhead_press',
    name: 'Barbell Overhead Press (Military Press)',
    description: 'The definitive vertical push compound exercise building shoulder mass and full-body stabilization.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'shoulders',
    videoUrl: 'https://www.youtube.com/embed/2yjwXTZQDDI',
    instructions: [
      'Stand with feet hip-width apart. Hold barbell across collarbones with hands just outside shoulders.',
      'Squeeze glutes and brace core. Press bar overhead in a vertical line, moving head back slightly to clear chin.',
      'Lock out arms overhead with bar directly over mid-foot. Lower under control.'
    ],
    primaryContributions: [
      ['m_deltoid_anterior', 55, 'Primary vertical shoulder flexion'],
      ['m_deltoid_lateral', 20, 'Shoulder abduction assist']
    ],
    secondaryContributions: [
      ['m_triceps_lateral_head', 15, 'Overhead elbow extension'],
      ['m_trapezius_upper', 10, 'Scapular upward rotation']
    ],
    stabilizerContributions: [
      ['m_core', 20, 'Standing spinal brace'],
      ['m_rotator_cuff', 15, 'Overhead joint centering']
    ]
  }));

  items.push(createExercise({
    id: 'ex_seated_dumbbell_shoulder_press',
    name: 'Seated Dumbbell Shoulder Press',
    description: 'Seated overhead press isolating deltoids with free range of motion and back support.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    instructions: [
      'Sit on upright bench. Kick dumbbells to shoulder height with palms facing forward or slightly angled.',
      'Press dumbbells upward in an arc meeting overhead without clashing.',
      'Lower weights under control until hands reach ear level.'
    ],
    primaryContributions: [
      ['m_deltoid_anterior', 55, 'Front deltoid drive'],
      ['m_deltoid_lateral', 25, 'Side deltoid assistance']
    ],
    secondaryContributions: [
      ['m_triceps_lateral_head', 15, 'Elbow lockout'],
      ['m_trapezius_upper', 5, 'Trapezius support']
    ],
    stabilizerContributions: [['m_rotator_cuff', 20, 'Unilateral joint control']]
  }));

  items.push(createExercise({
    id: 'ex_standing_dumbbell_shoulder_press',
    name: 'Standing Dumbbell Shoulder Press',
    description: 'Standing overhead press demanding substantial core bracing and stabilizer recruitment.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'shoulders',
    instructions: [
      'Stand tall with dumbbells at shoulders, press vertically overhead while bracing glutes and abs.'
    ],
    primaryContributions: [
      ['m_deltoid_anterior', 50, 'Anterior delt'],
      ['m_deltoid_lateral', 25, 'Lateral delt']
    ],
    secondaryContributions: [
      ['m_triceps_lateral_head', 15, 'Triceps'],
      ['m_trapezius_upper', 10, 'Traps']
    ],
    stabilizerContributions: [['m_core', 25, 'Anti-extension standing core']]
  }));

  items.push(createExercise({
    id: 'ex_arnold_press',
    name: 'Arnold Press',
    description: 'Rotating dumbbell press hitting all three deltoid heads through an extended range of motion.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'shoulders',
    instructions: [
      'Sit upright holding dumbbells in front of shoulders with palms facing you (as at top of curl).',
      'As you press upward, rotate wrists so palms face forward at top of movement.',
      'Reverse rotation smoothly on the way down.'
    ],
    primaryContributions: [
      ['m_deltoid_anterior', 45, 'Front delt press'],
      ['m_deltoid_lateral', 35, 'Rotational abduction']
    ],
    secondaryContributions: [
      ['m_triceps_lateral_head', 15, 'Extension'],
      ['m_deltoid_posterior', 5, 'Rotational initiation']
    ],
    stabilizerContributions: [['m_rotator_cuff', 25, 'Continuous rotational stabilization']]
  }));

  items.push(createExercise({
    id: 'ex_behind_neck_press',
    name: 'Behind-the-Neck Barbell Press',
    description: 'Advanced shoulder press emphasizing lateral deltoids and upper back.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'shoulders',
    instructions: [
      'Grip barbell wide. Lower carefully to base of neck with upright posture, press to lockout.'
    ],
    primaryContributions: [
      ['m_deltoid_lateral', 45, 'High lateral delt recruitment'],
      ['m_deltoid_anterior', 35, 'Anterior delt']
    ],
    secondaryContributions: [
      ['m_triceps_lateral_head', 15, 'Triceps'],
      ['m_trapezius_upper', 5, 'Upper traps']
    ],
    stabilizerContributions: [['m_rotator_cuff', 25, 'High mobility demand']]
  }));

  items.push(createExercise({
    id: 'ex_push_press_barbell',
    name: 'Barbell Push Press',
    description: 'Dynamic overhead press using leg drive to propel heavy loads overhead.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'shoulders',
    instructions: [
      'Dip knees 2-3 inches with vertical torso, then explosively drive legs and press bar overhead.'
    ],
    primaryContributions: [
      ['m_deltoid_anterior', 45, 'Overhead pressing drive'],
      ['m_deltoid_lateral', 25, 'Side delt support']
    ],
    secondaryContributions: [
      ['m_triceps_lateral_head', 20, 'Powerful lockout'],
      ['m_quadriceps', 10, 'Dip drive assist']
    ],
    stabilizerContributions: [
      ['m_core', 20, 'Explosive core transfer'],
      ['m_rotator_cuff', 15, 'Overhead catch']
    ]
  }));

  items.push(createExercise({
    id: 'ex_machine_shoulder_press',
    name: 'Machine Shoulder Press',
    description: 'Guided overhead press maximizing deltoid overload without balance restrictions.',
    equipment: 'machine',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    instructions: [
      'Adjust seat so handles start at ear height. Press handles upward to near-lockout.'
    ],
    primaryContributions: [
      ['m_deltoid_anterior', 60, 'Front delt focus'],
      ['m_deltoid_lateral', 20, 'Side delt']
    ],
    secondaryContributions: [
      ['m_triceps_lateral_head', 20, 'Triceps extension']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Machine guided']]
  }));

  items.push(createExercise({
    id: 'ex_smith_machine_overhead_press',
    name: 'Smith Machine Overhead Press',
    description: 'Strict vertical pressing along guided track allowing safe training to failure.',
    equipment: 'smith_machine',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    instructions: [
      'Set bench under bar. Unhook bar, lower to chin height, press upward smoothly.'
    ],
    primaryContributions: [
      ['m_deltoid_anterior', 60, 'Guided overhead press'],
      ['m_deltoid_lateral', 20, 'Lateral delt']
    ],
    secondaryContributions: [
      ['m_triceps_lateral_head', 20, 'Triceps lockout']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Track stabilized']]
  }));

  items.push(createExercise({
    id: 'ex_dumbbell_lateral_raise',
    name: 'Dumbbell Lateral Raise',
    description: 'The cornerstone isolation exercise for lateral deltoid width and shoulder capping.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo',
    instructions: [
      'Stand with dumbbells at sides, slight forward torso lean (10-15 degrees).',
      'Raise arms out to sides leading with elbows until parallel to floor.',
      'Pour water forward slightly at top, pause, and lower slowly without swinging.'
    ],
    primaryContributions: [
      ['m_deltoid_lateral', 85, 'Pure shoulder abduction in scapular plane']
    ],
    secondaryContributions: [
      ['m_trapezius_upper', 10, 'Scapular elevation synergy'],
      ['m_deltoid_anterior', 5, 'Anterior fiber assist']
    ],
    stabilizerContributions: [
      ['m_rotator_cuff', 15, 'Humeral head seating'],
      ['m_forearms', 10, 'Grip']
    ]
  }));

  items.push(createExercise({
    id: 'ex_cable_lateral_raise',
    name: 'Cable Lateral Raise',
    description: 'Continuous resistance lateral raise providing peak tension at the bottom of the movement.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    instructions: [
      'Set low pulley. Stand with cable passing behind or in front of body.',
      'Raise handle out to shoulder height with slight elbow bend. Control the descent.'
    ],
    primaryContributions: [
      ['m_deltoid_lateral', 90, 'Constant tension lateral deltoid']
    ],
    secondaryContributions: [
      ['m_trapezius_upper', 10, 'Upper trap assistance']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Joint tracking']]
  }));

  items.push(createExercise({
    id: 'ex_leaning_cable_lateral_raise',
    name: 'Leaning Cable Lateral Raise',
    description: 'Leaning away from cable pillar to overload the stretched position of the lateral deltoid.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'shoulders',
    instructions: [
      'Hold cable pole with inside hand and lean torso outward at a 30-degree angle.',
      'Raise cable handle out to side, achieving deep contraction with zero momentum.'
    ],
    primaryContributions: [
      ['m_deltoid_lateral', 90, 'Stretched position lateral deltoid']
    ],
    secondaryContributions: [
      ['m_trapezius_upper', 10, 'Scapular rotation']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Joint stability']]
  }));

  items.push(createExercise({
    id: 'ex_machine_lateral_raise',
    name: 'Machine Lateral Raise',
    description: 'Padded elbow lever machine completely removing forearm and grip fatigue from side delts.',
    equipment: 'machine',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    instructions: [
      'Sit with pads against outer elbows. Drive elbows outward and upward to shoulder height.',
      'Hold peak squeeze for 1 second, lower slowly.'
    ],
    primaryContributions: [
      ['m_deltoid_lateral', 90, 'Isolated elbow lever abduction']
    ],
    secondaryContributions: [
      ['m_trapezius_upper', 10, 'Trapezius support']
    ],
    stabilizerContributions: [['m_rotator_cuff', 10, 'Shoulder tracking']]
  }));

  items.push(createExercise({
    id: 'ex_behind_back_cable_lateral_raise',
    name: 'Behind-the-Back Cable Lateral Raise',
    description: 'Cable routed behind the back to initiate pull directly in the scapular plane.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'shoulders',
    instructions: [
      'Attach D-handle to low pulley. Stand with cable passing behind glutes.',
      'Abduct arm out to side smoothly to parallel.'
    ],
    primaryContributions: [
      ['m_deltoid_lateral', 90, 'Scapular plane lateral deltoid']
    ],
    secondaryContributions: [
      ['m_trapezius_upper', 10, 'Trapezius assist']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Joint tracking']]
  }));

  items.push(createExercise({
    id: 'ex_dumbbell_front_raise',
    name: 'Dumbbell Front Raise',
    description: 'Isolated shoulder flexion focusing on the anterior deltoid head.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    instructions: [
      'Hold dumbbells in front of thighs with overhand grip.',
      'Raise one or both dumbbells straight forward to eye level without arching back.',
      'Lower under control.'
    ],
    primaryContributions: [
      ['m_deltoid_anterior', 85, 'Pure shoulder flexion']
    ],
    secondaryContributions: [
      ['m_chest_clavicular', 10, 'Upper chest synergist'],
      ['m_trapezius_upper', 5, 'Upper trap']
    ],
    stabilizerContributions: [['m_core', 15, 'Anti-extension core']]
  }));

  items.push(createExercise({
    id: 'ex_barbell_front_raise',
    name: 'Barbell Front Raise',
    description: 'Two-handed bilateral barbell front raise building anterior deltoid density.',
    equipment: 'barbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    instructions: [
      'Hold barbell across thighs. Raise bar forward with straight arms to shoulder height.'
    ],
    primaryContributions: [
      ['m_deltoid_anterior', 80, 'Anterior deltoid']
    ],
    secondaryContributions: [
      ['m_chest_clavicular', 15, 'Clavicular pectoral assist'],
      ['m_trapezius_upper', 5, 'Upper traps']
    ],
    stabilizerContributions: [['m_core', 15, 'Core brace']]
  }));

  items.push(createExercise({
    id: 'ex_cable_front_raise',
    name: 'Cable Front Raise (Rope or Bar)',
    description: 'Continuous tension anterior deltoid raise using low pulley cable.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    instructions: [
      'Straddle low cable with rope attachment between legs. Raise arms forward to eye level.'
    ],
    primaryContributions: [
      ['m_deltoid_anterior', 85, 'Constant tension front delt']
    ],
    secondaryContributions: [
      ['m_chest_clavicular', 10, 'Upper chest'],
      ['m_trapezius_upper', 5, 'Traps']
    ],
    stabilizerContributions: [['m_core', 15, 'Core support']]
  }));

  items.push(createExercise({
    id: 'ex_face_pull_rope',
    name: 'Face Pull (Rope Attachment)',
    description: 'Crucial shoulder health movement targeting rear delts, external rotators, and mid traps.',
    equipment: 'cable',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    instructions: [
      'Set cable at upper chest or eye level with rope. Grip rope with thumbs pointing backward.',
      'Step back, pull hands toward eyes/ears while rotating wrists back so knuckles face ceiling.',
      'Squeeze rear delts and mid-traps hard, lower with control.'
    ],
    primaryContributions: [
      ['m_deltoid_posterior', 45, 'Horizontal shoulder abduction'],
      ['m_rotator_cuff', 30, 'External rotation (infraspinatus & teres minor)']
    ],
    secondaryContributions: [
      ['m_trapezius_middle', 15, 'Scapular retraction'],
      ['m_trapezius_upper', 10, 'Trapezius support']
    ],
    stabilizerContributions: [['m_core', 15, 'Standing balance']]
  }));

  items.push(createExercise({
    id: 'ex_rear_delt_dumbbell_fly',
    name: 'Rear Delt Dumbbell Fly (Bent-Over)',
    description: 'Bent-over lateral raise targeting the posterior deltoids and rhomboids.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    instructions: [
      'Hinge at hips with torso parallel to floor or seated chest-to-knees.',
      'Raise dumbbells out to sides leading with pinkies and rear delts.',
      'Squeeze posterior shoulders at top, lower smoothly.'
    ],
    primaryContributions: [
      ['m_deltoid_posterior', 75, 'Posterior deltoid abduction']
    ],
    secondaryContributions: [
      ['m_trapezius_middle', 15, 'Rhomboid retraction'],
      ['m_rotator_cuff', 10, 'Infraspinatus synergy']
    ],
    stabilizerContributions: [['m_erector_spinae', 15, 'Hinge posture']]
  }));

  items.push(createExercise({
    id: 'ex_rear_delt_cable_fly',
    name: 'Rear Delt Cable Fly (High to Low / Standing)',
    description: 'Cross-cable rear delt pull providing smooth resistance across the entire arc.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    instructions: [
      'Stand between cables without handles, grasping bare carabiners with opposite hands (cross cable).',
      'Pull arms back and outward across chest height squeezing rear delts.'
    ],
    primaryContributions: [
      ['m_deltoid_posterior', 80, 'Posterior deltoid horizontal abduction']
    ],
    secondaryContributions: [
      ['m_trapezius_middle', 15, 'Mid-back synergy'],
      ['m_rotator_cuff', 5, 'Rotator cuff']
    ],
    stabilizerContributions: [['m_core', 10, 'Trunk stability']]
  }));

  items.push(createExercise({
    id: 'ex_machine_reverse_pec_deck',
    name: 'Machine Reverse Pec Deck (Rear Delt Fly)',
    description: 'Guided rear deltoid isolation eliminating body sway and balance requirements.',
    equipment: 'machine',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    instructions: [
      'Sit chest against pad, handles adjusted all the way back.',
      'Grasp handles with neutral or overhand grip, push arms outward and backward until rear delts fully contract.'
    ],
    primaryContributions: [
      ['m_deltoid_posterior', 80, 'Rear delt isolation']
    ],
    secondaryContributions: [
      ['m_trapezius_middle', 15, 'Scapular retraction'],
      ['m_rotator_cuff', 5, 'External rotators']
    ],
    stabilizerContributions: [['m_core', 5, 'Seated posture']]
  }));

  items.push(createExercise({
    id: 'ex_rear_delt_cable_crossover',
    name: 'Cable Rear Delt Crossover (Seated Bench)',
    description: 'Seated variation isolating rear deltoids with complete upper body stabilization.',
    equipment: 'cable',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'shoulders',
    instructions: [
      'Sit on upright bench facing cable cross. Pull cables across in horizontal plane.'
    ],
    primaryContributions: [
      ['m_deltoid_posterior', 80, 'Rear deltoid']
    ],
    secondaryContributions: [
      ['m_trapezius_middle', 15, 'Mid-back'],
      ['m_rotator_cuff', 5, 'Rotator cuff']
    ],
    stabilizerContributions: [['m_trapezius_lower', 10, 'Lower trap scapular stability']]
  }));

  items.push(createExercise({
    id: 'ex_barbell_upright_row',
    name: 'Barbell Upright Row',
    description: 'Pulling movement building lateral deltoids and upper trapezius thickness.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'shoulders',
    instructions: [
      'Grip barbell with hands shoulder-width apart (avoid very narrow grip).',
      'Pull bar up along torso leading with elbows up to chest height.',
      'Lower smoothly under control.'
    ],
    primaryContributions: [
      ['m_deltoid_lateral', 55, 'Lateral deltoid abduction'],
      ['m_trapezius_upper', 30, 'Trapezius elevation']
    ],
    secondaryContributions: [
      ['m_biceps_short_head', 15, 'Biceps flexion']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Subacromial space control']]
  }));

  items.push(createExercise({
    id: 'ex_dumbbell_upright_row',
    name: 'Dumbbell Upright Row',
    description: 'Allows independent hand freedom to prevent shoulder internal rotation impingement.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    instructions: [
      'Hold dumbbells in front of thighs. Pull elbows high and wide to shoulder level.'
    ],
    primaryContributions: [
      ['m_deltoid_lateral', 60, 'Side delt'],
      ['m_trapezius_upper', 25, 'Upper traps']
    ],
    secondaryContributions: [
      ['m_biceps_short_head', 15, 'Elbow flexion']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Joint tracking']]
  }));

  items.push(createExercise({
    id: 'ex_cable_upright_row',
    name: 'Cable Upright Row (Rope Attachment)',
    description: 'Rope attachment allows hands to separate at peak contraction for maximum side delt recruitment.',
    equipment: 'cable',
    movementType: 'compound',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    instructions: [
      'Attach rope to low pulley. Pull upward, spreading rope ends apart at collarbone level.'
    ],
    primaryContributions: [
      ['m_deltoid_lateral', 65, 'Continuous side delt tension'],
      ['m_trapezius_upper', 20, 'Traps']
    ],
    secondaryContributions: [
      ['m_biceps_short_head', 15, 'Biceps']
    ],
    stabilizerContributions: [['m_rotator_cuff', 15, 'Rotator cuff']]
  }));

  items.push(createExercise({
    id: 'ex_cuban_press',
    name: 'Cuban Press (Dumbbell)',
    description: 'Combines upright row, external rotation, and overhead press for complete shoulder armor.',
    equipment: 'dumbbell',
    movementType: 'compound',
    difficulty: 'advanced',
    targetRegionId: 'shoulders',
    instructions: [
      'Upright row dumbbells to chest height, externally rotate forearms up to 90 degrees, press overhead.',
      'Reverse all three steps under strict control.'
    ],
    primaryContributions: [
      ['m_rotator_cuff', 40, 'Active external rotation against gravity'],
      ['m_deltoid_lateral', 30, 'Upright row & abduction']
    ],
    secondaryContributions: [
      ['m_deltoid_anterior', 20, 'Overhead press'],
      ['m_trapezius_upper', 10, 'Scapular control']
    ],
    stabilizerContributions: [['m_deltoid_posterior', 15, 'Rear shoulder stability']]
  }));

  items.push(createExercise({
    id: 'ex_lu_raises',
    name: 'Lu Raises (Full Range Lateral Raise)',
    description: 'Full overhead lateral raise developed by Chinese Olympic weightlifters for shoulder mobility.',
    equipment: 'dumbbell',
    movementType: 'isolation',
    difficulty: 'intermediate',
    targetRegionId: 'shoulders',
    instructions: [
      'Start with light dumbbells at sides. Raise arms in a wide arc all the way overhead until dumbbells touch.',
      'Lower along the same arc with control.'
    ],
    primaryContributions: [
      ['m_deltoid_lateral', 60, 'Full abduction range'],
      ['m_trapezius_upper', 30, 'Overhead upward rotation']
    ],
    secondaryContributions: [
      ['m_serratus_anterior', 10, 'Scapular upward rotation']
    ],
    stabilizerContributions: [['m_rotator_cuff', 20, 'Overhead humeral control']]
  }));

  items.push(createExercise({
    id: 'ex_plate_front_raise',
    name: 'Plate Front Raise (Steering Wheel)',
    description: 'Weight plate raise providing grip strength and isometric rotational challenge to deltoids.',
    equipment: 'barbell',
    movementType: 'isolation',
    difficulty: 'beginner',
    targetRegionId: 'shoulders',
    instructions: [
      'Hold weight plate at 9 and 3 o\'clock. Raise to eye level and rotate slightly like a steering wheel.'
    ],
    primaryContributions: [
      ['m_deltoid_anterior', 80, 'Plate front raise']
    ],
    secondaryContributions: [
      ['m_deltoid_lateral', 10, 'Rotational twist'],
      ['m_forearms', 10, 'Plate pinch grip']
    ],
    stabilizerContributions: [['m_core', 15, 'Core brace']]
  }));

  items.push(createExercise({
    id: 'ex_landmine_shoulder_press',
    name: 'Landmine Single-Arm Shoulder Press',
    description: 'Angled overhead press sparing the subacromial joint while blasting the front and side delts.',
    equipment: 'barbell',
    movementType: 'compound',
    difficulty: 'intermediate',
    targetRegionId: 'shoulders',
    instructions: [
      'Hold tip of landmine barbell at shoulder. Press upward and forward in a natural arc to full extension.'
    ],
    primaryContributions: [
      ['m_deltoid_anterior', 65, 'Angular shoulder press'],
      ['m_deltoid_lateral', 20, 'Lateral delt']
    ],
    secondaryContributions: [
      ['m_triceps_lateral_head', 15, 'Lockout']
    ],
    stabilizerContributions: [
      ['m_obliques', 20, 'Anti-lateral flexion core'],
      ['m_serratus_anterior', 15, 'Scapular protraction']
    ]
  }));

  return items;
}
