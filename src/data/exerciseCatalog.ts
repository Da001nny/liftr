// liftr: Authoritative Exercise & Muscle Taxonomy Catalog
// Total: 203 Validated Exercises, 31 Muscles, 8 Regions
// Strictly validated contribution distributions (Primary + Secondary === 100%, Stabilizers separate)

export interface MuscleRegion {
  id: string;
  name: string;
  description: string;
  orderIndex: number;
}

export interface Muscle {
  id: string;
  name: string;
  commonName: string;
  regionId: string;
  subregion: string;
  description: string;
}

export type EquipmentType = 
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'smith_machine'
  | 'band';

export type MovementType = 'compound' | 'isolation';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ContributionRole = 'Primary' | 'Secondary' | 'Stabilizer';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  equipment: EquipmentType;
  movementType: MovementType;
  difficulty: DifficultyLevel;
  targetRegionId: string;
  instructions: string[];
  imageUrl: string | null;
  videoUrl: string | null;
}

export interface ExerciseMuscleContribution {
  id: string;
  exerciseId: string;
  muscleId: string;
  percentage: number;
  role: ContributionRole;
  notes: string | null;
}

export const MUSCLE_REGIONS: MuscleRegion[] = [
  {
    "id": "chest",
    "name": "Chest",
    "description": "Pectoralis major (clavicular, sternal, costal heads) and minor",
    "orderIndex": 1
  },
  {
    "id": "back",
    "name": "Back",
    "description": "Latissimus dorsi, trapezius, rhomboids, teres major, and spinal erectors",
    "orderIndex": 2
  },
  {
    "id": "shoulders",
    "name": "Shoulders",
    "description": "Anterior, lateral, and posterior deltoids plus rotator cuff complex",
    "orderIndex": 3
  },
  {
    "id": "arms",
    "name": "Arms",
    "description": "Biceps brachii, brachialis, triceps brachii heads, and forearms",
    "orderIndex": 4
  },
  {
    "id": "legs",
    "name": "Legs",
    "description": "Quadriceps, hamstrings complex, gastrocnemius, soleus, and tibialis anterior",
    "orderIndex": 5
  },
  {
    "id": "glutes",
    "name": "Glutes",
    "description": "Gluteus maximus, medius, and minimus",
    "orderIndex": 6
  },
  {
    "id": "core",
    "name": "Core",
    "description": "Rectus abdominis, obliques, transverse abdominis, and serratus anterior",
    "orderIndex": 7
  },
  {
    "id": "inner_thigh",
    "name": "Inner Thigh",
    "description": "Adductor magnus, longus, brevis, and gracilis",
    "orderIndex": 8
  }
];

export const MUSCLES: Muscle[] = [
  {
    "id": "m_chest_clavicular",
    "name": "Clavicular Head (Upper Chest)",
    "commonName": "Upper Chest",
    "regionId": "chest",
    "subregion": "Upper Pectorals",
    "description": "Elevated fibers originating at the clavicle, primary in incline presses"
  },
  {
    "id": "m_chest_sternal",
    "name": "Sternal Head (Mid Chest)",
    "commonName": "Mid Chest",
    "regionId": "chest",
    "subregion": "Mid Pectorals",
    "description": "Main fan-shaped fibers originating at the sternum, primary in horizontal adduction"
  },
  {
    "id": "m_chest_costal",
    "name": "Costal Head (Lower Chest)",
    "commonName": "Lower Chest",
    "regionId": "chest",
    "subregion": "Lower Pectorals",
    "description": "Lower fibers running toward the abdominal aponeurosis, emphasized in dips and decline press"
  },
  {
    "id": "m_latissimus_dorsi",
    "name": "Latissimus Dorsi",
    "commonName": "Lats",
    "regionId": "back",
    "subregion": "Mid & Lower Back",
    "description": "Broadest muscle of the back, drives shoulder extension, adduction, and horizontal pulling"
  },
  {
    "id": "m_trapezius_upper",
    "name": "Upper Trapezius",
    "commonName": "Upper Traps",
    "regionId": "back",
    "subregion": "Cervical Spine & Neck",
    "description": "Elevates and upwardly rotates the scapula, active in shrugs and overhead stabilization"
  },
  {
    "id": "m_trapezius_middle",
    "name": "Middle Trapezius & Rhomboids",
    "commonName": "Mid Back & Rhomboids",
    "regionId": "back",
    "subregion": "Thoracic Scapular Retractors",
    "description": "Scapular retraction and horizontal pulling stabilization"
  },
  {
    "id": "m_trapezius_lower",
    "name": "Lower Trapezius",
    "commonName": "Lower Traps",
    "regionId": "back",
    "subregion": "Lower Scapular Depressors",
    "description": "Depresses and stabilizes the scapula during vertical and horizontal pulling"
  },
  {
    "id": "m_teres_major",
    "name": "Teres Major",
    "commonName": "Upper Lats / Teres",
    "regionId": "back",
    "subregion": "Posterior Shoulder & Upper Lat",
    "description": "Assists latissimus dorsi in adduction and internal rotation of the humerus"
  },
  {
    "id": "m_erector_spinae",
    "name": "Erector Spinae",
    "commonName": "Lower Back",
    "regionId": "back",
    "subregion": "Spinal Erectors",
    "description": "Extends and stabilizes the vertebral column, foundational in deadlifts and squats"
  },
  {
    "id": "m_deltoid_anterior",
    "name": "Anterior Deltoid",
    "commonName": "Front Delt",
    "regionId": "shoulders",
    "subregion": "Anterior Shoulder",
    "description": "Shoulder flexion and horizontal adduction, primary in overhead and incline pressing"
  },
  {
    "id": "m_deltoid_lateral",
    "name": "Lateral Deltoid",
    "commonName": "Side Delt",
    "regionId": "shoulders",
    "subregion": "Lateral Shoulder",
    "description": "Primary shoulder abductor creating shoulder width and 3D silhouette"
  },
  {
    "id": "m_deltoid_posterior",
    "name": "Posterior Deltoid",
    "commonName": "Rear Delt",
    "regionId": "shoulders",
    "subregion": "Posterior Shoulder",
    "description": "Horizontal abduction and external rotation, key for shoulder balance and posture"
  },
  {
    "id": "m_rotator_cuff",
    "name": "Rotator Cuff Complex",
    "commonName": "Rotator Cuff",
    "regionId": "shoulders",
    "subregion": "Glenohumeral Stabilizers",
    "description": "Supraspinatus, infraspinatus, teres minor, subscapularis dynamic joint stabilization"
  },
  {
    "id": "m_biceps_long_head",
    "name": "Biceps Brachii (Long Head)",
    "commonName": "Outer Bicep",
    "regionId": "arms",
    "subregion": "Anterior Upper Arm",
    "description": "Forms the outer bicep peak, crosses the glenohumeral joint"
  },
  {
    "id": "m_biceps_short_head",
    "name": "Biceps Brachii (Short Head)",
    "commonName": "Inner Bicep",
    "regionId": "arms",
    "subregion": "Anterior Upper Arm",
    "description": "Forms the inner bicep thickness and width"
  },
  {
    "id": "m_brachialis",
    "name": "Brachialis",
    "commonName": "Brachialis",
    "regionId": "arms",
    "subregion": "Anterior Arm / Under Bicep",
    "description": "Strongest pure elbow flexor, pushes bicep upward for arm thickness"
  },
  {
    "id": "m_triceps_long_head",
    "name": "Triceps Brachii (Long Head)",
    "commonName": "Triceps Long Head",
    "regionId": "arms",
    "subregion": "Posterior Upper Arm",
    "description": "Largest triceps head, crosses the shoulder joint, emphasized in overhead extensions"
  },
  {
    "id": "m_triceps_lateral_head",
    "name": "Triceps Brachii (Lateral Head)",
    "commonName": "Triceps Outer Head",
    "regionId": "arms",
    "subregion": "Posterior Upper Arm",
    "description": "Forms the outer triceps horseshoe curve, dominant in pushdowns"
  },
  {
    "id": "m_triceps_medial_head",
    "name": "Triceps Brachii (Medial Head)",
    "commonName": "Triceps Inner Head",
    "regionId": "arms",
    "subregion": "Posterior Upper Arm",
    "description": "Active across all elbow extension angles, primary elbow stabilizer"
  },
  {
    "id": "m_forearms",
    "name": "Forearm Flexors & Extensors",
    "commonName": "Forearms & Grip",
    "regionId": "arms",
    "subregion": "Lower Arm & Wrist",
    "description": "Wrist flexion, extension, pronation, supination, and grip endurance"
  },
  {
    "id": "m_quadriceps",
    "name": "Quadriceps Femoris",
    "commonName": "Quads",
    "regionId": "legs",
    "subregion": "Anterior Thigh",
    "description": "Rectus femoris, vastus lateralis, vastus medialis, vastus intermedius knee extension"
  },
  {
    "id": "m_hamstrings",
    "name": "Hamstrings Complex",
    "commonName": "Hamstrings",
    "regionId": "legs",
    "subregion": "Posterior Thigh",
    "description": "Biceps femoris, semitendinosus, and semimembranosus hip extension and knee flexion"
  },
  {
    "id": "m_calves_gastrocnemius",
    "name": "Gastrocnemius",
    "commonName": "Calves (Outer)",
    "regionId": "legs",
    "subregion": "Posterior Lower Leg",
    "description": "Biarticular calf muscle with lateral and medial heads, dominant with straight knees"
  },
  {
    "id": "m_calves_soleus",
    "name": "Soleus",
    "commonName": "Calves (Deep/Soleus)",
    "regionId": "legs",
    "subregion": "Posterior Lower Leg",
    "description": "Deep postural calf muscle active in seated calf raises and ankle stability"
  },
  {
    "id": "m_tibialis_anterior",
    "name": "Tibialis Anterior",
    "commonName": "Shins",
    "regionId": "legs",
    "subregion": "Anterior Lower Leg",
    "description": "Dorsiflexes and inverts the foot, crucial for knee protection and deceleration"
  },
  {
    "id": "m_gluteus_maximus",
    "name": "Gluteus Maximus",
    "commonName": "Glute Max",
    "regionId": "glutes",
    "subregion": "Posterior Pelvis",
    "description": "Largest muscle in the human body, primary hip extensor and external rotator"
  },
  {
    "id": "m_gluteus_medius",
    "name": "Gluteus Medius",
    "commonName": "Glute Med",
    "regionId": "glutes",
    "subregion": "Lateral Pelvis",
    "description": "Primary hip abductor and pelvic stabilizer in single-leg stance"
  },
  {
    "id": "m_gluteus_minimus",
    "name": "Gluteus Minimus",
    "commonName": "Glute Min",
    "regionId": "glutes",
    "subregion": "Deep Lateral Pelvis",
    "description": "Synergist for hip abduction and internal rotation"
  },
  {
    "id": "m_rectus_abdominis",
    "name": "Rectus Abdominis",
    "commonName": "Abs",
    "regionId": "core",
    "subregion": "Anterior Abdominal Wall",
    "description": "Flexes the lumbar spine and stabilizes the pelvis against anterior tilt"
  },
  {
    "id": "m_obliques",
    "name": "Internal & External Obliques",
    "commonName": "Obliques",
    "regionId": "core",
    "subregion": "Lateral Abdominal Wall",
    "description": "Lateral flexion, trunk rotation, and anti-rotational stability"
  },
  {
    "id": "m_transverse_abdominis",
    "name": "Transverse Abdominis",
    "commonName": "Deep Core & TVA",
    "regionId": "core",
    "subregion": "Deep Abdominal Core",
    "description": "Deepest abdominal muscle providing intra-abdominal pressure and spinal bracing"
  },
  {
    "id": "m_serratus_anterior",
    "name": "Serratus Anterior",
    "commonName": "Serratus",
    "regionId": "core",
    "subregion": "Anterolateral Thorax",
    "description": "Protracts and upwardly rotates the scapula, protects shoulder rhythm"
  },
  {
    "id": "m_core",
    "name": "Core & Abdominal Complex",
    "commonName": "Core Complex",
    "regionId": "core",
    "subregion": "Midsection Core",
    "description": "Deep core, spinal erector, and abdominal wall stabilization"
  },
  {
    "id": "m_adductor_magnus",
    "name": "Adductor Magnus",
    "commonName": "Adductor Magnus",
    "regionId": "inner_thigh",
    "subregion": "Medial Thigh (Posterior)",
    "description": "Largest adductor with extensor head assisting deep hip extension and stabilization"
  },
  {
    "id": "m_adductor_longus",
    "name": "Adductor Longus & Brevis",
    "commonName": "Adductors",
    "regionId": "inner_thigh",
    "subregion": "Medial Thigh (Anterior)",
    "description": "Thigh adduction and hip flexion stabilization"
  },
  {
    "id": "m_gracilis",
    "name": "Gracilis",
    "commonName": "Gracilis",
    "regionId": "inner_thigh",
    "subregion": "Superficial Medial Thigh",
    "description": "Crosses hip and knee joints, aids in adduction and knee flexion"
  }
];

export const EXERCISES: Exercise[] = [
  {
    "id": "ex_barbell_bench_press",
    "name": "Barbell Bench Press",
    "description": "The foundational horizontal push compound movement for chest, front deltoids, and triceps.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Lie flat on the bench with eyes positioned directly under the barbell.",
      "Grip the bar slightly wider than shoulder-width and retract your shoulder blades into the bench.",
      "Unrack the bar, lower it with control to mid-chest while tucking elbows at roughly 45-75 degrees.",
      "Drive powerfully upward until arms are extended, keeping feet driven into the floor."
    ],
    "imageUrl": null,
    "videoUrl": "https://www.youtube.com/embed/rT7DgCr-3pg",
    "targetRegionId": "chest"
  },
  {
    "id": "ex_incline_barbell_bench_press",
    "name": "Incline Barbell Bench Press",
    "description": "Angled barbell press emphasizing the clavicular head of the pectoralis major and anterior deltoids.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Set bench to a 30-degree incline. Grip bar with hands slightly wider than shoulder-width.",
      "Unrack and lower the bar under control toward upper chest near collarbones.",
      "Press upward and slightly backward over shoulders to complete extension."
    ],
    "imageUrl": null,
    "videoUrl": "https://www.youtube.com/embed/8iPEnn-ltC8",
    "targetRegionId": "chest"
  },
  {
    "id": "ex_decline_barbell_bench_press",
    "name": "Decline Barbell Bench Press",
    "description": "Decline press focusing on the lower sternocostal pectoral fibers with reduced shoulder strain.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Secure legs in decline bench rollers. Grip bar slightly wider than shoulder-width.",
      "Lower bar to the lower chest / xiphoid process.",
      "Drive upward locked into the decline plane."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_flat_dumbbell_press",
    "name": "Flat Dumbbell Press",
    "description": "Allows greater range of motion and converging path for chest muscle fibers.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Sit on bench with dumbbells resting on knees, kick back into lying position.",
      "Press dumbbells up with a natural convergence at the peak without clashing weights.",
      "Lower dumbbells slowly until deep stretch is felt in mid-chest."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_incline_dumbbell_press",
    "name": "Incline Dumbbell Press",
    "description": "Gold standard upper chest builder providing independent limb stabilization and natural arch.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Set incline to 30-45 degrees. Kick dumbbells into position over upper chest.",
      "Lower dumbbells with elbows at roughly 60 degrees from torso.",
      "Press upward in an arc bringing bells together over upper chest."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_decline_dumbbell_press",
    "name": "Decline Dumbbell Press",
    "description": "Targets the lower pectoralis fibers while allowing natural wrist rotation.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Secure feet on decline bench, lie back with dumbbells.",
      "Lower weights to sides of lower chest, then press back to full extension."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_flat_dumbbell_fly",
    "name": "Flat Dumbbell Fly",
    "description": "Isolation chest movement providing continuous loaded stretch on the pectoral fibers.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Lie flat with dumbbells extended over chest, palms facing each other.",
      "Lower arms laterally in an arc with a slight elbow bend until a comfortable chest stretch is achieved.",
      "Contract pectorals to bring dumbbells back along the same arc."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_incline_dumbbell_fly",
    "name": "Incline Dumbbell Fly",
    "description": "Upper pectoral isolation providing stretch and contraction on a 30-degree incline.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Set bench to 30 degrees incline. Hold dumbbells overhead with palms facing inward.",
      "Open arms wide with slight elbow bend, feeling stretch across clavicular head.",
      "Squeeze upper chest to return dumbbells to top."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_cable_crossover_high_to_low",
    "name": "Cable Crossover (High to Low)",
    "description": "Constant-tension cable adduction targeting lower and sternal pectoral fibers.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Set pulleys above head height. Grasp handles and step forward with one foot.",
      "With slight elbow bend, pull handles downward and together in front of waist.",
      "Squeeze lower chest hard at peak contraction, return under control."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_cable_fly_low_to_high",
    "name": "Cable Fly (Low to High)",
    "description": "Scooping cable motion aligning with upper pectoral fibers running from collarbone.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Set pulleys to lowest position. Grasp handles with palms facing upward.",
      "Sweep hands upward and inward meeting at upper chest height.",
      "Pause and contract clavicular pectorals before lowering slowly."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_middle_cable_fly",
    "name": "Middle Cable Fly (Chest Level)",
    "description": "Horizontal cable fly matching mid-pectoral fibers with peak tension in contraction.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Set pulleys at chest level. Step forward into slight staggered stance.",
      "Hug arms inward in horizontal plane, squeezing chest tightly at midpoint.",
      "Control the eccentric stretch back to start."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_machine_chest_press",
    "name": "Machine Chest Press",
    "description": "Guided chest pressing allowing high mechanical tension with minimal balance demands.",
    "equipment": "machine",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Adjust seat so handles align with mid-chest. Plant feet flat.",
      "Press handles forward smoothly until elbows are nearly extended.",
      "Return slowly feeling loaded pectoral stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_incline_machine_chest_press",
    "name": "Incline Machine Chest Press",
    "description": "Converging incline machine press maximizing upper chest hypertrophy safely.",
    "equipment": "machine",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Adjust seat height so handles sit just below collarbone level.",
      "Press upward along machine track, squeezing upper chest at peak.",
      "Lower weights smoothly to starting depth."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_pec_deck_fly",
    "name": "Pec Deck Machine Fly",
    "description": "Pure chest isolation with fixed elbow position eliminating triceps involvement.",
    "equipment": "machine",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Adjust seat so arms are roughly horizontal to floor when gripping pads/handles.",
      "Pull arms together across chest with smooth squeeze.",
      "Allow weights to stretch chest slowly back without losing shoulder positioning."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_push_up",
    "name": "Push-Up",
    "description": "Bodyweight cornerstone building chest, anterior delts, triceps, and abdominal core.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Place hands slightly wider than shoulder-width, body in a rigid straight line plank.",
      "Lower chest until 1-2 inches off floor with elbows at 45-degree angle.",
      "Push the ground away to full elbow extension, protracting shoulders at top."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_incline_push_up",
    "name": "Incline Push-Up (Hands Elevated)",
    "description": "Elevated hands regression reducing load while maintaining movement pattern.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Place hands on sturdy bench or box. Keep body straight from head to heels.",
      "Lower chest to edge of bench and push back up smoothly."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_decline_push_up",
    "name": "Decline Push-Up (Feet Elevated)",
    "description": "Elevated feet variation shifting body mass toward upper pectorals and shoulders.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Place feet on bench or box, hands on floor beneath shoulders.",
      "Lower chest toward floor maintaining tight core.",
      "Press back up to locked arms."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_weighted_push_up",
    "name": "Weighted Push-Up",
    "description": "Progressive overload push-up using weight vest or plate on upper back.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Position weight plate on upper back or wear weighted vest.",
      "Perform strict full range push-ups without sagging hips."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_chest_dips",
    "name": "Chest Dips (Leaning Forward)",
    "description": "Bodyweight or weighted dip with forward torso lean to maximize lower chest recruitment.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Grip parallel bars, lean torso forward at roughly 30 degrees with knees bent.",
      "Lower body until elbows reach 90 degrees and chest feels a deep loaded stretch.",
      "Press upward through palms focusing on pectoral contraction rather than triceps."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_smith_machine_bench_press",
    "name": "Smith Machine Bench Press",
    "description": "Fixed bar path pressing allowing complete focus on pectoral muscle fiber recruitment.",
    "equipment": "smith_machine",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Position flat bench so bar touches mid-chest on descent.",
      "Unlock bar, lower smoothly to light chest touch, and press to lockout."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_smith_machine_incline_press",
    "name": "Smith Machine Incline Press",
    "description": "Incline angle on fixed bar path maximizing clavicular chest tension with safe failure.",
    "equipment": "smith_machine",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Set incline bench at 30 degrees directly under Smith bar.",
      "Lower bar to upper chest and drive upward with constant pectoral tension."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_neutral_grip_dumbbell_press",
    "name": "Neutral Grip Dumbbell Press",
    "description": "Dumbbell press with palms facing each other to spare shoulders and isolate sternal chest.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Lie flat holding dumbbells with neutral palms-in grip.",
      "Tuck elbows close to ribs on descent, press up while maintaining neutral wrists."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_svend_press",
    "name": "Svend Press (Plate Squeeze Press)",
    "description": "Standing isometric pectoral squeeze press using weight plates.",
    "equipment": "barbell",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Stand tall sandwiching two small bumper or iron plates between your flat palms at chest height.",
      "Squeeze hands together as hard as possible, pressing plates straight forward until arms extend.",
      "Hold peak squeeze for 1-2 seconds, then return to chest."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_floor_press_barbell",
    "name": "Barbell Floor Press",
    "description": "Partial range pressing off the floor emphasizing triceps lockout and reducing shoulder extension.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Lie flat on floor with knees bent and feet flat under a rack.",
      "Unrack barbell and lower until triceps rest gently on floor without bouncing.",
      "Press powerfully upward to lockout."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_floor_press_dumbbell",
    "name": "Dumbbell Floor Press",
    "description": "Floor press using dumbbells to allow neutral or angled wrist variations.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Lie on floor with dumbbells at chest level. Press up to full extension.",
      "Lower until upper arms touch floor pause briefly, press up."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_landmine_chest_press",
    "name": "Landmine Chest Press (Single-Arm)",
    "description": "Angular standing press following natural shoulder biomechanics with high upper chest stimulus.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Stand facing landmine station, hold end of barbell at shoulder with one hand in staggered stance.",
      "Press barbell forward and upward following the arc, squeezing upper chest at peak.",
      "Lower slowly under control."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_single_arm_cable_chest_press",
    "name": "Single-Arm Cable Chest Press",
    "description": "Standing unilateral cable press delivering continuous resistance and anti-rotational core work.",
    "equipment": "cable",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Set cable at chest height. Take handle in one hand, step into staggered stance.",
      "Press straight forward without letting torso rotate.",
      "Return slowly under cable stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_seated_cable_crossover",
    "name": "Seated Cable Crossover",
    "description": "Seated variation eliminating momentum and core compensation for pure chest isolation.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Place upright bench between cable towers. Sit back and grasp handles.",
      "Adduct arms across chest in a smooth arc, pausing at peak squeeze."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_hammer_strength_flat_press",
    "name": "Hammer Strength Flat Press",
    "description": "Plate-loaded converging press mimicking dumbbell path with barbell load capacity.",
    "equipment": "machine",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Load plates on machine, adjust seat so handles align with lower/mid pectoral line.",
      "Drive handles outward and forward along converging path, squeeze chest hard."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_hammer_strength_incline_press",
    "name": "Hammer Strength Incline Press",
    "description": "Converging plate-loaded machine isolating upper chest without rotator cuff strain.",
    "equipment": "machine",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Adjust seat so handles are at collarbone level.",
      "Press upward along diverging/converging path, control the descent."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "chest"
  },
  {
    "id": "ex_conventional_deadlift",
    "name": "Conventional Barbell Deadlift",
    "description": "The king of posterior chain movements engaging the spinal erectors, lats, glutes, and hamstrings.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Stand with feet hip-width apart, barbell over mid-foot.",
      "Hinge at hips, grip bar just outside knees. Depress lats and brace core.",
      "Drive feet through floor, extending knees and hips simultaneously to lockout."
    ],
    "imageUrl": null,
    "videoUrl": "https://www.youtube.com/embed/op9kVnSso6Q",
    "targetRegionId": "back"
  },
  {
    "id": "ex_sumo_deadlift",
    "name": "Sumo Barbell Deadlift",
    "description": "Wide stance deadlift variation shifting more demand onto the adductors and quads while working the back.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Stand with feet wide pointing toward plates. Grip bar inside knees.",
      "Open knees out over toes, keep torso upright, and drive through heels to lockout."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_barbell_bent_over_row_overhand",
    "name": "Barbell Bent-Over Row (Overhand)",
    "description": "Classic horizontal pulling compound exercise targeting the upper back, rhomboids, and lats.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Hinge at hips with torso around 45 degrees, back flat. Grip bar with overhand grip.",
      "Pull bar toward lower ribcage / navel by driving elbows back.",
      "Squeeze shoulder blades together at top, lower under control."
    ],
    "imageUrl": null,
    "videoUrl": "https://www.youtube.com/embed/G8l_8chR5BE",
    "targetRegionId": "back"
  },
  {
    "id": "ex_barbell_row_underhand",
    "name": "Barbell Bent-Over Row (Underhand / Yates)",
    "description": "Supinated grip row variation emphasizing lower lat recruitment and greater bicep leverage.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Hold barbell with palms facing forward (underhand). Torso at 50-60 degrees.",
      "Pull bar smoothly into lower waist while keeping elbows tucked close to torso."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_pendlay_row",
    "name": "Pendlay Row (Strict Dead-Stop)",
    "description": "Strict horizontal row starting from a dead stop on the floor each rep, building explosive pulling power.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Torso parallel to floor with plates resting on ground. Overhand grip slightly wider than shoulder.",
      "Explosively pull bar into sternum without rising with hips.",
      "Return bar completely to floor for dead stop between reps."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_pull_up",
    "name": "Pull-Up (Overhand Wide Grip)",
    "description": "Benchmark bodyweight vertical pull building wide lat wingspan and upper back density.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Grip bar with overhand grip wider than shoulders. Hang in full dead hang.",
      "Depress scapulae and pull elbows down and back toward ribs.",
      "Bring chin clearing over bar, pause, and lower to full dead hang."
    ],
    "imageUrl": null,
    "videoUrl": "https://www.youtube.com/embed/eGo4IYlbE5g",
    "targetRegionId": "back"
  },
  {
    "id": "ex_chin_up",
    "name": "Chin-Up (Underhand Supinated Grip)",
    "description": "Supinated vertical pull maximizing biceps leverage while powerfully working the lats.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Grip bar shoulder-width with palms facing you (underhand).",
      "Pull chest up toward bar, driving elbows downward.",
      "Lower smoothly to full elbow extension."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_neutral_grip_pull_up",
    "name": "Neutral Grip Pull-Up",
    "description": "Parallel grip pull-up offering shoulder-friendly biomechanics and strong brachialis recruitment.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Grasp parallel handles with palms facing each other.",
      "Pull body up leading with chest until chin passes handles.",
      "Lower under complete control."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_lat_pulldown_wide",
    "name": "Wide-Grip Lat Pulldown",
    "description": "Cable machine vertical pull isolating the latissimus dorsi with adjustable resistance.",
    "equipment": "cable",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Sit facing machine with thighs secured under pads. Grasp bar wide with overhand grip.",
      "Lean back slightly (10-15 degrees), pull bar down toward upper chest touching collarbones.",
      "Squeeze lats at bottom, allow bar to return smoothly to full overhead stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_lat_pulldown_close_grip",
    "name": "Close-Grip Lat Pulldown (V-Bar)",
    "description": "Close neutral-grip cable pulldown allowing deep lat stretch and long range of motion.",
    "equipment": "cable",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Attach V-bar handle to pulldown cable. Secure thighs.",
      "Pull handle down to upper chest, keeping elbows tight to body.",
      "Elevate arms slowly to feel extreme lat stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_lat_pulldown_reverse_grip",
    "name": "Reverse-Grip Lat Pulldown",
    "description": "Underhand pulldown variation increasing bicep leverage and targeting lower lats.",
    "equipment": "cable",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Grip straight bar shoulder-width with palms facing you.",
      "Pull down to mid-chest with elbows driving back and down.",
      "Control the ascent to full stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_seated_cable_row",
    "name": "Seated Cable Row (V-Bar)",
    "description": "Horizontal cable row building mid-back thickness, rhomboids, and lower lats.",
    "equipment": "cable",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Sit on bench with feet on footplates, knees slightly bent. Grasp V-bar handle.",
      "Sit upright with chest proud. Pull handle into navel, driving elbows back.",
      "Squeeze mid-back tightly, then extend arms with slight forward hinge stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_single_arm_dumbbell_row",
    "name": "Single-Arm Dumbbell Row",
    "description": "Unilateral free-weight row correcting muscular imbalances and allowing immense stretch.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Place one knee and hand on flat bench, torso parallel to floor.",
      "Hold dumbbell with free hand hanging straight down.",
      "Pull dumbbell in an arc toward hip, driving elbow to ceiling.",
      "Lower under control to a deep lat stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_meadows_row",
    "name": "Meadows Row (Landmine)",
    "description": "Overhand landmine row developed by John Meadows to blast the upper lats, teres major, and rear delts.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Stand perpendicular to end of landmine bar in staggered stance.",
      "Grip the thick collar with an overhand grip.",
      "Row the elbow up and out to side, achieving deep squeeze in upper lat and teres.",
      "Lower slowly to floor stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_kroc_row",
    "name": "Kroc Row (Heavy High-Rep Dumbbell Row)",
    "description": "Heavy high-rep dumbbell row incorporating controlled body English to build grip and back mass.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Brace with hand on dumbbell rack or bench.",
      "Using a heavy dumbbell, explode elbow toward hip for 15-25 brutal reps with full stretch at bottom."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_t_bar_row_chest_supported",
    "name": "Chest-Supported T-Bar Row",
    "description": "Eliminates lower back fatigue entirely, allowing pure mid-back and upper lat isolation.",
    "equipment": "machine",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Lie chest-down on angled pad. Grasp handles with preferred width grip.",
      "Pull weight up by driving elbows back, retracting shoulder blades fully.",
      "Lower smoothly without allowing weight to rest between reps."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_t_bar_row_free_weight",
    "name": "T-Bar Row (Free-Weight)",
    "description": "Classic heavy back builder requiring strong spinal erectors and hamstring stabilization.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Straddle landmine bar with V-handle underneath collar.",
      "Hinge hips at 45 degrees, pull handle to lower abdomen, keeping spine neutral.",
      "Lower to complete stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_chest_supported_machine_row",
    "name": "Chest-Supported Machine Row",
    "description": "Guided horizontal row with chest pad ensuring zero lower back strain.",
    "equipment": "machine",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Adjust chest pad and seat height so handles align with mid-chest.",
      "Pull handles back smoothly, squeezing shoulder blades together.",
      "Control the weight stack back to starting stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_straight_arm_cable_pulldown",
    "name": "Straight-Arm Cable Pulldown",
    "description": "Pure lat isolation movement eliminating biceps involvement via extended elbows.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Stand facing high cable with straight or rope attachment. Grasp with arms extended.",
      "Hinge forward slightly at hips. With straight arms, sweep bar down in an arc to thighs.",
      "Contract lats hard at bottom, then return slowly to forehead height."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_dumbbell_pullover",
    "name": "Dumbbell Pullover",
    "description": "Classic exercise expanding ribcage and providing loaded eccentric stretch to the lats and serratus.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Lie perpendicular across bench with upper back supported, hips lowered slightly.",
      "Hold dumbbell with palms flat under top plate over chest.",
      "Lower dumbbell back over head in an arc until deep lat stretch is achieved.",
      "Pull dumbbell back over chest using lats."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_single_arm_cable_lat_pulldown",
    "name": "Single-Arm Kneeling Cable Lat Pulldown",
    "description": "Unilateral cable pulldown aligning line of pull directly with individual lat fiber angles.",
    "equipment": "cable",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Half-kneel facing cable tower with single handle attached high.",
      "Reach up to full stretch, pull elbow down tight to ribcage.",
      "Pause and squeeze lower lat, return slowly."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_inverted_row",
    "name": "Inverted Row (Australian Pull-Up)",
    "description": "Horizontal bodyweight pull on barbell or rings developing mid-back control and posture.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Set barbell in rack at waist height. Hang underneath with heels on floor.",
      "Maintain rigid straight plank body line. Pull chest up to touch bar.",
      "Lower under control to full arm hang."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_rack_pull",
    "name": "Rack Pull (Block Pull)",
    "description": "Partial deadlift from knee height overloading the upper back, traps, and spinal erectors.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Set bar on safety pins just below or at knee level.",
      "Hinge hips back, brace core, and drive through hips to full upright lockout.",
      "Lower bar to pins under control."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_good_morning_barbell",
    "name": "Barbell Good Morning",
    "description": "Hip hinge movement placing enormous eccentric overload on spinal erectors and hamstrings.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Place barbell across upper back as in a squat. Soften knees slightly.",
      "Hinge hips backward keeping spine locked flat until torso is near parallel.",
      "Drive hips forward to return to standing."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_hyperextension_back",
    "name": "Back Extension (Hyperextension Bench)",
    "description": "Focused spinal extension exercise isolating lower back erectors with glute/hamstring assistance.",
    "equipment": "bodyweight",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Set pad at hip level on 45-degree bench. Cross arms over chest.",
      "Bend forward at waist with neutral spine, then extend back up until body is straight."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_reverse_hyperextension",
    "name": "Reverse Hyperextension",
    "description": "Decompresses the lumbar spine while strengthening lower back, glutes, and hamstrings.",
    "equipment": "machine",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Lie face down on machine with legs hanging. Grip handles firmly.",
      "Swing legs up until parallel with torso, squeezing glutes and lower back.",
      "Lower smoothly into spinal decompression."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_snatch_grip_deadlift",
    "name": "Snatch-Grip Deadlift",
    "description": "Extra-wide grip deadlift creating extended range of motion and exceptional upper trap/lat demand.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Take a very wide collar-to-collar grip on barbell.",
      "Drop hips lower than conventional deadlift, pull bar smoothly from floor to full hip extension."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_seal_row",
    "name": "Seal Row (Barbell on Elevated Bench)",
    "description": "Bench elevated on blocks allowing dead-hang barbell row with zero lower back strain.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Lie face down on horizontal bench elevated on boxes or pins.",
      "Pull barbell straight up to touch underside of bench, driving elbows to ceiling.",
      "Lower to full hang stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_neutral_grip_dumbbell_row",
    "name": "Two-Arm Neutral Grip Dumbbell Row (Chest Supported)",
    "description": "Angled bench row with dumbbells allowing independent arm path and deep squeeze.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Set incline bench to 30-45 degrees, lie prone with dumbbells in hands.",
      "Pull elbows back along ribcage, squeezing mid-back and lats.",
      "Lower slowly to full stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_barbell_shrug",
    "name": "Barbell Shrug",
    "description": "Heavy overload for the upper trapezius fibers to build thick neck and shoulder yoke.",
    "equipment": "barbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Hold barbell at arm length in front of thighs with shoulder-width grip.",
      "Elevate shoulders straight up toward ears without rolling shoulders.",
      "Hold peak trap contraction for 1 second, lower slowly."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_dumbbell_shrug",
    "name": "Dumbbell Shrug",
    "description": "Allows arms to hang naturally at sides for optimal line of upper trapezius pull.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Hold dumbbells at sides with palms facing inward.",
      "Shrug shoulders directly upward toward ears, pause at top, lower under control."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_cable_shrug",
    "name": "Cable Shrug",
    "description": "Constant tension trap elevation using low pulley with straight or angled bar.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Attach bar to low pulley. Stand tall and elevate shoulders against continuous cable resistance."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_behind_back_barbell_shrug",
    "name": "Behind-the-Back Barbell Shrug",
    "description": "Barbell held behind thighs for enhanced middle and upper trapezius fiber recruitment.",
    "equipment": "barbell",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Hold barbell behind glutes with overhand grip.",
      "Shrug shoulders upward and slightly backward, pausing at peak contraction."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_lat_pulldown_behind_neck",
    "name": "Lat Pulldown Behind Neck",
    "description": "Classic vertical pull emphasizing lower traps, rhomboids, and teres with strict form.",
    "equipment": "cable",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Sit facing pulldown machine, pull bar smoothly behind head to base of neck.",
      "Do not thrust neck forward. Lower under control."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_v_bar_lat_pulldown",
    "name": "V-Bar Lat Pulldown (Dual Handles)",
    "description": "Dual D-handle or V-bar pulldown offering wrist freedom and deep lat activation.",
    "equipment": "cable",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Pull handles down to upper chest, flared elbows rotating slightly inward at bottom squeeze."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "back"
  },
  {
    "id": "ex_barbell_overhead_press",
    "name": "Barbell Overhead Press (Military Press)",
    "description": "The definitive vertical push compound exercise building shoulder mass and full-body stabilization.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Stand with feet hip-width apart. Hold barbell across collarbones with hands just outside shoulders.",
      "Squeeze glutes and brace core. Press bar overhead in a vertical line, moving head back slightly to clear chin.",
      "Lock out arms overhead with bar directly over mid-foot. Lower under control."
    ],
    "imageUrl": null,
    "videoUrl": "https://www.youtube.com/embed/2yjwXTZQDDI",
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_seated_dumbbell_shoulder_press",
    "name": "Seated Dumbbell Shoulder Press",
    "description": "Seated overhead press isolating deltoids with free range of motion and back support.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Sit on upright bench. Kick dumbbells to shoulder height with palms facing forward or slightly angled.",
      "Press dumbbells upward in an arc meeting overhead without clashing.",
      "Lower weights under control until hands reach ear level."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_standing_dumbbell_shoulder_press",
    "name": "Standing Dumbbell Shoulder Press",
    "description": "Standing overhead press demanding substantial core bracing and stabilizer recruitment.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Stand tall with dumbbells at shoulders, press vertically overhead while bracing glutes and abs."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_arnold_press",
    "name": "Arnold Press",
    "description": "Rotating dumbbell press hitting all three deltoid heads through an extended range of motion.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Sit upright holding dumbbells in front of shoulders with palms facing you (as at top of curl).",
      "As you press upward, rotate wrists so palms face forward at top of movement.",
      "Reverse rotation smoothly on the way down."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_behind_neck_press",
    "name": "Behind-the-Neck Barbell Press",
    "description": "Advanced shoulder press emphasizing lateral deltoids and upper back.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Grip barbell wide. Lower carefully to base of neck with upright posture, press to lockout."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_push_press_barbell",
    "name": "Barbell Push Press",
    "description": "Dynamic overhead press using leg drive to propel heavy loads overhead.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Dip knees 2-3 inches with vertical torso, then explosively drive legs and press bar overhead."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_machine_shoulder_press",
    "name": "Machine Shoulder Press",
    "description": "Guided overhead press maximizing deltoid overload without balance restrictions.",
    "equipment": "machine",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Adjust seat so handles start at ear height. Press handles upward to near-lockout."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_smith_machine_overhead_press",
    "name": "Smith Machine Overhead Press",
    "description": "Strict vertical pressing along guided track allowing safe training to failure.",
    "equipment": "smith_machine",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Set bench under bar. Unhook bar, lower to chin height, press upward smoothly."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_dumbbell_lateral_raise",
    "name": "Dumbbell Lateral Raise",
    "description": "The cornerstone isolation exercise for lateral deltoid width and shoulder capping.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Stand with dumbbells at sides, slight forward torso lean (10-15 degrees).",
      "Raise arms out to sides leading with elbows until parallel to floor.",
      "Pour water forward slightly at top, pause, and lower slowly without swinging."
    ],
    "imageUrl": null,
    "videoUrl": "https://www.youtube.com/embed/3VcKaXpzqRo",
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_cable_lateral_raise",
    "name": "Cable Lateral Raise",
    "description": "Continuous resistance lateral raise providing peak tension at the bottom of the movement.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Set low pulley. Stand with cable passing behind or in front of body.",
      "Raise handle out to shoulder height with slight elbow bend. Control the descent."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_leaning_cable_lateral_raise",
    "name": "Leaning Cable Lateral Raise",
    "description": "Leaning away from cable pillar to overload the stretched position of the lateral deltoid.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Hold cable pole with inside hand and lean torso outward at a 30-degree angle.",
      "Raise cable handle out to side, achieving deep contraction with zero momentum."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_machine_lateral_raise",
    "name": "Machine Lateral Raise",
    "description": "Padded elbow lever machine completely removing forearm and grip fatigue from side delts.",
    "equipment": "machine",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Sit with pads against outer elbows. Drive elbows outward and upward to shoulder height.",
      "Hold peak squeeze for 1 second, lower slowly."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_behind_back_cable_lateral_raise",
    "name": "Behind-the-Back Cable Lateral Raise",
    "description": "Cable routed behind the back to initiate pull directly in the scapular plane.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Attach D-handle to low pulley. Stand with cable passing behind glutes.",
      "Abduct arm out to side smoothly to parallel."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_dumbbell_front_raise",
    "name": "Dumbbell Front Raise",
    "description": "Isolated shoulder flexion focusing on the anterior deltoid head.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Hold dumbbells in front of thighs with overhand grip.",
      "Raise one or both dumbbells straight forward to eye level without arching back.",
      "Lower under control."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_barbell_front_raise",
    "name": "Barbell Front Raise",
    "description": "Two-handed bilateral barbell front raise building anterior deltoid density.",
    "equipment": "barbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Hold barbell across thighs. Raise bar forward with straight arms to shoulder height."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_cable_front_raise",
    "name": "Cable Front Raise (Rope or Bar)",
    "description": "Continuous tension anterior deltoid raise using low pulley cable.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Straddle low cable with rope attachment between legs. Raise arms forward to eye level."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_face_pull_rope",
    "name": "Face Pull (Rope Attachment)",
    "description": "Crucial shoulder health movement targeting rear delts, external rotators, and mid traps.",
    "equipment": "cable",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Set cable at upper chest or eye level with rope. Grip rope with thumbs pointing backward.",
      "Step back, pull hands toward eyes/ears while rotating wrists back so knuckles face ceiling.",
      "Squeeze rear delts and mid-traps hard, lower with control."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_rear_delt_dumbbell_fly",
    "name": "Rear Delt Dumbbell Fly (Bent-Over)",
    "description": "Bent-over lateral raise targeting the posterior deltoids and rhomboids.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Hinge at hips with torso parallel to floor or seated chest-to-knees.",
      "Raise dumbbells out to sides leading with pinkies and rear delts.",
      "Squeeze posterior shoulders at top, lower smoothly."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_rear_delt_cable_fly",
    "name": "Rear Delt Cable Fly (High to Low / Standing)",
    "description": "Cross-cable rear delt pull providing smooth resistance across the entire arc.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Stand between cables without handles, grasping bare carabiners with opposite hands (cross cable).",
      "Pull arms back and outward across chest height squeezing rear delts."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_machine_reverse_pec_deck",
    "name": "Machine Reverse Pec Deck (Rear Delt Fly)",
    "description": "Guided rear deltoid isolation eliminating body sway and balance requirements.",
    "equipment": "machine",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Sit chest against pad, handles adjusted all the way back.",
      "Grasp handles with neutral or overhand grip, push arms outward and backward until rear delts fully contract."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_rear_delt_cable_crossover",
    "name": "Cable Rear Delt Crossover (Seated Bench)",
    "description": "Seated variation isolating rear deltoids with complete upper body stabilization.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Sit on upright bench facing cable cross. Pull cables across in horizontal plane."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_barbell_upright_row",
    "name": "Barbell Upright Row",
    "description": "Pulling movement building lateral deltoids and upper trapezius thickness.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Grip barbell with hands shoulder-width apart (avoid very narrow grip).",
      "Pull bar up along torso leading with elbows up to chest height.",
      "Lower smoothly under control."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_dumbbell_upright_row",
    "name": "Dumbbell Upright Row",
    "description": "Allows independent hand freedom to prevent shoulder internal rotation impingement.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Hold dumbbells in front of thighs. Pull elbows high and wide to shoulder level."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_cable_upright_row",
    "name": "Cable Upright Row (Rope Attachment)",
    "description": "Rope attachment allows hands to separate at peak contraction for maximum side delt recruitment.",
    "equipment": "cable",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Attach rope to low pulley. Pull upward, spreading rope ends apart at collarbone level."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_cuban_press",
    "name": "Cuban Press (Dumbbell)",
    "description": "Combines upright row, external rotation, and overhead press for complete shoulder armor.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Upright row dumbbells to chest height, externally rotate forearms up to 90 degrees, press overhead.",
      "Reverse all three steps under strict control."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_lu_raises",
    "name": "Lu Raises (Full Range Lateral Raise)",
    "description": "Full overhead lateral raise developed by Chinese Olympic weightlifters for shoulder mobility.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Start with light dumbbells at sides. Raise arms in a wide arc all the way overhead until dumbbells touch.",
      "Lower along the same arc with control."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_plate_front_raise",
    "name": "Plate Front Raise (Steering Wheel)",
    "description": "Weight plate raise providing grip strength and isometric rotational challenge to deltoids.",
    "equipment": "barbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Hold weight plate at 9 and 3 o'clock. Raise to eye level and rotate slightly like a steering wheel."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_landmine_shoulder_press",
    "name": "Landmine Single-Arm Shoulder Press",
    "description": "Angled overhead press sparing the subacromial joint while blasting the front and side delts.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Hold tip of landmine barbell at shoulder. Press upward and forward in a natural arc to full extension."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "shoulders"
  },
  {
    "id": "ex_barbell_biceps_curl",
    "name": "Barbell Biceps Curl",
    "description": "The premier mass builder for the biceps brachii using heavy bilateral progressive overload.",
    "equipment": "barbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Stand tall holding barbell with shoulder-width underhand grip, elbows pinned to sides.",
      "Curl the bar upward by flexing elbows while keeping upper arms motionless.",
      "Squeeze biceps hard at top contraction, lower slowly over 2-3 seconds."
    ],
    "imageUrl": null,
    "videoUrl": "https://www.youtube.com/embed/ykJmrZ5v0Oo",
    "targetRegionId": "arms"
  },
  {
    "id": "ex_dumbbell_biceps_curl",
    "name": "Dumbbell Biceps Curl (Supinating)",
    "description": "Allows wrists to rotate from neutral to fully supinated, maximizing biceps recruitment.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Start with dumbbells at sides, palms facing in.",
      "As you curl upward, rotate wrists so palms face ceiling at peak contraction.",
      "Lower under control reversing the rotation."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_incline_dumbbell_curl",
    "name": "Incline Dumbbell Curl",
    "description": "Places the long head of the biceps on deep stretch behind the torso for maximum hypertrophy.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Sit on bench inclined to 45-60 degrees with arms hanging straight down.",
      "Curl dumbbells upward without letting elbows swing forward.",
      "Lower slowly to full bottom stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_dumbbell_hammer_curl",
    "name": "Dumbbell Hammer Curl",
    "description": "Neutral grip curl prioritizing the brachialis and brachioradialis for arm thickness.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Hold dumbbells with palms facing each other (neutral grip).",
      "Curl dumbbells up to shoulder height maintaining thumbs-up position.",
      "Squeeze forearm and outer upper arm at top, lower slowly."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_cable_hammer_curl_rope",
    "name": "Cable Hammer Curl (Rope)",
    "description": "Continuous cable tension on the brachialis and forearms throughout the entire range.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Attach rope to low pulley. Hold with neutral grip, elbows tucked at sides.",
      "Curl upward, pulling rope ends slightly outward at top contraction."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_preacher_curl_ez_bar",
    "name": "EZ-Bar Preacher Curl",
    "description": "Strict bicep isolation eliminating body momentum and targeting the lower biceps stretch.",
    "equipment": "barbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Sit at preacher bench with armpits snug against pad. Hold EZ-bar with inner grip.",
      "Lower bar slowly until arms are nearly fully extended.",
      "Curl bar up to vertical forearm position, squeezing hard."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_preacher_curl_dumbbell",
    "name": "Single-Arm Dumbbell Preacher Curl",
    "description": "Unilateral preacher curl fixing arm imbalances with pure bicep focus.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Rest one arm over preacher pad holding dumbbell.",
      "Lower dumbbell under control to full elbow extension, curl up smoothly."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_spider_curl",
    "name": "Spider Curl (Chest-Supported Incline)",
    "description": "Chest supported on incline bench with arms hanging vertically for extreme peak contraction.",
    "equipment": "barbell",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Lie face down on 45-degree incline bench with arms hanging straight down holding EZ-bar.",
      "Curl bar upward without allowing elbows to drift back, focusing on peak bicep squeeze."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_concentration_curl",
    "name": "Concentration Curl",
    "description": "Classic seated curl bracing elbow against inner thigh to eliminate all cheating.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Sit on bench, brace tricep against inner thigh.",
      "Curl dumbbell up toward face, supinating wrist at top squeeze."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_cable_biceps_curl",
    "name": "Standing Cable Biceps Curl (Straight Bar)",
    "description": "Continuous tension cable curl keeping biceps under constant load from start to finish.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Attach straight bar to low pulley. Stand tall, elbows tucked, curl bar up to chest."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_high_cable_curl_hercules",
    "name": "High Cable Curl (Hercules Curl)",
    "description": "Dual high pulley bicep curl mimicking front double bicep bodybuilding pose.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Stand between high pulleys, arms extended parallel to floor holding stirrup handles.",
      "Curl handles inward toward ears while keeping upper arms horizontal to floor."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_reverse_barbell_curl",
    "name": "Reverse Barbell Curl",
    "description": "Overhand grip curl targeting the brachioradialis, forearms, and brachialis.",
    "equipment": "barbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Hold barbell with overhand (pronated) grip shoulder-width.",
      "Curl bar up without letting wrists flex back, lower slowly."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_reverse_cable_curl",
    "name": "Reverse Cable Curl",
    "description": "Overhand cable curl delivering smooth resistance across the forearm and brachialis.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Attach bar to low pulley with pronated overhand grip. Curl smoothly to upper chest."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_ez_bar_21s_curl",
    "name": "EZ-Bar 21s Biceps Curl",
    "description": "High-volume fatigue protocol: 7 lower-half reps, 7 upper-half reps, 7 full reps.",
    "equipment": "barbell",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Perform 7 reps from bottom to 90 degrees, immediately 7 reps from 90 degrees to top, then 7 full range reps."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_machine_preacher_curl",
    "name": "Machine Preacher Curl",
    "description": "Pin-loaded preacher curl with cam profile matching human strength curve.",
    "equipment": "machine",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Sit with chest against pad, grasp handles, curl upward smoothly through guided arc."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_close_grip_barbell_bench_press",
    "name": "Close-Grip Barbell Bench Press",
    "description": "Heavy compound press shifting maximum mechanical tension onto the triceps brachii.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Lie on flat bench. Grip bar with hands shoulder-width apart (not touching to protect wrists).",
      "Lower bar to lower chest while keeping elbows tucked close to ribcage.",
      "Drive upward through triceps lockout."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_triceps_rope_pushdown",
    "name": "Triceps Rope Pushdown",
    "description": "Cable pushdown allowing flare-out at bottom to recruit the lateral triceps head.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Attach rope to high pulley. Stand with slight forward torso lean, elbows tucked at sides.",
      "Push rope down and spread ends apart at bottom lockout.",
      "Return slowly to 90 degrees elbow bend."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_straight_bar_triceps_pushdown",
    "name": "Straight-Bar Triceps Pushdown",
    "description": "Allows heavier loading than rope to build raw triceps pressing power.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Grip straight bar on high pulley with overhand grip. Push down forcefully to lockout."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_v_bar_triceps_pushdown",
    "name": "V-Bar Triceps Pushdown",
    "description": "Angled V-bar providing wrist-friendly ergonomics for heavy triceps pushdowns.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Grip V-bar handle on high cable. Push downward through palms to full elbow extension."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_skull_crushers_lying_triceps_extension",
    "name": "Skull Crushers (EZ-Bar Lying Triceps Extension)",
    "description": "Classic lying triceps extension isolating the long and medial heads under deep stretch.",
    "equipment": "barbell",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Lie flat holding EZ-bar with narrow grip extended over chest.",
      "Hinge at elbows, lowering bar toward forehead or slightly behind crown of head.",
      "Extend elbows back to starting position without letting upper arms swing."
    ],
    "imageUrl": null,
    "videoUrl": "https://www.youtube.com/embed/d_KZxkY_0cM",
    "targetRegionId": "arms"
  },
  {
    "id": "ex_overhead_dumbbell_triceps_extension",
    "name": "Overhead Dumbbell Triceps Extension (Seated Two-Arm)",
    "description": "Places triceps long head on maximum anatomical stretch behind the neck.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Sit on bench holding one heavy dumbbell vertically overhead with both hands cupping top plate.",
      "Lower weight behind head by flexing elbows, keeping upper arms close to ears.",
      "Press upward back to full overhead extension."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_overhead_cable_triceps_extension",
    "name": "Overhead Cable Triceps Extension (Rope)",
    "description": "Facing away from cable tower to keep continuous loaded stretch on the long head.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Set pulley at chest height. Grasp rope, turn away and lean forward into staggered stance.",
      "Extend arms overhead, spreading rope ends apart at full lockout."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_triceps_dips_upright",
    "name": "Triceps Dips (Upright Torso)",
    "description": "Parallel bar dip with vertical torso and elbows tucked back to target triceps.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Support body on parallel bars with upright torso and legs straight down.",
      "Lower body by bending elbows backward until arms reach 90 degrees.",
      "Push upward through triceps lockout."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_bench_dips",
    "name": "Bench Dips",
    "description": "Accessible triceps dip placing hands on bench behind body.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Place hands on edge of bench, feet flat or on opposite bench in front of you.",
      "Lower hips down in front of bench until elbows reach 90 degrees, press up."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_single_arm_cable_triceps_kickback",
    "name": "Single-Arm Cable Triceps Kickback",
    "description": "Maintains tension through full shoulder extension without dead spots.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Set cable at hip height without handle (hold bare cable). Hinge torso forward.",
      "Keep upper arm parallel to floor, extend forearm back until arm is locked straight."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_dumbbell_triceps_kickback",
    "name": "Dumbbell Triceps Kickback",
    "description": "Free weight isolation providing peak contraction in full elbow and shoulder extension.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Brace on bench, upper arm pinned parallel to torso.",
      "Kick dumbbell back until arm is completely straight, pause 1 second."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_jm_press",
    "name": "JM Press (Hybrid Bench & Extension)",
    "description": "Powerlifting hybrid combining close-grip bench press with triceps extension for immense overload.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Hold bar over upper chest. Lower bar toward neck/throat by bending elbows and letting them flare slightly forward.",
      "Press up forcefully with pure triceps drive."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_tate_press",
    "name": "Tate Press (Dumbbell Triceps Extension)",
    "description": "Lying dumbbell extension flaring elbows outward to target the medial and lateral triceps.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Lie flat with dumbbells touching over chest, palms facing feet with elbows flared out.",
      "Lower weights inward toward chest by bending elbows, press outward back to top."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_barbell_wrist_curl",
    "name": "Barbell Wrist Curl (Seated)",
    "description": "Forearm flexor builder performed resting forearms across thighs.",
    "equipment": "barbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Sit on bench resting forearms on thighs with wrists hanging off knees, palms facing up.",
      "Lower bar down into fingertips, then curl wrists upward as high as possible."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_barbell_reverse_wrist_curl",
    "name": "Barbell Reverse Wrist Curl",
    "description": "Forearm extensor exercise building top-of-forearm density and wrist durability.",
    "equipment": "barbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Rest forearms on thighs with palms facing down. Curl wrists upward toward ceiling."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_dumbbell_wrist_curl",
    "name": "Dumbbell Wrist Curl (Single-Arm)",
    "description": "Unilateral wrist curl allowing independent range of motion and wrist flexor focus.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Rest forearm on bench with wrist over edge, curl dumbbell up and down smoothly."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_farmers_walk",
    "name": "Farmer's Walk (Heavy Carry)",
    "description": "Heavy loaded carry building crushing grip, forearm thickness, upper traps, and core stability.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Deadlift heavy dumbbells or farmer handles. Stand tall with shoulders packed and chest up.",
      "Walk forward with smooth, controlled steps for distance or time, fighting any torso sway."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "arms"
  },
  {
    "id": "ex_barbell_back_squat_high_bar",
    "name": "Barbell Back Squat (High Bar)",
    "description": "The king of quad builders, demanding knee flexion and deep ankle mobility with bar on traps.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Rest barbell high across upper trapezius. Stand with feet slightly wider than shoulder-width, toes turned 15-30 degrees.",
      "Inhale deep into abdomen, break at hips and knees simultaneously.",
      "Descend until hip crease is below top of knees, keeping chest proud and knees tracking over toes.",
      "Drive powerfully out of the hole through mid-foot."
    ],
    "imageUrl": null,
    "videoUrl": "https://www.youtube.com/embed/bEv6CCg2BC8",
    "targetRegionId": "legs"
  },
  {
    "id": "ex_barbell_back_squat_low_bar",
    "name": "Barbell Back Squat (Low Bar)",
    "description": "Powerlifting squat style resting bar across rear delts to recruit maximum posterior chain power.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Rest bar across rear delts/scapular spine. Lean torso forward slightly more than high bar.",
      "Sit back into hips, descend to parallel, drive up leading with hips."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_front_squat_barbell",
    "name": "Barbell Front Squat",
    "description": "Bar resting on anterior deltoids forcing an upright torso and extreme quadriceps focus.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Rest bar across clavicles and front delts in clean grip or cross-arm grip with elbows driven high.",
      "Descend straight down between knees keeping torso vertical.",
      "Drive out of hole without dropping elbows."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_zercher_squat",
    "name": "Zercher Squat (Bar in Crooks of Elbows)",
    "description": "Bar cradled in the crooks of elbows, building unbreakable core strength and quad drive.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Cradle barbell in crooks of elbows against chest with hands clasped.",
      "Squat deep between knees keeping upright posture, drive up forcefully."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_safety_bar_squat",
    "name": "Safety Bar Squat (SSB)",
    "description": "Yoke bar sparing shoulders and wrists while maintaining upright quad-heavy mechanics.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Grip handles of Safety Squat Bar resting on shoulders.",
      "Squat under control, resisting bar's tendency to pitch torso forward."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_hack_squat_machine",
    "name": "Hack Squat (Machine)",
    "description": "Supported back sled eliminating spinal balance, allowing complete quadriceps failure safely.",
    "equipment": "machine",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Position back flat against pad, shoulders under shoulder pads. Feet shoulder-width on platform.",
      "Release safety handles, descend until knees achieve deep flexion (below 90 degrees).",
      "Press platform away driving through mid-foot."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_leg_press_45_degree",
    "name": "45-Degree Leg Press",
    "description": "Heavy plate-loaded leg press allowing immense quadriceps and glute loading with fixed spine.",
    "equipment": "machine",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Sit firmly in seat with lower back pinned against pad. Place feet shoulder-width on sled.",
      "Lower sled until knees reach 90 degrees without rounding lower back off pad.",
      "Press sled back up without hyperextending or locking knees."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_dumbbell_walking_lunge",
    "name": "Dumbbell Walking Lunge",
    "description": "Dynamic unilateral leg builder testing single-leg strength, balance, and glute-quad coordination.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Hold dumbbells at sides. Step forward into lunge, lowering back knee until hovering above floor.",
      "Drive through front heel to step directly forward into next lunge stride."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_reverse_lunge_dumbbell",
    "name": "Dumbbell Reverse Lunge",
    "description": "Knee-friendly lunge variation stepping backward to preserve patellar tendon comfort.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Step backward with one leg, lower hips until front thigh is parallel to floor.",
      "Drive through front heel to return to standing."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_bulgarian_split_squat",
    "name": "Bulgarian Split Squat (Rear-Foot Elevated)",
    "description": "The premier single-leg exercise placing devastating hypertrophy stimulus on quads and glutes.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Rest laces of back foot on bench behind you. Front foot planted 2-3 feet in front.",
      "Descend until back knee nearly touches floor, front knee bent 90 degrees.",
      "Drive up through front heel to return to top."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_goblet_squat",
    "name": "Goblet Squat (Dumbbell or Kettlebell)",
    "description": "Accessible squat teaching perfect upright posture and deep hip mobility.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Hold dumbbell vertically against chest with elbows pointing down.",
      "Squat deep between knees, pushing knees out, drive up through heels."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_sissy_squat_bodyweight",
    "name": "Sissy Squat (Bodyweight / Bench)",
    "description": "Extreme knee flexion isolation movement providing loaded stretch across the rectus femoris.",
    "equipment": "bodyweight",
    "movementType": "isolation",
    "difficulty": "advanced",
    "instructions": [
      "Lock shins into sissy squat bench or hold sturdy post.",
      "Lean torso back while driving knees forward to achieve complete quad stretch, press up."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_leg_extension_machine",
    "name": "Leg Extension (Machine)",
    "description": "Open-chain knee extension isolating the rectus femoris and vastus muscles in peak contraction.",
    "equipment": "machine",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Adjust back pad so knees align with machine pivot. Pad resting on lower shins.",
      "Extend knees until legs are straight, squeezing quads hard for 1 second at top.",
      "Lower weight under control to 90 degrees."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_romanian_deadlift_barbell",
    "name": "Barbell Romanian Deadlift (RDL)",
    "description": "Gold standard posterior chain builder focusing on loaded eccentric stretch of the hamstrings.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Stand tall holding barbell with overhand grip, knees slightly unlocked (soft).",
      "Push hips backward as far as possible while keeping bar brushing down thighs.",
      "Lower until deep stretch is felt in hamstrings (mid-shin level), keeping back flat.",
      "Drive hips forward to return to standing."
    ],
    "imageUrl": null,
    "videoUrl": "https://www.youtube.com/embed/2SHsk9AzdjA",
    "targetRegionId": "legs"
  },
  {
    "id": "ex_romanian_deadlift_dumbbell",
    "name": "Dumbbell Romanian Deadlift",
    "description": "Dumbbell variation allowing dumbbells to track beside legs for lower back comfort.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Hold dumbbells in front of thighs, hinge hips back until deep hamstring stretch, drive forward."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_stiff_legged_deadlift",
    "name": "Stiff-Legged Deadlift (From Floor)",
    "description": "Starting from the floor with higher hips to maximize hamstring and lower back range.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Set up with knees almost straight, hips elevated high. Pull bar off floor using pure posterior chain."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_lying_leg_curl_machine",
    "name": "Lying Leg Curl (Machine)",
    "description": "Isolates the knee flexion function of the hamstrings across both heads.",
    "equipment": "machine",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Lie face down on machine with pad against lower calves/Achilles tendon.",
      "Curl heels toward glutes without lifting hips off pad.",
      "Hold peak squeeze for 1 second, lower smoothly over 3 seconds."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_seated_leg_curl_machine",
    "name": "Seated Leg Curl (Machine)",
    "description": "Places hip in 90 degrees flexion, lengthening hamstrings for superior muscle hypertrophy.",
    "equipment": "machine",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Sit firmly with thigh pad locked down tight. Pad resting on lower calves.",
      "Curl heels down and back under seat to full contraction.",
      "Control the eccentric return feeling deep hamstring stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_standing_single_leg_curl",
    "name": "Standing Single-Leg Curl",
    "description": "Unilateral machine curl evening out hamstring strength disparities between limbs.",
    "equipment": "machine",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Brace torso against pad, curl single heel up toward glute with smooth squeeze."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_nordic_hamstring_curl",
    "name": "Nordic Hamstring Curl",
    "description": "Bodyweight eccentric powerhouse proven to maximize hamstring hypertrophy and injury prevention.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Kneel on pad with ankles anchored firmly behind you. Keep hips fully extended in a line.",
      "Slowly lower body forward toward floor, resisting gravity purely with hamstrings.",
      "Catch yourself with hands on floor, push lightly back up."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_glute_ham_raise_ghr",
    "name": "Glute-Ham Raise (GHR)",
    "description": "Integrates both knee flexion and hip extension functions of the posterior chain simultaneously.",
    "equipment": "machine",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Mount GHR bench with feet locked between rollers and knees on curved pad.",
      "Lower torso forward to horizontal, then bend knees pulling body back upright."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_step_up_dumbbell",
    "name": "Dumbbell Step-Up",
    "description": "Functional single-leg drive onto box building unilateral quad power and glute drive.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Hold dumbbells at sides facing sturdy box or bench.",
      "Place entire foot on box, drive through heel to stand tall on top without bouncing off trailing foot.",
      "Lower back down under control."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_box_squat_barbell",
    "name": "Barbell Box Squat",
    "description": "Squatting to a box breaks the stretch-shortening cycle to build explosive hip drive.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Squat back until sitting gently on box without rocking. Pause, explode upward through heels."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_standing_calf_raise_machine",
    "name": "Standing Calf Raise (Machine)",
    "description": "Full knee extension calf raise maximizing tension on the gastrocnemius.",
    "equipment": "machine",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Place balls of feet on block, shoulders under pads, knees locked straight.",
      "Lower heels into deep calf stretch, explode upward onto big toes.",
      "Hold peak calf contraction for 2 seconds before descending."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_seated_calf_raise_machine",
    "name": "Seated Calf Raise (Machine)",
    "description": "Bent knee position slacks the gastrocnemius, isolating the deep soleus muscle.",
    "equipment": "machine",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Sit with knees under pad bent at 90 degrees. Balls of feet on block.",
      "Lower heels to full ankle stretch, drive upward onto toes, pause."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_leg_press_calf_raise",
    "name": "Leg Press Calf Raise (Toe Press)",
    "description": "Straight-leg calf extension on leg press sled allowing heavy, safe progressive overload.",
    "equipment": "machine",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Place balls of feet on lower edge of leg press platform with heels hanging free.",
      "Press sled forward through ankle extension, lower under deep stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_donkey_calf_raise",
    "name": "Donkey Calf Raise",
    "description": "Bent-over hip angle prestretches the hamstrings and gastrocnemius for peak calf activation.",
    "equipment": "machine",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Bend forward at hips resting weight pad across sacrum. Raise heels high, lower to stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_single_leg_dumbbell_calf_raise",
    "name": "Single-Leg Dumbbell Calf Raise",
    "description": "Unilateral standing calf raise fixing left-to-right ankle strength imbalances.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Stand on one foot on step holding dumbbell in same-side hand.",
      "Drop heel into deep stretch, drive up high on big toe."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_tibialis_anterior_raise_wall",
    "name": "Tibialis Anterior Raise (Wall Lean)",
    "description": "Crucial shin muscle strengthener protecting knees and improving ankle dorsiflexion.",
    "equipment": "bodyweight",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Lean upper back against wall with legs extended in front.",
      "Flex toes upward toward shins as high as possible, hold 1 second, lower slowly."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_tibialis_anterior_cable_pull",
    "name": "Tibialis Anterior Cable Pull",
    "description": "Weighted ankle dorsiflexion using ankle strap and low pulley cable.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Sit on bench facing low pulley with strap attached around forefoot.",
      "Pull toes back toward knee against cable resistance."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_smith_machine_squat",
    "name": "Smith Machine Squat (Feet Forward)",
    "description": "Placing feet forward reduces lower back shear and places massive focus on the quads.",
    "equipment": "smith_machine",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Step feet 12-18 inches in front of bar. Descend deep into upright quad squat, press up."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_smith_machine_calf_raise",
    "name": "Smith Machine Standing Calf Raise",
    "description": "Allows heavy standing calf training on wooden block with built-in safety catches.",
    "equipment": "smith_machine",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Place calf block under bar. Unhook bar on upper traps, raise heels high onto toes."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_deficit_romanian_deadlift",
    "name": "Deficit Romanian Deadlift (Standing on Plate)",
    "description": "Standing on 2-inch plate for extreme hamstring loaded stretch at bottom of hinge.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Stand on 2-inch platform or bumper plate. Hinge deeply past toe level feeling intense hamstring stretch."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_overhead_squat_barbell",
    "name": "Overhead Squat (Barbell)",
    "description": "Olympic lifting test of full-body mobility, balance, thoracic extension, and leg drive.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Snatch or press bar wide overhead. Squat deep keeping bar directly over mid-foot with locked elbows."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_good_morning_safety_bar",
    "name": "Safety Bar Good Morning",
    "description": "Hinge exercise with SSB bar targeting the hamstrings and spinal erectors comfortably.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Hinge hips backward with soft knees, feeling deep hamstring stretch before driving upright."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "legs"
  },
  {
    "id": "ex_barbell_hip_thrust",
    "name": "Barbell Hip Thrust",
    "description": "The premier glute hypertrophy exercise delivering peak horizontal tension at full hip extension.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Sit on floor with upper back against bench, loaded barbell over hips (with thick pad).",
      "Plant feet hip-width with shins vertical at top of movement.",
      "Drive through heels, extending hips until thighs and torso form a straight horizontal line.",
      "Posteriorly tilt pelvis and squeeze glutes hard at top for 1-2 seconds, lower slowly."
    ],
    "imageUrl": null,
    "videoUrl": "https://www.youtube.com/embed/SEdqd1n0cvg",
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_single_leg_hip_thrust",
    "name": "Single-Leg Hip Thrust (Bodyweight or Dumbbell)",
    "description": "Unilateral hip thrust eliminating glute strength discrepancies and challenging pelvic stability.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Upper back on bench, lift one foot off floor with 90-degree knee bend.",
      "Drive working heel into floor to raise hips to full extension, squeeze glute at top."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_kas_glute_bridge",
    "name": "Kas Glute Bridge (Slow Tempo / Upper Range)",
    "description": "Targeted glute movement using a smaller range of motion to keep tension strictly on the glute max.",
    "equipment": "barbell",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Position back on bench as in hip thrust. Move purely at the hip joint without bending knees forward.",
      "Descend only halfway, drive up and squeeze glutes for 2 seconds at peak."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_dumbbell_glute_bridge",
    "name": "Dumbbell Glute Bridge (Floor)",
    "description": "Floor-based glute bridge with dumbbell resting across pelvis, friendly for all fitness levels.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Lie flat on back with knees bent, feet flat on floor. Hold dumbbell over hips.",
      "Drive heels down to bridge hips upward until straight line from knees to shoulders."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_cable_glute_kickback",
    "name": "Cable Glute Kickback (Straight Leg or Bent)",
    "description": "Isolated hip extension using ankle cuff to deliver peak glute contraction.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Attach ankle strap to low cable. Face machine, hinge slightly at hips holding pole.",
      "Kick working leg straight backward, squeezing glute at top without arching lower back."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_machine_glute_kickback",
    "name": "Machine Glute Kickback",
    "description": "Guided track plate or pin-loaded kickback isolating glutes with fixed torso support.",
    "equipment": "machine",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Place working foot on footplate, chest against pad. Drive leg backward and upward."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_hyperextension_glute_focus",
    "name": "45-Degree Hyperextension (Glute Biased)",
    "description": "Feet flared 45 degrees and spine rounded to turn back extension into a pure glute builder.",
    "equipment": "bodyweight",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Set pad below hip crease. Turn toes out 45 degrees, round upper back (slight hunch).",
      "Hinge forward, then extend hips by driving hips into pad and squeezing glutes tightly."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_cable_pull_through",
    "name": "Cable Pull-Through",
    "description": "Teaches powerful hip hinge mechanics with horizontal cable resistance loading the glutes.",
    "equipment": "cable",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Attach rope to low pulley. Face away from cable with rope between legs.",
      "Hinge hips back feeling glute/hamstring stretch, snap hips forward to standing lockout."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_frog_pumps",
    "name": "Frog Pumps (Glute Burnout)",
    "description": "Soles of feet together in butterfly position, removing hamstring involvement for glutes.",
    "equipment": "bodyweight",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Lie on floor with soles of feet pressed together and knees flared wide.",
      "Bridge hips up rapidly, squeezing glutes tightly at top for high repetitions."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_curtsy_lunge",
    "name": "Curtsy Lunge (Dumbbell)",
    "description": "Crossing leg behind torso to place deep loaded stretch on the gluteus medius and maximus.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Step one leg back and across behind front leg as if curtsying.",
      "Lower hips until front thigh is parallel, push through front heel to stand."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_b_stance_romanian_deadlift",
    "name": "B-Stance Romanian Deadlift (Kickstand RDL)",
    "description": "Kickstand single-leg RDL offering stability of two legs with unilateral glute bias.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Front foot flat, back foot resting on toes 10 inches behind for kickstand balance.",
      "Hinge hips back loaded onto front glute, drive hip forward to stand."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_step_up_glute_biased",
    "name": "Glute-Biased Step-Up (Slow Eccentric)",
    "description": "Leaning torso forward over working thigh on box to maximize glute hip extension.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Place foot on box at knee height. Lean torso forward over thigh.",
      "Drive straight up through heel without pushing off trailing toes, lower slowly over 3 seconds."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_lateral_band_walk",
    "name": "Lateral Band Walk (Monster Walk)",
    "description": "Resistance band around ankles or knees activating the gluteus medius and hip abductors.",
    "equipment": "band",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Loop mini-band around ankles, soften knees into quarter squat.",
      "Step laterally keeping toes forward and tension continuously on band."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_clamshell_banded",
    "name": "Banded Clamshell",
    "description": "Sidelying hip external rotation isolating the gluteus medius and deep hip rotators.",
    "equipment": "band",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Lie on side with hips and knees at 45 degrees, band around knees, feet touching.",
      "Open top knee toward ceiling without rolling hips backward."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_cable_hip_abduction",
    "name": "Cable Hip Abduction (Standing)",
    "description": "Ankle cuff cable abduction building the upper shelf of the gluteus medius.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Attach cuff to ankle on far leg. Abduct leg out to side against cable resistance."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_seated_machine_hip_abduction",
    "name": "Seated Machine Hip Abduction",
    "description": "Strict machine abductor exercise targeting the gluteus medius, minimus, and upper max.",
    "equipment": "machine",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Sit back in machine with pads against outer knees.",
      "Push knees outward as wide as possible, pause for 1 second, control return."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_standing_cable_kickback_angled",
    "name": "45-Degree Angled Cable Glute Kickback",
    "description": "Combines hip extension with slight abduction to recruit both gluteus maximus and medius.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "intermediate",
    "instructions": [
      "Kick leg back at a 45-degree angle outward from body, squeezing upper outer glute."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_dumbbell_sumo_squat_glutes",
    "name": "Dumbbell Sumo Squat (Glute Focus)",
    "description": "Wide stance squat with dumbbell held between legs targeting glutes and inner thighs.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Stand with wide stance, toes turned out 45 degrees holding dumbbell hanging vertically.",
      "Squat down opening knees wide, drive through heels squeezing glutes at top."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "glutes"
  },
  {
    "id": "ex_hanging_leg_raise",
    "name": "Hanging Leg Raise",
    "description": "Gold standard lower abdominal exercise flexing pelvis toward ribcage from a dead hang.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Hang from pull-up bar with overhand grip, legs straight.",
      "Posteriorly tilt pelvis and raise straight legs up until parallel to floor or touching bar.",
      "Control the descent slowly without swinging."
    ],
    "imageUrl": null,
    "videoUrl": "https://www.youtube.com/embed/hdng3Nm1x_E",
    "targetRegionId": "core"
  },
  {
    "id": "ex_captains_chair_knee_raise",
    "name": "Captain's Chair Knee Raise",
    "description": "Supported forearm knee raise targeting rectus abdominis with zero lower back strain.",
    "equipment": "bodyweight",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Support body on forearm pads of tower, back against pad.",
      "Curl knees up toward chest, curling pelvis upward at peak."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "core"
  },
  {
    "id": "ex_ab_wheel_rollout",
    "name": "Ab Wheel Rollout",
    "description": "Extreme anti-extension core exercise building bulletproof abdominal wall strength.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Kneel on pad holding ab wheel beneath shoulders with slightly rounded upper back.",
      "Roll wheel forward extending body as far as possible without letting lumbar spine sag.",
      "Pull back by flexing abdominals to return to start."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "core"
  },
  {
    "id": "ex_cable_woodchopper",
    "name": "Cable Woodchopper (High to Low / Diagonal)",
    "description": "Rotational power exercise building functional oblique and transverse abdominal strength.",
    "equipment": "cable",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Stand sideways to high cable holding handle with both hands extended.",
      "Rotate torso diagonally downward across body toward opposite hip, pivoting back foot.",
      "Control cable return with core."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "core"
  },
  {
    "id": "ex_cable_crunch",
    "name": "Cable Kneeling Crunch (Rope)",
    "description": "Allows progressive overload on the rectus abdominis with constant cable tension.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Kneel below high pulley holding rope at temples. Keep hips fixed in place.",
      "Curl torso downward curling ribcage toward pelvis, exhaling fully at bottom.",
      "Allow cable to stretch abs back to start without sitting back on heels."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "core"
  },
  {
    "id": "ex_decline_sit_up",
    "name": "Decline Bench Sit-Up",
    "description": "Extended range sit-up targeting the upper and mid rectus abdominis.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Hook feet in decline bench, cross arms over chest.",
      "Lower torso until hovering above bench, curl spine up to seated."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "core"
  },
  {
    "id": "ex_elbow_plank",
    "name": "Elbow Plank (Front Plank)",
    "description": "Fundamental isometric anti-extension core hold building endurance and pelvic control.",
    "equipment": "bodyweight",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Rest on forearms and toes with elbows under shoulders.",
      "Squeeze glutes, tuck pelvis, pull belly button inward, hold completely motionless."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "core"
  },
  {
    "id": "ex_side_plank",
    "name": "Side Plank",
    "description": "Isometric anti-lateral flexion hold strengthening the obliques and quadratus lumborum.",
    "equipment": "bodyweight",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Lie on side propped on elbow. Lift hips creating a straight diagonal line from head to feet.",
      "Hold position without letting bottom hip sag toward floor."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "core"
  },
  {
    "id": "ex_russian_twists",
    "name": "Russian Twists (Weighted / Bodyweight)",
    "description": "Rotational core movement challenging obliques and hip flexor coordination.",
    "equipment": "dumbbell",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Sit with knees bent, feet elevated off floor, torso leaned back 45 degrees.",
      "Rotate torso side to side, tapping weight on floor beside hips."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "core"
  },
  {
    "id": "ex_dragon_flag",
    "name": "Dragon Flag (Bruce Lee Ab Movement)",
    "description": "Legendary advanced core test keeping the entire body rigid while hinging off the upper back.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Lie on bench gripping edge behind head. Drive legs and torso straight up to vertical.",
      "Lower straight body slowly in one line until hovering above bench, then pull back up."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "core"
  },
  {
    "id": "ex_toes_to_bar",
    "name": "Toes-to-Bar (Hanging)",
    "description": "Full range gymnastics abdominal pull bringing toes all the way to contact the pull-up bar.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Hang from bar. Initiate by flexing lats, curl hips and legs up until toes touch the bar."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "core"
  },
  {
    "id": "ex_pallof_press",
    "name": "Pallof Press (Anti-Rotation)",
    "description": "Pure anti-rotation core trainer building athletic rotational resistance.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Stand perpendicular to cable tower holding handle at sternum with both hands.",
      "Press hands straight out in front of chest, fighting cable's rotational pull.",
      "Hold 2 seconds with arms locked, return to chest."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "core"
  },
  {
    "id": "ex_mountain_climbers",
    "name": "Mountain Climbers (Dynamic Plank)",
    "description": "High tempo plank variation driving knees to chest for dynamic core and hip endurance.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "In high push-up plank, drive alternate knees toward chest rapidly while keeping hips level."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "core"
  },
  {
    "id": "ex_dead_bug",
    "name": "Dead Bug (Contralateral Limb Reach)",
    "description": "Rehabilitation and athletic staple teaching lumbar stabilization with contralateral limb movement.",
    "equipment": "bodyweight",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Lie on back with knees bent 90 degrees and arms pointing to ceiling. Press lower back flat into floor.",
      "Simultaneously lower right arm overhead and left leg toward floor without arching lower back.",
      "Return to center and switch sides."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "core"
  },
  {
    "id": "ex_bird_dog",
    "name": "Bird Dog (Quadruped Reach)",
    "description": "McGill Big 3 movement building spinal stability and posterior chain connection.",
    "equipment": "bodyweight",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "On hands and knees, reach opposite arm forward and leg backward in line with spine. Hold 2 seconds."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "core"
  },
  {
    "id": "ex_seated_machine_hip_adduction",
    "name": "Seated Machine Hip Adduction",
    "description": "Strict machine adductor movement squeezing legs inward against resistance.",
    "equipment": "machine",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Sit in machine with legs open wide, pads on inner knees/thighs.",
      "Squeeze knees inward together smoothly, hold contraction for 1-2 seconds at center.",
      "Return slowly feeling loaded adductor stretch."
    ],
    "imageUrl": null,
    "videoUrl": "https://www.youtube.com/embed/s32e3h2pL9I",
    "targetRegionId": "inner_thigh"
  },
  {
    "id": "ex_standing_cable_hip_adduction",
    "name": "Standing Cable Hip Adduction",
    "description": "Ankle cuff cable adduction pulling leg across the centerline of the body.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Attach ankle cuff to near-side leg. Stand perpendicular to low pulley.",
      "Pull working leg across front of standing leg, squeezing inner thigh."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "inner_thigh"
  },
  {
    "id": "ex_copenhagen_plank",
    "name": "Copenhagen Plank (Adductor Side Plank)",
    "description": "Elite adductor strengthening exercise proven in sports science to prevent groin strains.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Place top foot on bench, bottom leg hanging beneath. Prop body up on elbow in side plank.",
      "Hold position supporting body mass through top inner thigh and oblique."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "inner_thigh"
  },
  {
    "id": "ex_sumo_deadlift_adductor_bias",
    "name": "Sumo Deadlift (Adductor Biased)",
    "description": "Ultra-wide stance deadlift maximizing mechanical tension on the adductor magnus.",
    "equipment": "barbell",
    "movementType": "compound",
    "difficulty": "advanced",
    "instructions": [
      "Take an ultra-wide stance with shins vertical against bar. Drive knees wide outward.",
      "Push floor apart through heels, driving adductors and glutes to lockout."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "inner_thigh"
  },
  {
    "id": "ex_wide_stance_leg_press",
    "name": "Wide-Stance Leg Press (Feet High & Wide)",
    "description": "Feet placed high and wide on platform to recruit the adductors and deep glutes.",
    "equipment": "machine",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Place feet at top outer corners of sled with toes turned 45 degrees outward.",
      "Lower sled deep, keeping knees tracking over toes, press back up."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "inner_thigh"
  },
  {
    "id": "ex_cossack_squat",
    "name": "Cossack Squat (Lateral Squat)",
    "description": "Full depth lateral squat loaded on one leg while putting trailing leg adductors on deep stretch.",
    "equipment": "bodyweight",
    "movementType": "compound",
    "difficulty": "intermediate",
    "instructions": [
      "Stand with wide feet. Squat down to one side, keeping other leg straight with toes rotated up.",
      "Achieve deep hip flexion, push through heel to return to center."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "inner_thigh"
  },
  {
    "id": "ex_lateral_lunge_dumbbell",
    "name": "Dumbbell Lateral Lunge (Side Lunge)",
    "description": "Dynamic frontal plane movement building adductor deceleration and lateral hip strength.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Step wide to the side, sinking hips back into lunge while keeping trailing leg straight.",
      "Push off working foot to return to standing."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "inner_thigh"
  },
  {
    "id": "ex_cable_adductor_kick_in",
    "name": "Cable Adductor Kick-In (Low Pulley)",
    "description": "Constant tension inner thigh pull crossing leg inward past midline.",
    "equipment": "cable",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Cuff on ankle, pull leg inward across body with straight knee, pause 1 second."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "inner_thigh"
  },
  {
    "id": "ex_adductor_squeeze_ball",
    "name": "Isometric Adductor Squeeze (Medicine Ball or Yoga Block)",
    "description": "Isometric adductor hold building tendon strength and pelvic stability.",
    "equipment": "bodyweight",
    "movementType": "isolation",
    "difficulty": "beginner",
    "instructions": [
      "Lie on back with knees bent. Place medicine ball or foam block between knees.",
      "Squeeze knees together as hard as possible for 10-15 seconds per rep."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "inner_thigh"
  },
  {
    "id": "ex_dumbbell_goblet_sumo_squat",
    "name": "Dumbbell Goblet Sumo Squat",
    "description": "Upright goblet hold allowing deep adductor stretch and safe knee tracking.",
    "equipment": "dumbbell",
    "movementType": "compound",
    "difficulty": "beginner",
    "instructions": [
      "Hold dumbbell at chest with wide stance, toes turned out.",
      "Squat deep between knees, pushing knees out against adductors, drive up."
    ],
    "imageUrl": null,
    "videoUrl": null,
    "targetRegionId": "inner_thigh"
  }
];

export const EXERCISE_MUSCLE_CONTRIBUTIONS: ExerciseMuscleContribution[] = [
  {
    "id": "emc_ex_barbell_bench_press_m_chest_sternal_pri",
    "exerciseId": "ex_barbell_bench_press",
    "muscleId": "m_chest_sternal",
    "percentage": 60,
    "role": "Primary",
    "notes": "Primary horizontal adduction"
  },
  {
    "id": "emc_ex_barbell_bench_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_barbell_bench_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 25,
    "role": "Secondary",
    "notes": "Shoulder flexion synergy"
  },
  {
    "id": "emc_ex_barbell_bench_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_barbell_bench_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Elbow lockout extension"
  },
  {
    "id": "emc_ex_barbell_bench_press_m_rotator_cuff_stab",
    "exerciseId": "ex_barbell_bench_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Glenohumeral joint stabilization"
  },
  {
    "id": "emc_ex_barbell_bench_press_m_core_stab",
    "exerciseId": "ex_barbell_bench_press",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Trunk stability"
  },
  {
    "id": "emc_ex_incline_barbell_bench_press_m_chest_clavicular_pri",
    "exerciseId": "ex_incline_barbell_bench_press",
    "muscleId": "m_chest_clavicular",
    "percentage": 60,
    "role": "Primary",
    "notes": "Clavicular pectoralis upper fibers"
  },
  {
    "id": "emc_ex_incline_barbell_bench_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_incline_barbell_bench_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 25,
    "role": "Secondary",
    "notes": "High shoulder flexion load"
  },
  {
    "id": "emc_ex_incline_barbell_bench_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_incline_barbell_bench_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Elbow extension"
  },
  {
    "id": "emc_ex_incline_barbell_bench_press_m_rotator_cuff_stab",
    "exerciseId": "ex_incline_barbell_bench_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Scapular tracking"
  },
  {
    "id": "emc_ex_decline_barbell_bench_press_m_chest_costal_pri",
    "exerciseId": "ex_decline_barbell_bench_press",
    "muscleId": "m_chest_costal",
    "percentage": 65,
    "role": "Primary",
    "notes": "Lower costal pectoral drive"
  },
  {
    "id": "emc_ex_decline_barbell_bench_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_decline_barbell_bench_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Elbow extension"
  },
  {
    "id": "emc_ex_decline_barbell_bench_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_decline_barbell_bench_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Shoulder flexion"
  },
  {
    "id": "emc_ex_decline_barbell_bench_press_m_rotator_cuff_stab",
    "exerciseId": "ex_decline_barbell_bench_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Shoulder stability"
  },
  {
    "id": "emc_ex_flat_dumbbell_press_m_chest_sternal_pri",
    "exerciseId": "ex_flat_dumbbell_press",
    "muscleId": "m_chest_sternal",
    "percentage": 65,
    "role": "Primary",
    "notes": "Mid-chest horizontal adduction"
  },
  {
    "id": "emc_ex_flat_dumbbell_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_flat_dumbbell_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Anterior delt assistance"
  },
  {
    "id": "emc_ex_flat_dumbbell_press_m_triceps_medial_head_sec",
    "exerciseId": "ex_flat_dumbbell_press",
    "muscleId": "m_triceps_medial_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Triceps extension"
  },
  {
    "id": "emc_ex_flat_dumbbell_press_m_rotator_cuff_stab",
    "exerciseId": "ex_flat_dumbbell_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Unilateral stabilization"
  },
  {
    "id": "emc_ex_incline_dumbbell_press_m_chest_clavicular_pri",
    "exerciseId": "ex_incline_dumbbell_press",
    "muscleId": "m_chest_clavicular",
    "percentage": 65,
    "role": "Primary",
    "notes": "Upper chest focus"
  },
  {
    "id": "emc_ex_incline_dumbbell_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_incline_dumbbell_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Shoulder flexion"
  },
  {
    "id": "emc_ex_incline_dumbbell_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_incline_dumbbell_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Lockout"
  },
  {
    "id": "emc_ex_incline_dumbbell_press_m_rotator_cuff_stab",
    "exerciseId": "ex_incline_dumbbell_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "High unilateral joint stability"
  },
  {
    "id": "emc_ex_decline_dumbbell_press_m_chest_costal_pri",
    "exerciseId": "ex_decline_dumbbell_press",
    "muscleId": "m_chest_costal",
    "percentage": 70,
    "role": "Primary",
    "notes": "Lower chest adduction"
  },
  {
    "id": "emc_ex_decline_dumbbell_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_decline_dumbbell_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Triceps lockout"
  },
  {
    "id": "emc_ex_decline_dumbbell_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_decline_dumbbell_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Minimal shoulder flexion"
  },
  {
    "id": "emc_ex_decline_dumbbell_press_m_rotator_cuff_stab",
    "exerciseId": "ex_decline_dumbbell_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Shoulder control"
  },
  {
    "id": "emc_ex_flat_dumbbell_fly_m_chest_sternal_pri",
    "exerciseId": "ex_flat_dumbbell_fly",
    "muscleId": "m_chest_sternal",
    "percentage": 80,
    "role": "Primary",
    "notes": "Pure horizontal adduction"
  },
  {
    "id": "emc_ex_flat_dumbbell_fly_m_deltoid_anterior_sec",
    "exerciseId": "ex_flat_dumbbell_fly",
    "muscleId": "m_deltoid_anterior",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Anterior shoulder support"
  },
  {
    "id": "emc_ex_flat_dumbbell_fly_m_biceps_short_head_stab",
    "exerciseId": "ex_flat_dumbbell_fly",
    "muscleId": "m_biceps_short_head",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Elbow angle stabilization"
  },
  {
    "id": "emc_ex_flat_dumbbell_fly_m_rotator_cuff_stab",
    "exerciseId": "ex_flat_dumbbell_fly",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Shoulder joint control"
  },
  {
    "id": "emc_ex_incline_dumbbell_fly_m_chest_clavicular_pri",
    "exerciseId": "ex_incline_dumbbell_fly",
    "muscleId": "m_chest_clavicular",
    "percentage": 80,
    "role": "Primary",
    "notes": "Upper chest horizontal adduction"
  },
  {
    "id": "emc_ex_incline_dumbbell_fly_m_deltoid_anterior_sec",
    "exerciseId": "ex_incline_dumbbell_fly",
    "muscleId": "m_deltoid_anterior",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Anterior deltoid synergy"
  },
  {
    "id": "emc_ex_incline_dumbbell_fly_m_rotator_cuff_stab",
    "exerciseId": "ex_incline_dumbbell_fly",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Glenohumeral protection"
  },
  {
    "id": "emc_ex_cable_crossover_high_to_low_m_chest_costal_pri",
    "exerciseId": "ex_cable_crossover_high_to_low",
    "muscleId": "m_chest_costal",
    "percentage": 75,
    "role": "Primary",
    "notes": "Downward adduction focus"
  },
  {
    "id": "emc_ex_cable_crossover_high_to_low_m_chest_sternal_sec",
    "exerciseId": "ex_cable_crossover_high_to_low",
    "muscleId": "m_chest_sternal",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Sternal assistance"
  },
  {
    "id": "emc_ex_cable_crossover_high_to_low_m_deltoid_anterior_sec",
    "exerciseId": "ex_cable_crossover_high_to_low",
    "muscleId": "m_deltoid_anterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Anterior delt"
  },
  {
    "id": "emc_ex_cable_crossover_high_to_low_m_core_stab",
    "exerciseId": "ex_cable_crossover_high_to_low",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Anti-extension standing core"
  },
  {
    "id": "emc_ex_cable_fly_low_to_high_m_chest_clavicular_pri",
    "exerciseId": "ex_cable_fly_low_to_high",
    "muscleId": "m_chest_clavicular",
    "percentage": 75,
    "role": "Primary",
    "notes": "Upward adduction angle"
  },
  {
    "id": "emc_ex_cable_fly_low_to_high_m_deltoid_anterior_sec",
    "exerciseId": "ex_cable_fly_low_to_high",
    "muscleId": "m_deltoid_anterior",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Shoulder flexion synergy"
  },
  {
    "id": "emc_ex_cable_fly_low_to_high_m_chest_sternal_sec",
    "exerciseId": "ex_cable_fly_low_to_high",
    "muscleId": "m_chest_sternal",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Sternal assistance"
  },
  {
    "id": "emc_ex_cable_fly_low_to_high_m_core_stab",
    "exerciseId": "ex_cable_fly_low_to_high",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Core balance"
  },
  {
    "id": "emc_ex_middle_cable_fly_m_chest_sternal_pri",
    "exerciseId": "ex_middle_cable_fly",
    "muscleId": "m_chest_sternal",
    "percentage": 80,
    "role": "Primary",
    "notes": "Sternal horizontal adduction"
  },
  {
    "id": "emc_ex_middle_cable_fly_m_deltoid_anterior_sec",
    "exerciseId": "ex_middle_cable_fly",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Shoulder flexion"
  },
  {
    "id": "emc_ex_middle_cable_fly_m_chest_clavicular_sec",
    "exerciseId": "ex_middle_cable_fly",
    "muscleId": "m_chest_clavicular",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Upper chest synergist"
  },
  {
    "id": "emc_ex_middle_cable_fly_m_core_stab",
    "exerciseId": "ex_middle_cable_fly",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Standing trunk stabilization"
  },
  {
    "id": "emc_ex_machine_chest_press_m_chest_sternal_pri",
    "exerciseId": "ex_machine_chest_press",
    "muscleId": "m_chest_sternal",
    "percentage": 65,
    "role": "Primary",
    "notes": "Direct horizontal pressing"
  },
  {
    "id": "emc_ex_machine_chest_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_machine_chest_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Triceps extension"
  },
  {
    "id": "emc_ex_machine_chest_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_machine_chest_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Anterior delt"
  },
  {
    "id": "emc_ex_machine_chest_press_m_rotator_cuff_stab",
    "exerciseId": "ex_machine_chest_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Machine guided stability"
  },
  {
    "id": "emc_ex_incline_machine_chest_press_m_chest_clavicular_pri",
    "exerciseId": "ex_incline_machine_chest_press",
    "muscleId": "m_chest_clavicular",
    "percentage": 70,
    "role": "Primary",
    "notes": "Targeted upper chest path"
  },
  {
    "id": "emc_ex_incline_machine_chest_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_incline_machine_chest_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Shoulder flexion"
  },
  {
    "id": "emc_ex_incline_machine_chest_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_incline_machine_chest_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Triceps extension"
  },
  {
    "id": "emc_ex_incline_machine_chest_press_m_rotator_cuff_stab",
    "exerciseId": "ex_incline_machine_chest_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Guided track stabilization"
  },
  {
    "id": "emc_ex_pec_deck_fly_m_chest_sternal_pri",
    "exerciseId": "ex_pec_deck_fly",
    "muscleId": "m_chest_sternal",
    "percentage": 85,
    "role": "Primary",
    "notes": "Pure horizontal adduction"
  },
  {
    "id": "emc_ex_pec_deck_fly_m_deltoid_anterior_sec",
    "exerciseId": "ex_pec_deck_fly",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Anterior deltoid"
  },
  {
    "id": "emc_ex_pec_deck_fly_m_rotator_cuff_stab",
    "exerciseId": "ex_pec_deck_fly",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Joint stability"
  },
  {
    "id": "emc_ex_push_up_m_chest_sternal_pri",
    "exerciseId": "ex_push_up",
    "muscleId": "m_chest_sternal",
    "percentage": 60,
    "role": "Primary",
    "notes": "Bodyweight horizontal press"
  },
  {
    "id": "emc_ex_push_up_m_triceps_lateral_head_sec",
    "exerciseId": "ex_push_up",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Elbow extension"
  },
  {
    "id": "emc_ex_push_up_m_deltoid_anterior_sec",
    "exerciseId": "ex_push_up",
    "muscleId": "m_deltoid_anterior",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Shoulder flexion"
  },
  {
    "id": "emc_ex_push_up_m_rectus_abdominis_stab",
    "exerciseId": "ex_push_up",
    "muscleId": "m_rectus_abdominis",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Anti-extension core plank"
  },
  {
    "id": "emc_ex_push_up_m_serratus_anterior_stab",
    "exerciseId": "ex_push_up",
    "muscleId": "m_serratus_anterior",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Scapular protraction"
  },
  {
    "id": "emc_ex_incline_push_up_m_chest_costal_pri",
    "exerciseId": "ex_incline_push_up",
    "muscleId": "m_chest_costal",
    "percentage": 55,
    "role": "Primary",
    "notes": "Lower chest angle focus"
  },
  {
    "id": "emc_ex_incline_push_up_m_chest_sternal_sec",
    "exerciseId": "ex_incline_push_up",
    "muscleId": "m_chest_sternal",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Mid-chest assistance"
  },
  {
    "id": "emc_ex_incline_push_up_m_triceps_medial_head_sec",
    "exerciseId": "ex_incline_push_up",
    "muscleId": "m_triceps_medial_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Triceps extension"
  },
  {
    "id": "emc_ex_incline_push_up_m_deltoid_anterior_sec",
    "exerciseId": "ex_incline_push_up",
    "muscleId": "m_deltoid_anterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Front delt"
  },
  {
    "id": "emc_ex_incline_push_up_m_rectus_abdominis_stab",
    "exerciseId": "ex_incline_push_up",
    "muscleId": "m_rectus_abdominis",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Core bracing"
  },
  {
    "id": "emc_ex_decline_push_up_m_chest_clavicular_pri",
    "exerciseId": "ex_decline_push_up",
    "muscleId": "m_chest_clavicular",
    "percentage": 65,
    "role": "Primary",
    "notes": "Upper chest emphasis"
  },
  {
    "id": "emc_ex_decline_push_up_m_deltoid_anterior_sec",
    "exerciseId": "ex_decline_push_up",
    "muscleId": "m_deltoid_anterior",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Increased vertical shoulder load"
  },
  {
    "id": "emc_ex_decline_push_up_m_triceps_lateral_head_sec",
    "exerciseId": "ex_decline_push_up",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Lockout"
  },
  {
    "id": "emc_ex_decline_push_up_m_rectus_abdominis_stab",
    "exerciseId": "ex_decline_push_up",
    "muscleId": "m_rectus_abdominis",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Core anti-extension"
  },
  {
    "id": "emc_ex_weighted_push_up_m_chest_sternal_pri",
    "exerciseId": "ex_weighted_push_up",
    "muscleId": "m_chest_sternal",
    "percentage": 60,
    "role": "Primary",
    "notes": "Heavy bodyweight resistance"
  },
  {
    "id": "emc_ex_weighted_push_up_m_deltoid_anterior_sec",
    "exerciseId": "ex_weighted_push_up",
    "muscleId": "m_deltoid_anterior",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Anterior delt"
  },
  {
    "id": "emc_ex_weighted_push_up_m_triceps_lateral_head_sec",
    "exerciseId": "ex_weighted_push_up",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Triceps extension"
  },
  {
    "id": "emc_ex_weighted_push_up_m_rectus_abdominis_stab",
    "exerciseId": "ex_weighted_push_up",
    "muscleId": "m_rectus_abdominis",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "High core brace load"
  },
  {
    "id": "emc_ex_weighted_push_up_m_serratus_anterior_stab",
    "exerciseId": "ex_weighted_push_up",
    "muscleId": "m_serratus_anterior",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Scapular health"
  },
  {
    "id": "emc_ex_chest_dips_m_chest_costal_pri",
    "exerciseId": "ex_chest_dips",
    "muscleId": "m_chest_costal",
    "percentage": 65,
    "role": "Primary",
    "notes": "Lower pectoral drive"
  },
  {
    "id": "emc_ex_chest_dips_m_triceps_long_head_sec",
    "exerciseId": "ex_chest_dips",
    "muscleId": "m_triceps_long_head",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Triceps extension"
  },
  {
    "id": "emc_ex_chest_dips_m_deltoid_anterior_sec",
    "exerciseId": "ex_chest_dips",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Shoulder extension / flexion"
  },
  {
    "id": "emc_ex_chest_dips_m_rotator_cuff_stab",
    "exerciseId": "ex_chest_dips",
    "muscleId": "m_rotator_cuff",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "High glenohumeral stability demand"
  },
  {
    "id": "emc_ex_smith_machine_bench_press_m_chest_sternal_pri",
    "exerciseId": "ex_smith_machine_bench_press",
    "muscleId": "m_chest_sternal",
    "percentage": 65,
    "role": "Primary",
    "notes": "Pectoral adduction"
  },
  {
    "id": "emc_ex_smith_machine_bench_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_smith_machine_bench_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Triceps extension"
  },
  {
    "id": "emc_ex_smith_machine_bench_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_smith_machine_bench_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Front delt synergy"
  },
  {
    "id": "emc_ex_smith_machine_bench_press_m_rotator_cuff_stab",
    "exerciseId": "ex_smith_machine_bench_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Track stabilized"
  },
  {
    "id": "emc_ex_smith_machine_incline_press_m_chest_clavicular_pri",
    "exerciseId": "ex_smith_machine_incline_press",
    "muscleId": "m_chest_clavicular",
    "percentage": 70,
    "role": "Primary",
    "notes": "Clavicular pectorals"
  },
  {
    "id": "emc_ex_smith_machine_incline_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_smith_machine_incline_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Front deltoid"
  },
  {
    "id": "emc_ex_smith_machine_incline_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_smith_machine_incline_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Triceps extension"
  },
  {
    "id": "emc_ex_smith_machine_incline_press_m_rotator_cuff_stab",
    "exerciseId": "ex_smith_machine_incline_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Guided tracking"
  },
  {
    "id": "emc_ex_neutral_grip_dumbbell_press_m_chest_sternal_pri",
    "exerciseId": "ex_neutral_grip_dumbbell_press",
    "muscleId": "m_chest_sternal",
    "percentage": 60,
    "role": "Primary",
    "notes": "Sternal chest adduction"
  },
  {
    "id": "emc_ex_neutral_grip_dumbbell_press_m_triceps_medial_head_sec",
    "exerciseId": "ex_neutral_grip_dumbbell_press",
    "muscleId": "m_triceps_medial_head",
    "percentage": 25,
    "role": "Secondary",
    "notes": "Tucked elbow triceps load"
  },
  {
    "id": "emc_ex_neutral_grip_dumbbell_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_neutral_grip_dumbbell_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Anterior shoulder"
  },
  {
    "id": "emc_ex_neutral_grip_dumbbell_press_m_rotator_cuff_stab",
    "exerciseId": "ex_neutral_grip_dumbbell_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Shoulder joint friendly"
  },
  {
    "id": "emc_ex_svend_press_m_chest_sternal_pri",
    "exerciseId": "ex_svend_press",
    "muscleId": "m_chest_sternal",
    "percentage": 80,
    "role": "Primary",
    "notes": "Peak isometric adduction"
  },
  {
    "id": "emc_ex_svend_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_svend_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Horizontal arm support"
  },
  {
    "id": "emc_ex_svend_press_m_core_stab",
    "exerciseId": "ex_svend_press",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Standing posture"
  },
  {
    "id": "emc_ex_floor_press_barbell_m_chest_sternal_pri",
    "exerciseId": "ex_floor_press_barbell",
    "muscleId": "m_chest_sternal",
    "percentage": 55,
    "role": "Primary",
    "notes": "Upper range horizontal press"
  },
  {
    "id": "emc_ex_floor_press_barbell_m_triceps_lateral_head_sec",
    "exerciseId": "ex_floor_press_barbell",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 30,
    "role": "Secondary",
    "notes": "Strong elbow lockout"
  },
  {
    "id": "emc_ex_floor_press_barbell_m_deltoid_anterior_sec",
    "exerciseId": "ex_floor_press_barbell",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Front delt"
  },
  {
    "id": "emc_ex_floor_press_barbell_m_rotator_cuff_stab",
    "exerciseId": "ex_floor_press_barbell",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Shoulder protected by floor"
  },
  {
    "id": "emc_ex_floor_press_dumbbell_m_chest_sternal_pri",
    "exerciseId": "ex_floor_press_dumbbell",
    "muscleId": "m_chest_sternal",
    "percentage": 55,
    "role": "Primary",
    "notes": "Horizontal adduction"
  },
  {
    "id": "emc_ex_floor_press_dumbbell_m_triceps_lateral_head_sec",
    "exerciseId": "ex_floor_press_dumbbell",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 30,
    "role": "Secondary",
    "notes": "Triceps extension"
  },
  {
    "id": "emc_ex_floor_press_dumbbell_m_deltoid_anterior_sec",
    "exerciseId": "ex_floor_press_dumbbell",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Anterior delt"
  },
  {
    "id": "emc_ex_floor_press_dumbbell_m_rotator_cuff_stab",
    "exerciseId": "ex_floor_press_dumbbell",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Unilateral stabilization"
  },
  {
    "id": "emc_ex_landmine_chest_press_m_chest_clavicular_pri",
    "exerciseId": "ex_landmine_chest_press",
    "muscleId": "m_chest_clavicular",
    "percentage": 60,
    "role": "Primary",
    "notes": "Angled upward press"
  },
  {
    "id": "emc_ex_landmine_chest_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_landmine_chest_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 25,
    "role": "Secondary",
    "notes": "Anterior shoulder drive"
  },
  {
    "id": "emc_ex_landmine_chest_press_m_triceps_medial_head_sec",
    "exerciseId": "ex_landmine_chest_press",
    "muscleId": "m_triceps_medial_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Lockout"
  },
  {
    "id": "emc_ex_landmine_chest_press_m_obliques_stab",
    "exerciseId": "ex_landmine_chest_press",
    "muscleId": "m_obliques",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Anti-rotation core brace"
  },
  {
    "id": "emc_ex_landmine_chest_press_m_serratus_anterior_stab",
    "exerciseId": "ex_landmine_chest_press",
    "muscleId": "m_serratus_anterior",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Scapular upward rotation"
  },
  {
    "id": "emc_ex_single_arm_cable_chest_press_m_chest_sternal_pri",
    "exerciseId": "ex_single_arm_cable_chest_press",
    "muscleId": "m_chest_sternal",
    "percentage": 65,
    "role": "Primary",
    "notes": "Unilateral pectoral adduction"
  },
  {
    "id": "emc_ex_single_arm_cable_chest_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_single_arm_cable_chest_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Front delt"
  },
  {
    "id": "emc_ex_single_arm_cable_chest_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_single_arm_cable_chest_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Triceps"
  },
  {
    "id": "emc_ex_single_arm_cable_chest_press_m_obliques_stab",
    "exerciseId": "ex_single_arm_cable_chest_press",
    "muscleId": "m_obliques",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Anti-rotation core stability"
  },
  {
    "id": "emc_ex_seated_cable_crossover_m_chest_sternal_pri",
    "exerciseId": "ex_seated_cable_crossover",
    "muscleId": "m_chest_sternal",
    "percentage": 80,
    "role": "Primary",
    "notes": "Strict seated adduction"
  },
  {
    "id": "emc_ex_seated_cable_crossover_m_deltoid_anterior_sec",
    "exerciseId": "ex_seated_cable_crossover",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Anterior delt"
  },
  {
    "id": "emc_ex_seated_cable_crossover_m_chest_costal_sec",
    "exerciseId": "ex_seated_cable_crossover",
    "muscleId": "m_chest_costal",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Lower fibers"
  },
  {
    "id": "emc_ex_seated_cable_crossover_m_rotator_cuff_stab",
    "exerciseId": "ex_seated_cable_crossover",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Shoulder tracking"
  },
  {
    "id": "emc_ex_hammer_strength_flat_press_m_chest_sternal_pri",
    "exerciseId": "ex_hammer_strength_flat_press",
    "muscleId": "m_chest_sternal",
    "percentage": 65,
    "role": "Primary",
    "notes": "Converging horizontal drive"
  },
  {
    "id": "emc_ex_hammer_strength_flat_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_hammer_strength_flat_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Triceps"
  },
  {
    "id": "emc_ex_hammer_strength_flat_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_hammer_strength_flat_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Anterior shoulder"
  },
  {
    "id": "emc_ex_hammer_strength_flat_press_m_rotator_cuff_stab",
    "exerciseId": "ex_hammer_strength_flat_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Independent arm tracking"
  },
  {
    "id": "emc_ex_hammer_strength_incline_press_m_chest_clavicular_pri",
    "exerciseId": "ex_hammer_strength_incline_press",
    "muscleId": "m_chest_clavicular",
    "percentage": 70,
    "role": "Primary",
    "notes": "Upper chest recruitment"
  },
  {
    "id": "emc_ex_hammer_strength_incline_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_hammer_strength_incline_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Anterior delt"
  },
  {
    "id": "emc_ex_hammer_strength_incline_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_hammer_strength_incline_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Triceps extension"
  },
  {
    "id": "emc_ex_hammer_strength_incline_press_m_rotator_cuff_stab",
    "exerciseId": "ex_hammer_strength_incline_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Machine stability"
  },
  {
    "id": "emc_ex_conventional_deadlift_m_erector_spinae_pri",
    "exerciseId": "ex_conventional_deadlift",
    "muscleId": "m_erector_spinae",
    "percentage": 50,
    "role": "Primary",
    "notes": "Spinal extension & isometric back brace"
  },
  {
    "id": "emc_ex_conventional_deadlift_m_latissimus_dorsi_pri",
    "exerciseId": "ex_conventional_deadlift",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 15,
    "role": "Primary",
    "notes": "Bar path stabilization"
  },
  {
    "id": "emc_ex_conventional_deadlift_m_gluteus_maximus_sec",
    "exerciseId": "ex_conventional_deadlift",
    "muscleId": "m_gluteus_maximus",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Hip extension power"
  },
  {
    "id": "emc_ex_conventional_deadlift_m_hamstrings_sec",
    "exerciseId": "ex_conventional_deadlift",
    "muscleId": "m_hamstrings",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Posterior chain load"
  },
  {
    "id": "emc_ex_conventional_deadlift_m_trapezius_upper_stab",
    "exerciseId": "ex_conventional_deadlift",
    "muscleId": "m_trapezius_upper",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Shoulder girdle hang"
  },
  {
    "id": "emc_ex_conventional_deadlift_m_forearms_stab",
    "exerciseId": "ex_conventional_deadlift",
    "muscleId": "m_forearms",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Grip endurance"
  },
  {
    "id": "emc_ex_conventional_deadlift_m_transverse_abdominis_stab",
    "exerciseId": "ex_conventional_deadlift",
    "muscleId": "m_transverse_abdominis",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Intra-abdominal pressure"
  },
  {
    "id": "emc_ex_sumo_deadlift_m_erector_spinae_pri",
    "exerciseId": "ex_sumo_deadlift",
    "muscleId": "m_erector_spinae",
    "percentage": 40,
    "role": "Primary",
    "notes": "Spinal stabilization"
  },
  {
    "id": "emc_ex_sumo_deadlift_m_gluteus_maximus_pri",
    "exerciseId": "ex_sumo_deadlift",
    "muscleId": "m_gluteus_maximus",
    "percentage": 30,
    "role": "Primary",
    "notes": "Hip extension"
  },
  {
    "id": "emc_ex_sumo_deadlift_m_adductor_magnus_sec",
    "exerciseId": "ex_sumo_deadlift",
    "muscleId": "m_adductor_magnus",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Adductor drive"
  },
  {
    "id": "emc_ex_sumo_deadlift_m_quadriceps_sec",
    "exerciseId": "ex_sumo_deadlift",
    "muscleId": "m_quadriceps",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Knee extension initiation"
  },
  {
    "id": "emc_ex_sumo_deadlift_m_trapezius_upper_stab",
    "exerciseId": "ex_sumo_deadlift",
    "muscleId": "m_trapezius_upper",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Scapular stabilization"
  },
  {
    "id": "emc_ex_sumo_deadlift_m_forearms_stab",
    "exerciseId": "ex_sumo_deadlift",
    "muscleId": "m_forearms",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Grip"
  },
  {
    "id": "emc_ex_barbell_bent_over_row_overhand_m_latissimus_dorsi_pri",
    "exerciseId": "ex_barbell_bent_over_row_overhand",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 45,
    "role": "Primary",
    "notes": "Horizontal shoulder extension"
  },
  {
    "id": "emc_ex_barbell_bent_over_row_overhand_m_trapezius_middle_pri",
    "exerciseId": "ex_barbell_bent_over_row_overhand",
    "muscleId": "m_trapezius_middle",
    "percentage": 30,
    "role": "Primary",
    "notes": "Scapular retraction"
  },
  {
    "id": "emc_ex_barbell_bent_over_row_overhand_m_biceps_short_head_sec",
    "exerciseId": "ex_barbell_bent_over_row_overhand",
    "muscleId": "m_biceps_short_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Elbow flexion"
  },
  {
    "id": "emc_ex_barbell_bent_over_row_overhand_m_deltoid_posterior_sec",
    "exerciseId": "ex_barbell_bent_over_row_overhand",
    "muscleId": "m_deltoid_posterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Rear delt synergy"
  },
  {
    "id": "emc_ex_barbell_bent_over_row_overhand_m_erector_spinae_stab",
    "exerciseId": "ex_barbell_bent_over_row_overhand",
    "muscleId": "m_erector_spinae",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Isometric hinge support"
  },
  {
    "id": "emc_ex_barbell_bent_over_row_overhand_m_hamstrings_stab",
    "exerciseId": "ex_barbell_bent_over_row_overhand",
    "muscleId": "m_hamstrings",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Hips support"
  },
  {
    "id": "emc_ex_barbell_row_underhand_m_latissimus_dorsi_pri",
    "exerciseId": "ex_barbell_row_underhand",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 55,
    "role": "Primary",
    "notes": "Lower lat fibers"
  },
  {
    "id": "emc_ex_barbell_row_underhand_m_trapezius_middle_pri",
    "exerciseId": "ex_barbell_row_underhand",
    "muscleId": "m_trapezius_middle",
    "percentage": 20,
    "role": "Primary",
    "notes": "Mid-back squeeze"
  },
  {
    "id": "emc_ex_barbell_row_underhand_m_biceps_long_head_sec",
    "exerciseId": "ex_barbell_row_underhand",
    "muscleId": "m_biceps_long_head",
    "percentage": 25,
    "role": "Secondary",
    "notes": "Supinated elbow flexion"
  },
  {
    "id": "emc_ex_barbell_row_underhand_m_erector_spinae_stab",
    "exerciseId": "ex_barbell_row_underhand",
    "muscleId": "m_erector_spinae",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Torso stabilization"
  },
  {
    "id": "emc_ex_pendlay_row_m_latissimus_dorsi_pri",
    "exerciseId": "ex_pendlay_row",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 40,
    "role": "Primary",
    "notes": "Explosive lat pull"
  },
  {
    "id": "emc_ex_pendlay_row_m_trapezius_middle_pri",
    "exerciseId": "ex_pendlay_row",
    "muscleId": "m_trapezius_middle",
    "percentage": 35,
    "role": "Primary",
    "notes": "Upper back power"
  },
  {
    "id": "emc_ex_pendlay_row_m_deltoid_posterior_sec",
    "exerciseId": "ex_pendlay_row",
    "muscleId": "m_deltoid_posterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Rear shoulder contraction"
  },
  {
    "id": "emc_ex_pendlay_row_m_biceps_short_head_sec",
    "exerciseId": "ex_pendlay_row",
    "muscleId": "m_biceps_short_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Arm flexion"
  },
  {
    "id": "emc_ex_pendlay_row_m_erector_spinae_stab",
    "exerciseId": "ex_pendlay_row",
    "muscleId": "m_erector_spinae",
    "percentage": 30,
    "role": "Stabilizer",
    "notes": "Parallel torso brace"
  },
  {
    "id": "emc_ex_pendlay_row_m_hamstrings_stab",
    "exerciseId": "ex_pendlay_row",
    "muscleId": "m_hamstrings",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Posterior chain base"
  },
  {
    "id": "emc_ex_pull_up_m_latissimus_dorsi_pri",
    "exerciseId": "ex_pull_up",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 60,
    "role": "Primary",
    "notes": "Vertical shoulder adduction"
  },
  {
    "id": "emc_ex_pull_up_m_teres_major_pri",
    "exerciseId": "ex_pull_up",
    "muscleId": "m_teres_major",
    "percentage": 15,
    "role": "Primary",
    "notes": "Upper lat assist"
  },
  {
    "id": "emc_ex_pull_up_m_biceps_short_head_sec",
    "exerciseId": "ex_pull_up",
    "muscleId": "m_biceps_short_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Elbow flexion"
  },
  {
    "id": "emc_ex_pull_up_m_trapezius_lower_sec",
    "exerciseId": "ex_pull_up",
    "muscleId": "m_trapezius_lower",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Scapular depression"
  },
  {
    "id": "emc_ex_pull_up_m_core_stab",
    "exerciseId": "ex_pull_up",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Anti-swing core brace"
  },
  {
    "id": "emc_ex_pull_up_m_forearms_stab",
    "exerciseId": "ex_pull_up",
    "muscleId": "m_forearms",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Grip hang"
  },
  {
    "id": "emc_ex_chin_up_m_latissimus_dorsi_pri",
    "exerciseId": "ex_chin_up",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 55,
    "role": "Primary",
    "notes": "Lat adduction"
  },
  {
    "id": "emc_ex_chin_up_m_biceps_long_head_pri",
    "exerciseId": "ex_chin_up",
    "muscleId": "m_biceps_long_head",
    "percentage": 30,
    "role": "Primary",
    "notes": "Biceps flexion"
  },
  {
    "id": "emc_ex_chin_up_m_trapezius_lower_sec",
    "exerciseId": "ex_chin_up",
    "muscleId": "m_trapezius_lower",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Scapular depression"
  },
  {
    "id": "emc_ex_chin_up_m_rectus_abdominis_stab",
    "exerciseId": "ex_chin_up",
    "muscleId": "m_rectus_abdominis",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Hollow body brace"
  },
  {
    "id": "emc_ex_chin_up_m_forearms_stab",
    "exerciseId": "ex_chin_up",
    "muscleId": "m_forearms",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Grip"
  },
  {
    "id": "emc_ex_neutral_grip_pull_up_m_latissimus_dorsi_pri",
    "exerciseId": "ex_neutral_grip_pull_up",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 55,
    "role": "Primary",
    "notes": "Lat vertical pull"
  },
  {
    "id": "emc_ex_neutral_grip_pull_up_m_brachialis_pri",
    "exerciseId": "ex_neutral_grip_pull_up",
    "muscleId": "m_brachialis",
    "percentage": 25,
    "role": "Primary",
    "notes": "Neutral elbow flexion"
  },
  {
    "id": "emc_ex_neutral_grip_pull_up_m_trapezius_middle_sec",
    "exerciseId": "ex_neutral_grip_pull_up",
    "muscleId": "m_trapezius_middle",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Mid-back"
  },
  {
    "id": "emc_ex_neutral_grip_pull_up_m_teres_major_sec",
    "exerciseId": "ex_neutral_grip_pull_up",
    "muscleId": "m_teres_major",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Upper lat synergy"
  },
  {
    "id": "emc_ex_neutral_grip_pull_up_m_core_stab",
    "exerciseId": "ex_neutral_grip_pull_up",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Trunk stability"
  },
  {
    "id": "emc_ex_lat_pulldown_wide_m_latissimus_dorsi_pri",
    "exerciseId": "ex_lat_pulldown_wide",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 65,
    "role": "Primary",
    "notes": "Frontal plane lat adduction"
  },
  {
    "id": "emc_ex_lat_pulldown_wide_m_teres_major_pri",
    "exerciseId": "ex_lat_pulldown_wide",
    "muscleId": "m_teres_major",
    "percentage": 15,
    "role": "Primary",
    "notes": "Upper lat assistance"
  },
  {
    "id": "emc_ex_lat_pulldown_wide_m_biceps_short_head_sec",
    "exerciseId": "ex_lat_pulldown_wide",
    "muscleId": "m_biceps_short_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Elbow flexion"
  },
  {
    "id": "emc_ex_lat_pulldown_wide_m_trapezius_lower_sec",
    "exerciseId": "ex_lat_pulldown_wide",
    "muscleId": "m_trapezius_lower",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Scapular depression"
  },
  {
    "id": "emc_ex_lat_pulldown_wide_m_rotator_cuff_stab",
    "exerciseId": "ex_lat_pulldown_wide",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Shoulder joint control"
  },
  {
    "id": "emc_ex_lat_pulldown_close_grip_m_latissimus_dorsi_pri",
    "exerciseId": "ex_lat_pulldown_close_grip",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 65,
    "role": "Primary",
    "notes": "Sagittal plane lat extension"
  },
  {
    "id": "emc_ex_lat_pulldown_close_grip_m_biceps_long_head_pri",
    "exerciseId": "ex_lat_pulldown_close_grip",
    "muscleId": "m_biceps_long_head",
    "percentage": 20,
    "role": "Primary",
    "notes": "Neutral arm flexion"
  },
  {
    "id": "emc_ex_lat_pulldown_close_grip_m_trapezius_middle_sec",
    "exerciseId": "ex_lat_pulldown_close_grip",
    "muscleId": "m_trapezius_middle",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Mid-back retraction"
  },
  {
    "id": "emc_ex_lat_pulldown_close_grip_m_rotator_cuff_stab",
    "exerciseId": "ex_lat_pulldown_close_grip",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Scapular stability"
  },
  {
    "id": "emc_ex_lat_pulldown_reverse_grip_m_latissimus_dorsi_pri",
    "exerciseId": "ex_lat_pulldown_reverse_grip",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 60,
    "role": "Primary",
    "notes": "Lower lat focus"
  },
  {
    "id": "emc_ex_lat_pulldown_reverse_grip_m_biceps_short_head_pri",
    "exerciseId": "ex_lat_pulldown_reverse_grip",
    "muscleId": "m_biceps_short_head",
    "percentage": 25,
    "role": "Primary",
    "notes": "Supinated bicep synergy"
  },
  {
    "id": "emc_ex_lat_pulldown_reverse_grip_m_trapezius_lower_sec",
    "exerciseId": "ex_lat_pulldown_reverse_grip",
    "muscleId": "m_trapezius_lower",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Scapular depression"
  },
  {
    "id": "emc_ex_lat_pulldown_reverse_grip_m_rotator_cuff_stab",
    "exerciseId": "ex_lat_pulldown_reverse_grip",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Shoulder control"
  },
  {
    "id": "emc_ex_seated_cable_row_m_trapezius_middle_pri",
    "exerciseId": "ex_seated_cable_row",
    "muscleId": "m_trapezius_middle",
    "percentage": 45,
    "role": "Primary",
    "notes": "Rhomboid & mid-trap retraction"
  },
  {
    "id": "emc_ex_seated_cable_row_m_latissimus_dorsi_pri",
    "exerciseId": "ex_seated_cable_row",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 35,
    "role": "Primary",
    "notes": "Horizontal lat extension"
  },
  {
    "id": "emc_ex_seated_cable_row_m_biceps_long_head_sec",
    "exerciseId": "ex_seated_cable_row",
    "muscleId": "m_biceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Elbow flexion"
  },
  {
    "id": "emc_ex_seated_cable_row_m_deltoid_posterior_sec",
    "exerciseId": "ex_seated_cable_row",
    "muscleId": "m_deltoid_posterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Rear delt synergy"
  },
  {
    "id": "emc_ex_seated_cable_row_m_erector_spinae_stab",
    "exerciseId": "ex_seated_cable_row",
    "muscleId": "m_erector_spinae",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Isometric upright posture"
  },
  {
    "id": "emc_ex_single_arm_dumbbell_row_m_latissimus_dorsi_pri",
    "exerciseId": "ex_single_arm_dumbbell_row",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 55,
    "role": "Primary",
    "notes": "Unilateral lat row"
  },
  {
    "id": "emc_ex_single_arm_dumbbell_row_m_trapezius_middle_pri",
    "exerciseId": "ex_single_arm_dumbbell_row",
    "muscleId": "m_trapezius_middle",
    "percentage": 25,
    "role": "Primary",
    "notes": "Scapular retraction"
  },
  {
    "id": "emc_ex_single_arm_dumbbell_row_m_biceps_long_head_sec",
    "exerciseId": "ex_single_arm_dumbbell_row",
    "muscleId": "m_biceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Arm flexion"
  },
  {
    "id": "emc_ex_single_arm_dumbbell_row_m_deltoid_posterior_sec",
    "exerciseId": "ex_single_arm_dumbbell_row",
    "muscleId": "m_deltoid_posterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Rear shoulder"
  },
  {
    "id": "emc_ex_single_arm_dumbbell_row_m_core_stab",
    "exerciseId": "ex_single_arm_dumbbell_row",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Anti-rotation core"
  },
  {
    "id": "emc_ex_meadows_row_m_teres_major_pri",
    "exerciseId": "ex_meadows_row",
    "muscleId": "m_teres_major",
    "percentage": 40,
    "role": "Primary",
    "notes": "Upper lat / teres emphasis"
  },
  {
    "id": "emc_ex_meadows_row_m_latissimus_dorsi_pri",
    "exerciseId": "ex_meadows_row",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 30,
    "role": "Primary",
    "notes": "Lat pull"
  },
  {
    "id": "emc_ex_meadows_row_m_deltoid_posterior_sec",
    "exerciseId": "ex_meadows_row",
    "muscleId": "m_deltoid_posterior",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Rear delt contraction"
  },
  {
    "id": "emc_ex_meadows_row_m_biceps_short_head_sec",
    "exerciseId": "ex_meadows_row",
    "muscleId": "m_biceps_short_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Bicep assist"
  },
  {
    "id": "emc_ex_meadows_row_m_obliques_stab",
    "exerciseId": "ex_meadows_row",
    "muscleId": "m_obliques",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Anti-rotational stability"
  },
  {
    "id": "emc_ex_kroc_row_m_latissimus_dorsi_pri",
    "exerciseId": "ex_kroc_row",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 50,
    "role": "Primary",
    "notes": "Heavy overload lat work"
  },
  {
    "id": "emc_ex_kroc_row_m_trapezius_middle_pri",
    "exerciseId": "ex_kroc_row",
    "muscleId": "m_trapezius_middle",
    "percentage": 25,
    "role": "Primary",
    "notes": "Mid-back thickness"
  },
  {
    "id": "emc_ex_kroc_row_m_forearms_sec",
    "exerciseId": "ex_kroc_row",
    "muscleId": "m_forearms",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Crushing grip load"
  },
  {
    "id": "emc_ex_kroc_row_m_deltoid_posterior_sec",
    "exerciseId": "ex_kroc_row",
    "muscleId": "m_deltoid_posterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Rear delt"
  },
  {
    "id": "emc_ex_kroc_row_m_erector_spinae_stab",
    "exerciseId": "ex_kroc_row",
    "muscleId": "m_erector_spinae",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Spinal support"
  },
  {
    "id": "emc_ex_t_bar_row_chest_supported_m_trapezius_middle_pri",
    "exerciseId": "ex_t_bar_row_chest_supported",
    "muscleId": "m_trapezius_middle",
    "percentage": 50,
    "role": "Primary",
    "notes": "Pure rhomboid & mid-trap squeeze"
  },
  {
    "id": "emc_ex_t_bar_row_chest_supported_m_latissimus_dorsi_pri",
    "exerciseId": "ex_t_bar_row_chest_supported",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 30,
    "role": "Primary",
    "notes": "Lat adduction"
  },
  {
    "id": "emc_ex_t_bar_row_chest_supported_m_deltoid_posterior_sec",
    "exerciseId": "ex_t_bar_row_chest_supported",
    "muscleId": "m_deltoid_posterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Rear delt"
  },
  {
    "id": "emc_ex_t_bar_row_chest_supported_m_biceps_long_head_sec",
    "exerciseId": "ex_t_bar_row_chest_supported",
    "muscleId": "m_biceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Elbow flexion"
  },
  {
    "id": "emc_ex_t_bar_row_chest_supported_m_rotator_cuff_stab",
    "exerciseId": "ex_t_bar_row_chest_supported",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Shoulder control"
  },
  {
    "id": "emc_ex_t_bar_row_free_weight_m_latissimus_dorsi_pri",
    "exerciseId": "ex_t_bar_row_free_weight",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 45,
    "role": "Primary",
    "notes": "Lat extension drive"
  },
  {
    "id": "emc_ex_t_bar_row_free_weight_m_trapezius_middle_pri",
    "exerciseId": "ex_t_bar_row_free_weight",
    "muscleId": "m_trapezius_middle",
    "percentage": 30,
    "role": "Primary",
    "notes": "Mid-back retraction"
  },
  {
    "id": "emc_ex_t_bar_row_free_weight_m_biceps_long_head_sec",
    "exerciseId": "ex_t_bar_row_free_weight",
    "muscleId": "m_biceps_long_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Arm flexion"
  },
  {
    "id": "emc_ex_t_bar_row_free_weight_m_deltoid_posterior_sec",
    "exerciseId": "ex_t_bar_row_free_weight",
    "muscleId": "m_deltoid_posterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Rear delt"
  },
  {
    "id": "emc_ex_t_bar_row_free_weight_m_erector_spinae_stab",
    "exerciseId": "ex_t_bar_row_free_weight",
    "muscleId": "m_erector_spinae",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Spinal erector brace"
  },
  {
    "id": "emc_ex_t_bar_row_free_weight_m_hamstrings_stab",
    "exerciseId": "ex_t_bar_row_free_weight",
    "muscleId": "m_hamstrings",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Hamstring support"
  },
  {
    "id": "emc_ex_chest_supported_machine_row_m_trapezius_middle_pri",
    "exerciseId": "ex_chest_supported_machine_row",
    "muscleId": "m_trapezius_middle",
    "percentage": 50,
    "role": "Primary",
    "notes": "Mid-back & rhomboids"
  },
  {
    "id": "emc_ex_chest_supported_machine_row_m_latissimus_dorsi_pri",
    "exerciseId": "ex_chest_supported_machine_row",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 35,
    "role": "Primary",
    "notes": "Lats"
  },
  {
    "id": "emc_ex_chest_supported_machine_row_m_biceps_short_head_sec",
    "exerciseId": "ex_chest_supported_machine_row",
    "muscleId": "m_biceps_short_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Biceps synergy"
  },
  {
    "id": "emc_ex_chest_supported_machine_row_m_rotator_cuff_stab",
    "exerciseId": "ex_chest_supported_machine_row",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Scapular tracking"
  },
  {
    "id": "emc_ex_straight_arm_cable_pulldown_m_latissimus_dorsi_pri",
    "exerciseId": "ex_straight_arm_cable_pulldown",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 75,
    "role": "Primary",
    "notes": "Pure shoulder extension isolation"
  },
  {
    "id": "emc_ex_straight_arm_cable_pulldown_m_teres_major_pri",
    "exerciseId": "ex_straight_arm_cable_pulldown",
    "muscleId": "m_teres_major",
    "percentage": 15,
    "role": "Primary",
    "notes": "Upper lat synergy"
  },
  {
    "id": "emc_ex_straight_arm_cable_pulldown_m_triceps_long_head_sec",
    "exerciseId": "ex_straight_arm_cable_pulldown",
    "muscleId": "m_triceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Isometric elbow extension support"
  },
  {
    "id": "emc_ex_straight_arm_cable_pulldown_m_rectus_abdominis_stab",
    "exerciseId": "ex_straight_arm_cable_pulldown",
    "muscleId": "m_rectus_abdominis",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Anti-extension core brace"
  },
  {
    "id": "emc_ex_straight_arm_cable_pulldown_m_serratus_anterior_stab",
    "exerciseId": "ex_straight_arm_cable_pulldown",
    "muscleId": "m_serratus_anterior",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Ribcage stabilization"
  },
  {
    "id": "emc_ex_dumbbell_pullover_m_latissimus_dorsi_pri",
    "exerciseId": "ex_dumbbell_pullover",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 65,
    "role": "Primary",
    "notes": "Long-lever lat extension"
  },
  {
    "id": "emc_ex_dumbbell_pullover_m_teres_major_pri",
    "exerciseId": "ex_dumbbell_pullover",
    "muscleId": "m_teres_major",
    "percentage": 15,
    "role": "Primary",
    "notes": "Teres synergy"
  },
  {
    "id": "emc_ex_dumbbell_pullover_m_chest_costal_sec",
    "exerciseId": "ex_dumbbell_pullover",
    "muscleId": "m_chest_costal",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Lower chest stretch assistance"
  },
  {
    "id": "emc_ex_dumbbell_pullover_m_triceps_long_head_sec",
    "exerciseId": "ex_dumbbell_pullover",
    "muscleId": "m_triceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Shoulder extension assist"
  },
  {
    "id": "emc_ex_dumbbell_pullover_m_serratus_anterior_stab",
    "exerciseId": "ex_dumbbell_pullover",
    "muscleId": "m_serratus_anterior",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Scapular control"
  },
  {
    "id": "emc_ex_dumbbell_pullover_m_core_stab",
    "exerciseId": "ex_dumbbell_pullover",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Pelvic anchor"
  },
  {
    "id": "emc_ex_single_arm_cable_lat_pulldown_m_latissimus_dorsi_pri",
    "exerciseId": "ex_single_arm_cable_lat_pulldown",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 75,
    "role": "Primary",
    "notes": "Optimized lat fiber alignment"
  },
  {
    "id": "emc_ex_single_arm_cable_lat_pulldown_m_teres_major_pri",
    "exerciseId": "ex_single_arm_cable_lat_pulldown",
    "muscleId": "m_teres_major",
    "percentage": 10,
    "role": "Primary",
    "notes": "Upper lat synergy"
  },
  {
    "id": "emc_ex_single_arm_cable_lat_pulldown_m_biceps_short_head_sec",
    "exerciseId": "ex_single_arm_cable_lat_pulldown",
    "muscleId": "m_biceps_short_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Arm flexion"
  },
  {
    "id": "emc_ex_single_arm_cable_lat_pulldown_m_obliques_stab",
    "exerciseId": "ex_single_arm_cable_lat_pulldown",
    "muscleId": "m_obliques",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Anti-rotation core"
  },
  {
    "id": "emc_ex_inverted_row_m_trapezius_middle_pri",
    "exerciseId": "ex_inverted_row",
    "muscleId": "m_trapezius_middle",
    "percentage": 45,
    "role": "Primary",
    "notes": "Scapular retraction"
  },
  {
    "id": "emc_ex_inverted_row_m_latissimus_dorsi_pri",
    "exerciseId": "ex_inverted_row",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 35,
    "role": "Primary",
    "notes": "Horizontal pulling"
  },
  {
    "id": "emc_ex_inverted_row_m_biceps_long_head_sec",
    "exerciseId": "ex_inverted_row",
    "muscleId": "m_biceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Bicep assist"
  },
  {
    "id": "emc_ex_inverted_row_m_deltoid_posterior_sec",
    "exerciseId": "ex_inverted_row",
    "muscleId": "m_deltoid_posterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Rear delt"
  },
  {
    "id": "emc_ex_inverted_row_m_rectus_abdominis_stab",
    "exerciseId": "ex_inverted_row",
    "muscleId": "m_rectus_abdominis",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Plank core brace"
  },
  {
    "id": "emc_ex_inverted_row_m_gluteus_maximus_stab",
    "exerciseId": "ex_inverted_row",
    "muscleId": "m_gluteus_maximus",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Hip extension"
  },
  {
    "id": "emc_ex_rack_pull_m_erector_spinae_pri",
    "exerciseId": "ex_rack_pull",
    "muscleId": "m_erector_spinae",
    "percentage": 50,
    "role": "Primary",
    "notes": "Spinal extension overload"
  },
  {
    "id": "emc_ex_rack_pull_m_trapezius_upper_pri",
    "exerciseId": "ex_rack_pull",
    "muscleId": "m_trapezius_upper",
    "percentage": 25,
    "role": "Primary",
    "notes": "Heavy trap hang"
  },
  {
    "id": "emc_ex_rack_pull_m_latissimus_dorsi_sec",
    "exerciseId": "ex_rack_pull",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Bar path lat engagement"
  },
  {
    "id": "emc_ex_rack_pull_m_gluteus_maximus_sec",
    "exerciseId": "ex_rack_pull",
    "muscleId": "m_gluteus_maximus",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Hip lockout"
  },
  {
    "id": "emc_ex_rack_pull_m_forearms_stab",
    "exerciseId": "ex_rack_pull",
    "muscleId": "m_forearms",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Massive grip overload"
  },
  {
    "id": "emc_ex_good_morning_barbell_m_erector_spinae_pri",
    "exerciseId": "ex_good_morning_barbell",
    "muscleId": "m_erector_spinae",
    "percentage": 55,
    "role": "Primary",
    "notes": "Dynamic spinal erector extension"
  },
  {
    "id": "emc_ex_good_morning_barbell_m_hamstrings_pri",
    "exerciseId": "ex_good_morning_barbell",
    "muscleId": "m_hamstrings",
    "percentage": 30,
    "role": "Primary",
    "notes": "Hamstring hip extension"
  },
  {
    "id": "emc_ex_good_morning_barbell_m_gluteus_maximus_sec",
    "exerciseId": "ex_good_morning_barbell",
    "muscleId": "m_gluteus_maximus",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Glute lockout"
  },
  {
    "id": "emc_ex_good_morning_barbell_m_core_stab",
    "exerciseId": "ex_good_morning_barbell",
    "muscleId": "m_core",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Abdominal bracing"
  },
  {
    "id": "emc_ex_hyperextension_back_m_erector_spinae_pri",
    "exerciseId": "ex_hyperextension_back",
    "muscleId": "m_erector_spinae",
    "percentage": 65,
    "role": "Primary",
    "notes": "Spinal extension"
  },
  {
    "id": "emc_ex_hyperextension_back_m_gluteus_maximus_sec",
    "exerciseId": "ex_hyperextension_back",
    "muscleId": "m_gluteus_maximus",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Glute extension"
  },
  {
    "id": "emc_ex_hyperextension_back_m_hamstrings_sec",
    "exerciseId": "ex_hyperextension_back",
    "muscleId": "m_hamstrings",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Hamstring assist"
  },
  {
    "id": "emc_ex_hyperextension_back_m_core_stab",
    "exerciseId": "ex_hyperextension_back",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Trunk stability"
  },
  {
    "id": "emc_ex_reverse_hyperextension_m_erector_spinae_pri",
    "exerciseId": "ex_reverse_hyperextension",
    "muscleId": "m_erector_spinae",
    "percentage": 50,
    "role": "Primary",
    "notes": "Lumbar extension without spinal compression"
  },
  {
    "id": "emc_ex_reverse_hyperextension_m_gluteus_maximus_pri",
    "exerciseId": "ex_reverse_hyperextension",
    "muscleId": "m_gluteus_maximus",
    "percentage": 30,
    "role": "Primary",
    "notes": "Hip extension"
  },
  {
    "id": "emc_ex_reverse_hyperextension_m_hamstrings_sec",
    "exerciseId": "ex_reverse_hyperextension",
    "muscleId": "m_hamstrings",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Hamstrings"
  },
  {
    "id": "emc_ex_reverse_hyperextension_m_latissimus_dorsi_stab",
    "exerciseId": "ex_reverse_hyperextension",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Handle brace"
  },
  {
    "id": "emc_ex_snatch_grip_deadlift_m_erector_spinae_pri",
    "exerciseId": "ex_snatch_grip_deadlift",
    "muscleId": "m_erector_spinae",
    "percentage": 45,
    "role": "Primary",
    "notes": "Extended range spinal extension"
  },
  {
    "id": "emc_ex_snatch_grip_deadlift_m_trapezius_upper_pri",
    "exerciseId": "ex_snatch_grip_deadlift",
    "muscleId": "m_trapezius_upper",
    "percentage": 25,
    "role": "Primary",
    "notes": "Wide grip trap overload"
  },
  {
    "id": "emc_ex_snatch_grip_deadlift_m_latissimus_dorsi_sec",
    "exerciseId": "ex_snatch_grip_deadlift",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Lat stability"
  },
  {
    "id": "emc_ex_snatch_grip_deadlift_m_hamstrings_sec",
    "exerciseId": "ex_snatch_grip_deadlift",
    "muscleId": "m_hamstrings",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Hamstrings"
  },
  {
    "id": "emc_ex_snatch_grip_deadlift_m_forearms_stab",
    "exerciseId": "ex_snatch_grip_deadlift",
    "muscleId": "m_forearms",
    "percentage": 30,
    "role": "Stabilizer",
    "notes": "Extreme grip challenge"
  },
  {
    "id": "emc_ex_seal_row_m_trapezius_middle_pri",
    "exerciseId": "ex_seal_row",
    "muscleId": "m_trapezius_middle",
    "percentage": 50,
    "role": "Primary",
    "notes": "Strict mid-trap and rhomboid pull"
  },
  {
    "id": "emc_ex_seal_row_m_latissimus_dorsi_pri",
    "exerciseId": "ex_seal_row",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 30,
    "role": "Primary",
    "notes": "Lats"
  },
  {
    "id": "emc_ex_seal_row_m_deltoid_posterior_sec",
    "exerciseId": "ex_seal_row",
    "muscleId": "m_deltoid_posterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Rear delt"
  },
  {
    "id": "emc_ex_seal_row_m_biceps_short_head_sec",
    "exerciseId": "ex_seal_row",
    "muscleId": "m_biceps_short_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Biceps"
  },
  {
    "id": "emc_ex_seal_row_m_rotator_cuff_stab",
    "exerciseId": "ex_seal_row",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Scapular tracking"
  },
  {
    "id": "emc_ex_neutral_grip_dumbbell_row_m_latissimus_dorsi_pri",
    "exerciseId": "ex_neutral_grip_dumbbell_row",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 45,
    "role": "Primary",
    "notes": "Lats"
  },
  {
    "id": "emc_ex_neutral_grip_dumbbell_row_m_trapezius_middle_pri",
    "exerciseId": "ex_neutral_grip_dumbbell_row",
    "muscleId": "m_trapezius_middle",
    "percentage": 35,
    "role": "Primary",
    "notes": "Mid-back"
  },
  {
    "id": "emc_ex_neutral_grip_dumbbell_row_m_biceps_long_head_sec",
    "exerciseId": "ex_neutral_grip_dumbbell_row",
    "muscleId": "m_biceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Bicep assist"
  },
  {
    "id": "emc_ex_neutral_grip_dumbbell_row_m_deltoid_posterior_sec",
    "exerciseId": "ex_neutral_grip_dumbbell_row",
    "muscleId": "m_deltoid_posterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Rear shoulder"
  },
  {
    "id": "emc_ex_neutral_grip_dumbbell_row_m_rotator_cuff_stab",
    "exerciseId": "ex_neutral_grip_dumbbell_row",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Shoulder stability"
  },
  {
    "id": "emc_ex_barbell_shrug_m_trapezius_upper_pri",
    "exerciseId": "ex_barbell_shrug",
    "muscleId": "m_trapezius_upper",
    "percentage": 85,
    "role": "Primary",
    "notes": "Direct scapular elevation"
  },
  {
    "id": "emc_ex_barbell_shrug_m_trapezius_middle_sec",
    "exerciseId": "ex_barbell_shrug",
    "muscleId": "m_trapezius_middle",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Mid-trap support"
  },
  {
    "id": "emc_ex_barbell_shrug_m_forearms_stab",
    "exerciseId": "ex_barbell_shrug",
    "muscleId": "m_forearms",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Grip endurance"
  },
  {
    "id": "emc_ex_dumbbell_shrug_m_trapezius_upper_pri",
    "exerciseId": "ex_dumbbell_shrug",
    "muscleId": "m_trapezius_upper",
    "percentage": 85,
    "role": "Primary",
    "notes": "Upper trapezius elevation"
  },
  {
    "id": "emc_ex_dumbbell_shrug_m_trapezius_middle_sec",
    "exerciseId": "ex_dumbbell_shrug",
    "muscleId": "m_trapezius_middle",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Retraction synergy"
  },
  {
    "id": "emc_ex_dumbbell_shrug_m_forearms_stab",
    "exerciseId": "ex_dumbbell_shrug",
    "muscleId": "m_forearms",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Grip"
  },
  {
    "id": "emc_ex_cable_shrug_m_trapezius_upper_pri",
    "exerciseId": "ex_cable_shrug",
    "muscleId": "m_trapezius_upper",
    "percentage": 85,
    "role": "Primary",
    "notes": "Constant tension trap work"
  },
  {
    "id": "emc_ex_cable_shrug_m_trapezius_middle_sec",
    "exerciseId": "ex_cable_shrug",
    "muscleId": "m_trapezius_middle",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Mid-back"
  },
  {
    "id": "emc_ex_cable_shrug_m_core_stab",
    "exerciseId": "ex_cable_shrug",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Standing posture"
  },
  {
    "id": "emc_ex_behind_back_barbell_shrug_m_trapezius_upper_pri",
    "exerciseId": "ex_behind_back_barbell_shrug",
    "muscleId": "m_trapezius_upper",
    "percentage": 70,
    "role": "Primary",
    "notes": "Scapular elevation"
  },
  {
    "id": "emc_ex_behind_back_barbell_shrug_m_trapezius_middle_pri",
    "exerciseId": "ex_behind_back_barbell_shrug",
    "muscleId": "m_trapezius_middle",
    "percentage": 20,
    "role": "Primary",
    "notes": "Posterior retraction"
  },
  {
    "id": "emc_ex_behind_back_barbell_shrug_m_deltoid_posterior_sec",
    "exerciseId": "ex_behind_back_barbell_shrug",
    "muscleId": "m_deltoid_posterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Rear delt synergy"
  },
  {
    "id": "emc_ex_behind_back_barbell_shrug_m_forearms_stab",
    "exerciseId": "ex_behind_back_barbell_shrug",
    "muscleId": "m_forearms",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Grip"
  },
  {
    "id": "emc_ex_lat_pulldown_behind_neck_m_latissimus_dorsi_pri",
    "exerciseId": "ex_lat_pulldown_behind_neck",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 55,
    "role": "Primary",
    "notes": "Lat adduction"
  },
  {
    "id": "emc_ex_lat_pulldown_behind_neck_m_trapezius_middle_pri",
    "exerciseId": "ex_lat_pulldown_behind_neck",
    "muscleId": "m_trapezius_middle",
    "percentage": 25,
    "role": "Primary",
    "notes": "Mid-back retraction"
  },
  {
    "id": "emc_ex_lat_pulldown_behind_neck_m_trapezius_lower_sec",
    "exerciseId": "ex_lat_pulldown_behind_neck",
    "muscleId": "m_trapezius_lower",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Scapular depression"
  },
  {
    "id": "emc_ex_lat_pulldown_behind_neck_m_biceps_short_head_sec",
    "exerciseId": "ex_lat_pulldown_behind_neck",
    "muscleId": "m_biceps_short_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Bicep assist"
  },
  {
    "id": "emc_ex_lat_pulldown_behind_neck_m_rotator_cuff_stab",
    "exerciseId": "ex_lat_pulldown_behind_neck",
    "muscleId": "m_rotator_cuff",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Glenohumeral caution"
  },
  {
    "id": "emc_ex_v_bar_lat_pulldown_m_latissimus_dorsi_pri",
    "exerciseId": "ex_v_bar_lat_pulldown",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 65,
    "role": "Primary",
    "notes": "Lats"
  },
  {
    "id": "emc_ex_v_bar_lat_pulldown_m_teres_major_pri",
    "exerciseId": "ex_v_bar_lat_pulldown",
    "muscleId": "m_teres_major",
    "percentage": 15,
    "role": "Primary",
    "notes": "Teres major"
  },
  {
    "id": "emc_ex_v_bar_lat_pulldown_m_biceps_long_head_sec",
    "exerciseId": "ex_v_bar_lat_pulldown",
    "muscleId": "m_biceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Biceps"
  },
  {
    "id": "emc_ex_v_bar_lat_pulldown_m_trapezius_lower_sec",
    "exerciseId": "ex_v_bar_lat_pulldown",
    "muscleId": "m_trapezius_lower",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Lower traps"
  },
  {
    "id": "emc_ex_v_bar_lat_pulldown_m_rotator_cuff_stab",
    "exerciseId": "ex_v_bar_lat_pulldown",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Joint stability"
  },
  {
    "id": "emc_ex_barbell_overhead_press_m_deltoid_anterior_pri",
    "exerciseId": "ex_barbell_overhead_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 55,
    "role": "Primary",
    "notes": "Primary vertical shoulder flexion"
  },
  {
    "id": "emc_ex_barbell_overhead_press_m_deltoid_lateral_pri",
    "exerciseId": "ex_barbell_overhead_press",
    "muscleId": "m_deltoid_lateral",
    "percentage": 20,
    "role": "Primary",
    "notes": "Shoulder abduction assist"
  },
  {
    "id": "emc_ex_barbell_overhead_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_barbell_overhead_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Overhead elbow extension"
  },
  {
    "id": "emc_ex_barbell_overhead_press_m_trapezius_upper_sec",
    "exerciseId": "ex_barbell_overhead_press",
    "muscleId": "m_trapezius_upper",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Scapular upward rotation"
  },
  {
    "id": "emc_ex_barbell_overhead_press_m_core_stab",
    "exerciseId": "ex_barbell_overhead_press",
    "muscleId": "m_core",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Standing spinal brace"
  },
  {
    "id": "emc_ex_barbell_overhead_press_m_rotator_cuff_stab",
    "exerciseId": "ex_barbell_overhead_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Overhead joint centering"
  },
  {
    "id": "emc_ex_seated_dumbbell_shoulder_press_m_deltoid_anterior_pri",
    "exerciseId": "ex_seated_dumbbell_shoulder_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 55,
    "role": "Primary",
    "notes": "Front deltoid drive"
  },
  {
    "id": "emc_ex_seated_dumbbell_shoulder_press_m_deltoid_lateral_pri",
    "exerciseId": "ex_seated_dumbbell_shoulder_press",
    "muscleId": "m_deltoid_lateral",
    "percentage": 25,
    "role": "Primary",
    "notes": "Side deltoid assistance"
  },
  {
    "id": "emc_ex_seated_dumbbell_shoulder_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_seated_dumbbell_shoulder_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Elbow lockout"
  },
  {
    "id": "emc_ex_seated_dumbbell_shoulder_press_m_trapezius_upper_sec",
    "exerciseId": "ex_seated_dumbbell_shoulder_press",
    "muscleId": "m_trapezius_upper",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Trapezius support"
  },
  {
    "id": "emc_ex_seated_dumbbell_shoulder_press_m_rotator_cuff_stab",
    "exerciseId": "ex_seated_dumbbell_shoulder_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Unilateral joint control"
  },
  {
    "id": "emc_ex_standing_dumbbell_shoulder_press_m_deltoid_anterior_pri",
    "exerciseId": "ex_standing_dumbbell_shoulder_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 50,
    "role": "Primary",
    "notes": "Anterior delt"
  },
  {
    "id": "emc_ex_standing_dumbbell_shoulder_press_m_deltoid_lateral_pri",
    "exerciseId": "ex_standing_dumbbell_shoulder_press",
    "muscleId": "m_deltoid_lateral",
    "percentage": 25,
    "role": "Primary",
    "notes": "Lateral delt"
  },
  {
    "id": "emc_ex_standing_dumbbell_shoulder_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_standing_dumbbell_shoulder_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Triceps"
  },
  {
    "id": "emc_ex_standing_dumbbell_shoulder_press_m_trapezius_upper_sec",
    "exerciseId": "ex_standing_dumbbell_shoulder_press",
    "muscleId": "m_trapezius_upper",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Traps"
  },
  {
    "id": "emc_ex_standing_dumbbell_shoulder_press_m_core_stab",
    "exerciseId": "ex_standing_dumbbell_shoulder_press",
    "muscleId": "m_core",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Anti-extension standing core"
  },
  {
    "id": "emc_ex_arnold_press_m_deltoid_anterior_pri",
    "exerciseId": "ex_arnold_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 45,
    "role": "Primary",
    "notes": "Front delt press"
  },
  {
    "id": "emc_ex_arnold_press_m_deltoid_lateral_pri",
    "exerciseId": "ex_arnold_press",
    "muscleId": "m_deltoid_lateral",
    "percentage": 35,
    "role": "Primary",
    "notes": "Rotational abduction"
  },
  {
    "id": "emc_ex_arnold_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_arnold_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Extension"
  },
  {
    "id": "emc_ex_arnold_press_m_deltoid_posterior_sec",
    "exerciseId": "ex_arnold_press",
    "muscleId": "m_deltoid_posterior",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Rotational initiation"
  },
  {
    "id": "emc_ex_arnold_press_m_rotator_cuff_stab",
    "exerciseId": "ex_arnold_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Continuous rotational stabilization"
  },
  {
    "id": "emc_ex_behind_neck_press_m_deltoid_lateral_pri",
    "exerciseId": "ex_behind_neck_press",
    "muscleId": "m_deltoid_lateral",
    "percentage": 45,
    "role": "Primary",
    "notes": "High lateral delt recruitment"
  },
  {
    "id": "emc_ex_behind_neck_press_m_deltoid_anterior_pri",
    "exerciseId": "ex_behind_neck_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 35,
    "role": "Primary",
    "notes": "Anterior delt"
  },
  {
    "id": "emc_ex_behind_neck_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_behind_neck_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Triceps"
  },
  {
    "id": "emc_ex_behind_neck_press_m_trapezius_upper_sec",
    "exerciseId": "ex_behind_neck_press",
    "muscleId": "m_trapezius_upper",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Upper traps"
  },
  {
    "id": "emc_ex_behind_neck_press_m_rotator_cuff_stab",
    "exerciseId": "ex_behind_neck_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "High mobility demand"
  },
  {
    "id": "emc_ex_push_press_barbell_m_deltoid_anterior_pri",
    "exerciseId": "ex_push_press_barbell",
    "muscleId": "m_deltoid_anterior",
    "percentage": 45,
    "role": "Primary",
    "notes": "Overhead pressing drive"
  },
  {
    "id": "emc_ex_push_press_barbell_m_deltoid_lateral_pri",
    "exerciseId": "ex_push_press_barbell",
    "muscleId": "m_deltoid_lateral",
    "percentage": 25,
    "role": "Primary",
    "notes": "Side delt support"
  },
  {
    "id": "emc_ex_push_press_barbell_m_triceps_lateral_head_sec",
    "exerciseId": "ex_push_press_barbell",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Powerful lockout"
  },
  {
    "id": "emc_ex_push_press_barbell_m_quadriceps_sec",
    "exerciseId": "ex_push_press_barbell",
    "muscleId": "m_quadriceps",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Dip drive assist"
  },
  {
    "id": "emc_ex_push_press_barbell_m_core_stab",
    "exerciseId": "ex_push_press_barbell",
    "muscleId": "m_core",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Explosive core transfer"
  },
  {
    "id": "emc_ex_push_press_barbell_m_rotator_cuff_stab",
    "exerciseId": "ex_push_press_barbell",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Overhead catch"
  },
  {
    "id": "emc_ex_machine_shoulder_press_m_deltoid_anterior_pri",
    "exerciseId": "ex_machine_shoulder_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 60,
    "role": "Primary",
    "notes": "Front delt focus"
  },
  {
    "id": "emc_ex_machine_shoulder_press_m_deltoid_lateral_pri",
    "exerciseId": "ex_machine_shoulder_press",
    "muscleId": "m_deltoid_lateral",
    "percentage": 20,
    "role": "Primary",
    "notes": "Side delt"
  },
  {
    "id": "emc_ex_machine_shoulder_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_machine_shoulder_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Triceps extension"
  },
  {
    "id": "emc_ex_machine_shoulder_press_m_rotator_cuff_stab",
    "exerciseId": "ex_machine_shoulder_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Machine guided"
  },
  {
    "id": "emc_ex_smith_machine_overhead_press_m_deltoid_anterior_pri",
    "exerciseId": "ex_smith_machine_overhead_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 60,
    "role": "Primary",
    "notes": "Guided overhead press"
  },
  {
    "id": "emc_ex_smith_machine_overhead_press_m_deltoid_lateral_pri",
    "exerciseId": "ex_smith_machine_overhead_press",
    "muscleId": "m_deltoid_lateral",
    "percentage": 20,
    "role": "Primary",
    "notes": "Lateral delt"
  },
  {
    "id": "emc_ex_smith_machine_overhead_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_smith_machine_overhead_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Triceps lockout"
  },
  {
    "id": "emc_ex_smith_machine_overhead_press_m_rotator_cuff_stab",
    "exerciseId": "ex_smith_machine_overhead_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Track stabilized"
  },
  {
    "id": "emc_ex_dumbbell_lateral_raise_m_deltoid_lateral_pri",
    "exerciseId": "ex_dumbbell_lateral_raise",
    "muscleId": "m_deltoid_lateral",
    "percentage": 85,
    "role": "Primary",
    "notes": "Pure shoulder abduction in scapular plane"
  },
  {
    "id": "emc_ex_dumbbell_lateral_raise_m_trapezius_upper_sec",
    "exerciseId": "ex_dumbbell_lateral_raise",
    "muscleId": "m_trapezius_upper",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Scapular elevation synergy"
  },
  {
    "id": "emc_ex_dumbbell_lateral_raise_m_deltoid_anterior_sec",
    "exerciseId": "ex_dumbbell_lateral_raise",
    "muscleId": "m_deltoid_anterior",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Anterior fiber assist"
  },
  {
    "id": "emc_ex_dumbbell_lateral_raise_m_rotator_cuff_stab",
    "exerciseId": "ex_dumbbell_lateral_raise",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Humeral head seating"
  },
  {
    "id": "emc_ex_dumbbell_lateral_raise_m_forearms_stab",
    "exerciseId": "ex_dumbbell_lateral_raise",
    "muscleId": "m_forearms",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Grip"
  },
  {
    "id": "emc_ex_cable_lateral_raise_m_deltoid_lateral_pri",
    "exerciseId": "ex_cable_lateral_raise",
    "muscleId": "m_deltoid_lateral",
    "percentage": 90,
    "role": "Primary",
    "notes": "Constant tension lateral deltoid"
  },
  {
    "id": "emc_ex_cable_lateral_raise_m_trapezius_upper_sec",
    "exerciseId": "ex_cable_lateral_raise",
    "muscleId": "m_trapezius_upper",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Upper trap assistance"
  },
  {
    "id": "emc_ex_cable_lateral_raise_m_rotator_cuff_stab",
    "exerciseId": "ex_cable_lateral_raise",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Joint tracking"
  },
  {
    "id": "emc_ex_leaning_cable_lateral_raise_m_deltoid_lateral_pri",
    "exerciseId": "ex_leaning_cable_lateral_raise",
    "muscleId": "m_deltoid_lateral",
    "percentage": 90,
    "role": "Primary",
    "notes": "Stretched position lateral deltoid"
  },
  {
    "id": "emc_ex_leaning_cable_lateral_raise_m_trapezius_upper_sec",
    "exerciseId": "ex_leaning_cable_lateral_raise",
    "muscleId": "m_trapezius_upper",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Scapular rotation"
  },
  {
    "id": "emc_ex_leaning_cable_lateral_raise_m_rotator_cuff_stab",
    "exerciseId": "ex_leaning_cable_lateral_raise",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Joint stability"
  },
  {
    "id": "emc_ex_machine_lateral_raise_m_deltoid_lateral_pri",
    "exerciseId": "ex_machine_lateral_raise",
    "muscleId": "m_deltoid_lateral",
    "percentage": 90,
    "role": "Primary",
    "notes": "Isolated elbow lever abduction"
  },
  {
    "id": "emc_ex_machine_lateral_raise_m_trapezius_upper_sec",
    "exerciseId": "ex_machine_lateral_raise",
    "muscleId": "m_trapezius_upper",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Trapezius support"
  },
  {
    "id": "emc_ex_machine_lateral_raise_m_rotator_cuff_stab",
    "exerciseId": "ex_machine_lateral_raise",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Shoulder tracking"
  },
  {
    "id": "emc_ex_behind_back_cable_lateral_raise_m_deltoid_lateral_pri",
    "exerciseId": "ex_behind_back_cable_lateral_raise",
    "muscleId": "m_deltoid_lateral",
    "percentage": 90,
    "role": "Primary",
    "notes": "Scapular plane lateral deltoid"
  },
  {
    "id": "emc_ex_behind_back_cable_lateral_raise_m_trapezius_upper_sec",
    "exerciseId": "ex_behind_back_cable_lateral_raise",
    "muscleId": "m_trapezius_upper",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Trapezius assist"
  },
  {
    "id": "emc_ex_behind_back_cable_lateral_raise_m_rotator_cuff_stab",
    "exerciseId": "ex_behind_back_cable_lateral_raise",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Joint tracking"
  },
  {
    "id": "emc_ex_dumbbell_front_raise_m_deltoid_anterior_pri",
    "exerciseId": "ex_dumbbell_front_raise",
    "muscleId": "m_deltoid_anterior",
    "percentage": 85,
    "role": "Primary",
    "notes": "Pure shoulder flexion"
  },
  {
    "id": "emc_ex_dumbbell_front_raise_m_chest_clavicular_sec",
    "exerciseId": "ex_dumbbell_front_raise",
    "muscleId": "m_chest_clavicular",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Upper chest synergist"
  },
  {
    "id": "emc_ex_dumbbell_front_raise_m_trapezius_upper_sec",
    "exerciseId": "ex_dumbbell_front_raise",
    "muscleId": "m_trapezius_upper",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Upper trap"
  },
  {
    "id": "emc_ex_dumbbell_front_raise_m_core_stab",
    "exerciseId": "ex_dumbbell_front_raise",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Anti-extension core"
  },
  {
    "id": "emc_ex_barbell_front_raise_m_deltoid_anterior_pri",
    "exerciseId": "ex_barbell_front_raise",
    "muscleId": "m_deltoid_anterior",
    "percentage": 80,
    "role": "Primary",
    "notes": "Anterior deltoid"
  },
  {
    "id": "emc_ex_barbell_front_raise_m_chest_clavicular_sec",
    "exerciseId": "ex_barbell_front_raise",
    "muscleId": "m_chest_clavicular",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Clavicular pectoral assist"
  },
  {
    "id": "emc_ex_barbell_front_raise_m_trapezius_upper_sec",
    "exerciseId": "ex_barbell_front_raise",
    "muscleId": "m_trapezius_upper",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Upper traps"
  },
  {
    "id": "emc_ex_barbell_front_raise_m_core_stab",
    "exerciseId": "ex_barbell_front_raise",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Core brace"
  },
  {
    "id": "emc_ex_cable_front_raise_m_deltoid_anterior_pri",
    "exerciseId": "ex_cable_front_raise",
    "muscleId": "m_deltoid_anterior",
    "percentage": 85,
    "role": "Primary",
    "notes": "Constant tension front delt"
  },
  {
    "id": "emc_ex_cable_front_raise_m_chest_clavicular_sec",
    "exerciseId": "ex_cable_front_raise",
    "muscleId": "m_chest_clavicular",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Upper chest"
  },
  {
    "id": "emc_ex_cable_front_raise_m_trapezius_upper_sec",
    "exerciseId": "ex_cable_front_raise",
    "muscleId": "m_trapezius_upper",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Traps"
  },
  {
    "id": "emc_ex_cable_front_raise_m_core_stab",
    "exerciseId": "ex_cable_front_raise",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Core support"
  },
  {
    "id": "emc_ex_face_pull_rope_m_deltoid_posterior_pri",
    "exerciseId": "ex_face_pull_rope",
    "muscleId": "m_deltoid_posterior",
    "percentage": 45,
    "role": "Primary",
    "notes": "Horizontal shoulder abduction"
  },
  {
    "id": "emc_ex_face_pull_rope_m_rotator_cuff_pri",
    "exerciseId": "ex_face_pull_rope",
    "muscleId": "m_rotator_cuff",
    "percentage": 30,
    "role": "Primary",
    "notes": "External rotation (infraspinatus & teres minor)"
  },
  {
    "id": "emc_ex_face_pull_rope_m_trapezius_middle_sec",
    "exerciseId": "ex_face_pull_rope",
    "muscleId": "m_trapezius_middle",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Scapular retraction"
  },
  {
    "id": "emc_ex_face_pull_rope_m_trapezius_upper_sec",
    "exerciseId": "ex_face_pull_rope",
    "muscleId": "m_trapezius_upper",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Trapezius support"
  },
  {
    "id": "emc_ex_face_pull_rope_m_core_stab",
    "exerciseId": "ex_face_pull_rope",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Standing balance"
  },
  {
    "id": "emc_ex_rear_delt_dumbbell_fly_m_deltoid_posterior_pri",
    "exerciseId": "ex_rear_delt_dumbbell_fly",
    "muscleId": "m_deltoid_posterior",
    "percentage": 75,
    "role": "Primary",
    "notes": "Posterior deltoid abduction"
  },
  {
    "id": "emc_ex_rear_delt_dumbbell_fly_m_trapezius_middle_sec",
    "exerciseId": "ex_rear_delt_dumbbell_fly",
    "muscleId": "m_trapezius_middle",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Rhomboid retraction"
  },
  {
    "id": "emc_ex_rear_delt_dumbbell_fly_m_rotator_cuff_sec",
    "exerciseId": "ex_rear_delt_dumbbell_fly",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Infraspinatus synergy"
  },
  {
    "id": "emc_ex_rear_delt_dumbbell_fly_m_erector_spinae_stab",
    "exerciseId": "ex_rear_delt_dumbbell_fly",
    "muscleId": "m_erector_spinae",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Hinge posture"
  },
  {
    "id": "emc_ex_rear_delt_cable_fly_m_deltoid_posterior_pri",
    "exerciseId": "ex_rear_delt_cable_fly",
    "muscleId": "m_deltoid_posterior",
    "percentage": 80,
    "role": "Primary",
    "notes": "Posterior deltoid horizontal abduction"
  },
  {
    "id": "emc_ex_rear_delt_cable_fly_m_trapezius_middle_sec",
    "exerciseId": "ex_rear_delt_cable_fly",
    "muscleId": "m_trapezius_middle",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Mid-back synergy"
  },
  {
    "id": "emc_ex_rear_delt_cable_fly_m_rotator_cuff_sec",
    "exerciseId": "ex_rear_delt_cable_fly",
    "muscleId": "m_rotator_cuff",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Rotator cuff"
  },
  {
    "id": "emc_ex_rear_delt_cable_fly_m_core_stab",
    "exerciseId": "ex_rear_delt_cable_fly",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Trunk stability"
  },
  {
    "id": "emc_ex_machine_reverse_pec_deck_m_deltoid_posterior_pri",
    "exerciseId": "ex_machine_reverse_pec_deck",
    "muscleId": "m_deltoid_posterior",
    "percentage": 80,
    "role": "Primary",
    "notes": "Rear delt isolation"
  },
  {
    "id": "emc_ex_machine_reverse_pec_deck_m_trapezius_middle_sec",
    "exerciseId": "ex_machine_reverse_pec_deck",
    "muscleId": "m_trapezius_middle",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Scapular retraction"
  },
  {
    "id": "emc_ex_machine_reverse_pec_deck_m_rotator_cuff_sec",
    "exerciseId": "ex_machine_reverse_pec_deck",
    "muscleId": "m_rotator_cuff",
    "percentage": 5,
    "role": "Secondary",
    "notes": "External rotators"
  },
  {
    "id": "emc_ex_machine_reverse_pec_deck_m_core_stab",
    "exerciseId": "ex_machine_reverse_pec_deck",
    "muscleId": "m_core",
    "percentage": 5,
    "role": "Stabilizer",
    "notes": "Seated posture"
  },
  {
    "id": "emc_ex_rear_delt_cable_crossover_m_deltoid_posterior_pri",
    "exerciseId": "ex_rear_delt_cable_crossover",
    "muscleId": "m_deltoid_posterior",
    "percentage": 80,
    "role": "Primary",
    "notes": "Rear deltoid"
  },
  {
    "id": "emc_ex_rear_delt_cable_crossover_m_trapezius_middle_sec",
    "exerciseId": "ex_rear_delt_cable_crossover",
    "muscleId": "m_trapezius_middle",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Mid-back"
  },
  {
    "id": "emc_ex_rear_delt_cable_crossover_m_rotator_cuff_sec",
    "exerciseId": "ex_rear_delt_cable_crossover",
    "muscleId": "m_rotator_cuff",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Rotator cuff"
  },
  {
    "id": "emc_ex_rear_delt_cable_crossover_m_trapezius_lower_stab",
    "exerciseId": "ex_rear_delt_cable_crossover",
    "muscleId": "m_trapezius_lower",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Lower trap scapular stability"
  },
  {
    "id": "emc_ex_barbell_upright_row_m_deltoid_lateral_pri",
    "exerciseId": "ex_barbell_upright_row",
    "muscleId": "m_deltoid_lateral",
    "percentage": 55,
    "role": "Primary",
    "notes": "Lateral deltoid abduction"
  },
  {
    "id": "emc_ex_barbell_upright_row_m_trapezius_upper_pri",
    "exerciseId": "ex_barbell_upright_row",
    "muscleId": "m_trapezius_upper",
    "percentage": 30,
    "role": "Primary",
    "notes": "Trapezius elevation"
  },
  {
    "id": "emc_ex_barbell_upright_row_m_biceps_short_head_sec",
    "exerciseId": "ex_barbell_upright_row",
    "muscleId": "m_biceps_short_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Biceps flexion"
  },
  {
    "id": "emc_ex_barbell_upright_row_m_rotator_cuff_stab",
    "exerciseId": "ex_barbell_upright_row",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Subacromial space control"
  },
  {
    "id": "emc_ex_dumbbell_upright_row_m_deltoid_lateral_pri",
    "exerciseId": "ex_dumbbell_upright_row",
    "muscleId": "m_deltoid_lateral",
    "percentage": 60,
    "role": "Primary",
    "notes": "Side delt"
  },
  {
    "id": "emc_ex_dumbbell_upright_row_m_trapezius_upper_pri",
    "exerciseId": "ex_dumbbell_upright_row",
    "muscleId": "m_trapezius_upper",
    "percentage": 25,
    "role": "Primary",
    "notes": "Upper traps"
  },
  {
    "id": "emc_ex_dumbbell_upright_row_m_biceps_short_head_sec",
    "exerciseId": "ex_dumbbell_upright_row",
    "muscleId": "m_biceps_short_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Elbow flexion"
  },
  {
    "id": "emc_ex_dumbbell_upright_row_m_rotator_cuff_stab",
    "exerciseId": "ex_dumbbell_upright_row",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Joint tracking"
  },
  {
    "id": "emc_ex_cable_upright_row_m_deltoid_lateral_pri",
    "exerciseId": "ex_cable_upright_row",
    "muscleId": "m_deltoid_lateral",
    "percentage": 65,
    "role": "Primary",
    "notes": "Continuous side delt tension"
  },
  {
    "id": "emc_ex_cable_upright_row_m_trapezius_upper_pri",
    "exerciseId": "ex_cable_upright_row",
    "muscleId": "m_trapezius_upper",
    "percentage": 20,
    "role": "Primary",
    "notes": "Traps"
  },
  {
    "id": "emc_ex_cable_upright_row_m_biceps_short_head_sec",
    "exerciseId": "ex_cable_upright_row",
    "muscleId": "m_biceps_short_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Biceps"
  },
  {
    "id": "emc_ex_cable_upright_row_m_rotator_cuff_stab",
    "exerciseId": "ex_cable_upright_row",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Rotator cuff"
  },
  {
    "id": "emc_ex_cuban_press_m_rotator_cuff_pri",
    "exerciseId": "ex_cuban_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 40,
    "role": "Primary",
    "notes": "Active external rotation against gravity"
  },
  {
    "id": "emc_ex_cuban_press_m_deltoid_lateral_pri",
    "exerciseId": "ex_cuban_press",
    "muscleId": "m_deltoid_lateral",
    "percentage": 30,
    "role": "Primary",
    "notes": "Upright row & abduction"
  },
  {
    "id": "emc_ex_cuban_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_cuban_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Overhead press"
  },
  {
    "id": "emc_ex_cuban_press_m_trapezius_upper_sec",
    "exerciseId": "ex_cuban_press",
    "muscleId": "m_trapezius_upper",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Scapular control"
  },
  {
    "id": "emc_ex_cuban_press_m_deltoid_posterior_stab",
    "exerciseId": "ex_cuban_press",
    "muscleId": "m_deltoid_posterior",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Rear shoulder stability"
  },
  {
    "id": "emc_ex_lu_raises_m_deltoid_lateral_pri",
    "exerciseId": "ex_lu_raises",
    "muscleId": "m_deltoid_lateral",
    "percentage": 60,
    "role": "Primary",
    "notes": "Full abduction range"
  },
  {
    "id": "emc_ex_lu_raises_m_trapezius_upper_pri",
    "exerciseId": "ex_lu_raises",
    "muscleId": "m_trapezius_upper",
    "percentage": 30,
    "role": "Primary",
    "notes": "Overhead upward rotation"
  },
  {
    "id": "emc_ex_lu_raises_m_serratus_anterior_sec",
    "exerciseId": "ex_lu_raises",
    "muscleId": "m_serratus_anterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Scapular upward rotation"
  },
  {
    "id": "emc_ex_lu_raises_m_rotator_cuff_stab",
    "exerciseId": "ex_lu_raises",
    "muscleId": "m_rotator_cuff",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Overhead humeral control"
  },
  {
    "id": "emc_ex_plate_front_raise_m_deltoid_anterior_pri",
    "exerciseId": "ex_plate_front_raise",
    "muscleId": "m_deltoid_anterior",
    "percentage": 80,
    "role": "Primary",
    "notes": "Plate front raise"
  },
  {
    "id": "emc_ex_plate_front_raise_m_deltoid_lateral_sec",
    "exerciseId": "ex_plate_front_raise",
    "muscleId": "m_deltoid_lateral",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Rotational twist"
  },
  {
    "id": "emc_ex_plate_front_raise_m_forearms_sec",
    "exerciseId": "ex_plate_front_raise",
    "muscleId": "m_forearms",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Plate pinch grip"
  },
  {
    "id": "emc_ex_plate_front_raise_m_core_stab",
    "exerciseId": "ex_plate_front_raise",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Core brace"
  },
  {
    "id": "emc_ex_landmine_shoulder_press_m_deltoid_anterior_pri",
    "exerciseId": "ex_landmine_shoulder_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 65,
    "role": "Primary",
    "notes": "Angular shoulder press"
  },
  {
    "id": "emc_ex_landmine_shoulder_press_m_deltoid_lateral_pri",
    "exerciseId": "ex_landmine_shoulder_press",
    "muscleId": "m_deltoid_lateral",
    "percentage": 20,
    "role": "Primary",
    "notes": "Lateral delt"
  },
  {
    "id": "emc_ex_landmine_shoulder_press_m_triceps_lateral_head_sec",
    "exerciseId": "ex_landmine_shoulder_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Lockout"
  },
  {
    "id": "emc_ex_landmine_shoulder_press_m_obliques_stab",
    "exerciseId": "ex_landmine_shoulder_press",
    "muscleId": "m_obliques",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Anti-lateral flexion core"
  },
  {
    "id": "emc_ex_landmine_shoulder_press_m_serratus_anterior_stab",
    "exerciseId": "ex_landmine_shoulder_press",
    "muscleId": "m_serratus_anterior",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Scapular protraction"
  },
  {
    "id": "emc_ex_barbell_biceps_curl_m_biceps_short_head_pri",
    "exerciseId": "ex_barbell_biceps_curl",
    "muscleId": "m_biceps_short_head",
    "percentage": 50,
    "role": "Primary",
    "notes": "Inner bicep mass"
  },
  {
    "id": "emc_ex_barbell_biceps_curl_m_biceps_long_head_pri",
    "exerciseId": "ex_barbell_biceps_curl",
    "muscleId": "m_biceps_long_head",
    "percentage": 40,
    "role": "Primary",
    "notes": "Outer bicep peak"
  },
  {
    "id": "emc_ex_barbell_biceps_curl_m_brachialis_sec",
    "exerciseId": "ex_barbell_biceps_curl",
    "muscleId": "m_brachialis",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Elbow flexion assist"
  },
  {
    "id": "emc_ex_barbell_biceps_curl_m_forearms_stab",
    "exerciseId": "ex_barbell_biceps_curl",
    "muscleId": "m_forearms",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Wrist stabilization"
  },
  {
    "id": "emc_ex_barbell_biceps_curl_m_core_stab",
    "exerciseId": "ex_barbell_biceps_curl",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Anti-extension core brace"
  },
  {
    "id": "emc_ex_dumbbell_biceps_curl_m_biceps_long_head_pri",
    "exerciseId": "ex_dumbbell_biceps_curl",
    "muscleId": "m_biceps_long_head",
    "percentage": 50,
    "role": "Primary",
    "notes": "Peak supination contraction"
  },
  {
    "id": "emc_ex_dumbbell_biceps_curl_m_biceps_short_head_pri",
    "exerciseId": "ex_dumbbell_biceps_curl",
    "muscleId": "m_biceps_short_head",
    "percentage": 40,
    "role": "Primary",
    "notes": "Inner bicep"
  },
  {
    "id": "emc_ex_dumbbell_biceps_curl_m_brachialis_sec",
    "exerciseId": "ex_dumbbell_biceps_curl",
    "muscleId": "m_brachialis",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Elbow flexor assist"
  },
  {
    "id": "emc_ex_dumbbell_biceps_curl_m_forearms_stab",
    "exerciseId": "ex_dumbbell_biceps_curl",
    "muscleId": "m_forearms",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Wrist rotation control"
  },
  {
    "id": "emc_ex_incline_dumbbell_curl_m_biceps_long_head_pri",
    "exerciseId": "ex_incline_dumbbell_curl",
    "muscleId": "m_biceps_long_head",
    "percentage": 75,
    "role": "Primary",
    "notes": "Stretched long head bicep peak"
  },
  {
    "id": "emc_ex_incline_dumbbell_curl_m_biceps_short_head_sec",
    "exerciseId": "ex_incline_dumbbell_curl",
    "muscleId": "m_biceps_short_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Short head assist"
  },
  {
    "id": "emc_ex_incline_dumbbell_curl_m_brachialis_sec",
    "exerciseId": "ex_incline_dumbbell_curl",
    "muscleId": "m_brachialis",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Brachialis"
  },
  {
    "id": "emc_ex_incline_dumbbell_curl_m_forearms_stab",
    "exerciseId": "ex_incline_dumbbell_curl",
    "muscleId": "m_forearms",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Wrist control"
  },
  {
    "id": "emc_ex_dumbbell_hammer_curl_m_brachialis_pri",
    "exerciseId": "ex_dumbbell_hammer_curl",
    "muscleId": "m_brachialis",
    "percentage": 55,
    "role": "Primary",
    "notes": "Primary neutral elbow flexor"
  },
  {
    "id": "emc_ex_dumbbell_hammer_curl_m_forearms_pri",
    "exerciseId": "ex_dumbbell_hammer_curl",
    "muscleId": "m_forearms",
    "percentage": 30,
    "role": "Primary",
    "notes": "Brachioradialis recruitment"
  },
  {
    "id": "emc_ex_dumbbell_hammer_curl_m_biceps_long_head_sec",
    "exerciseId": "ex_dumbbell_hammer_curl",
    "muscleId": "m_biceps_long_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Biceps synergy"
  },
  {
    "id": "emc_ex_dumbbell_hammer_curl_m_core_stab",
    "exerciseId": "ex_dumbbell_hammer_curl",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Posture"
  },
  {
    "id": "emc_ex_cable_hammer_curl_rope_m_brachialis_pri",
    "exerciseId": "ex_cable_hammer_curl_rope",
    "muscleId": "m_brachialis",
    "percentage": 55,
    "role": "Primary",
    "notes": "Brachialis thickness"
  },
  {
    "id": "emc_ex_cable_hammer_curl_rope_m_forearms_pri",
    "exerciseId": "ex_cable_hammer_curl_rope",
    "muscleId": "m_forearms",
    "percentage": 30,
    "role": "Primary",
    "notes": "Brachioradialis"
  },
  {
    "id": "emc_ex_cable_hammer_curl_rope_m_biceps_long_head_sec",
    "exerciseId": "ex_cable_hammer_curl_rope",
    "muscleId": "m_biceps_long_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Long head"
  },
  {
    "id": "emc_ex_cable_hammer_curl_rope_m_core_stab",
    "exerciseId": "ex_cable_hammer_curl_rope",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Core support"
  },
  {
    "id": "emc_ex_preacher_curl_ez_bar_m_biceps_short_head_pri",
    "exerciseId": "ex_preacher_curl_ez_bar",
    "muscleId": "m_biceps_short_head",
    "percentage": 65,
    "role": "Primary",
    "notes": "Short head strict isolation"
  },
  {
    "id": "emc_ex_preacher_curl_ez_bar_m_brachialis_pri",
    "exerciseId": "ex_preacher_curl_ez_bar",
    "muscleId": "m_brachialis",
    "percentage": 25,
    "role": "Primary",
    "notes": "Lower elbow flexion"
  },
  {
    "id": "emc_ex_preacher_curl_ez_bar_m_biceps_long_head_sec",
    "exerciseId": "ex_preacher_curl_ez_bar",
    "muscleId": "m_biceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Long head assist"
  },
  {
    "id": "emc_ex_preacher_curl_ez_bar_m_forearms_stab",
    "exerciseId": "ex_preacher_curl_ez_bar",
    "muscleId": "m_forearms",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Wrist stability on pad"
  },
  {
    "id": "emc_ex_preacher_curl_dumbbell_m_biceps_short_head_pri",
    "exerciseId": "ex_preacher_curl_dumbbell",
    "muscleId": "m_biceps_short_head",
    "percentage": 70,
    "role": "Primary",
    "notes": "Unilateral short head isolation"
  },
  {
    "id": "emc_ex_preacher_curl_dumbbell_m_brachialis_pri",
    "exerciseId": "ex_preacher_curl_dumbbell",
    "muscleId": "m_brachialis",
    "percentage": 20,
    "role": "Primary",
    "notes": "Brachialis"
  },
  {
    "id": "emc_ex_preacher_curl_dumbbell_m_biceps_long_head_sec",
    "exerciseId": "ex_preacher_curl_dumbbell",
    "muscleId": "m_biceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Long head"
  },
  {
    "id": "emc_ex_preacher_curl_dumbbell_m_forearms_stab",
    "exerciseId": "ex_preacher_curl_dumbbell",
    "muscleId": "m_forearms",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Wrist control"
  },
  {
    "id": "emc_ex_spider_curl_m_biceps_short_head_pri",
    "exerciseId": "ex_spider_curl",
    "muscleId": "m_biceps_short_head",
    "percentage": 60,
    "role": "Primary",
    "notes": "Short head peak contraction"
  },
  {
    "id": "emc_ex_spider_curl_m_biceps_long_head_pri",
    "exerciseId": "ex_spider_curl",
    "muscleId": "m_biceps_long_head",
    "percentage": 30,
    "role": "Primary",
    "notes": "Outer head"
  },
  {
    "id": "emc_ex_spider_curl_m_brachialis_sec",
    "exerciseId": "ex_spider_curl",
    "muscleId": "m_brachialis",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Brachialis"
  },
  {
    "id": "emc_ex_spider_curl_m_forearms_stab",
    "exerciseId": "ex_spider_curl",
    "muscleId": "m_forearms",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Grip"
  },
  {
    "id": "emc_ex_concentration_curl_m_biceps_long_head_pri",
    "exerciseId": "ex_concentration_curl",
    "muscleId": "m_biceps_long_head",
    "percentage": 55,
    "role": "Primary",
    "notes": "Bicep peak development"
  },
  {
    "id": "emc_ex_concentration_curl_m_biceps_short_head_pri",
    "exerciseId": "ex_concentration_curl",
    "muscleId": "m_biceps_short_head",
    "percentage": 35,
    "role": "Primary",
    "notes": "Short head thickness"
  },
  {
    "id": "emc_ex_concentration_curl_m_brachialis_sec",
    "exerciseId": "ex_concentration_curl",
    "muscleId": "m_brachialis",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Brachialis"
  },
  {
    "id": "emc_ex_concentration_curl_m_forearms_stab",
    "exerciseId": "ex_concentration_curl",
    "muscleId": "m_forearms",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Wrist stabilization"
  },
  {
    "id": "emc_ex_cable_biceps_curl_m_biceps_short_head_pri",
    "exerciseId": "ex_cable_biceps_curl",
    "muscleId": "m_biceps_short_head",
    "percentage": 50,
    "role": "Primary",
    "notes": "Constant cable tension"
  },
  {
    "id": "emc_ex_cable_biceps_curl_m_biceps_long_head_pri",
    "exerciseId": "ex_cable_biceps_curl",
    "muscleId": "m_biceps_long_head",
    "percentage": 40,
    "role": "Primary",
    "notes": "Long head"
  },
  {
    "id": "emc_ex_cable_biceps_curl_m_brachialis_sec",
    "exerciseId": "ex_cable_biceps_curl",
    "muscleId": "m_brachialis",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Brachialis"
  },
  {
    "id": "emc_ex_cable_biceps_curl_m_core_stab",
    "exerciseId": "ex_cable_biceps_curl",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Posture"
  },
  {
    "id": "emc_ex_high_cable_curl_hercules_m_biceps_long_head_pri",
    "exerciseId": "ex_high_cable_curl_hercules",
    "muscleId": "m_biceps_long_head",
    "percentage": 60,
    "role": "Primary",
    "notes": "Peak bicep contraction in abduction"
  },
  {
    "id": "emc_ex_high_cable_curl_hercules_m_biceps_short_head_pri",
    "exerciseId": "ex_high_cable_curl_hercules",
    "muscleId": "m_biceps_short_head",
    "percentage": 35,
    "role": "Primary",
    "notes": "Short head"
  },
  {
    "id": "emc_ex_high_cable_curl_hercules_m_brachialis_sec",
    "exerciseId": "ex_high_cable_curl_hercules",
    "muscleId": "m_brachialis",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Brachialis"
  },
  {
    "id": "emc_ex_high_cable_curl_hercules_m_rotator_cuff_stab",
    "exerciseId": "ex_high_cable_curl_hercules",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Horizontal arm support"
  },
  {
    "id": "emc_ex_reverse_barbell_curl_m_forearms_pri",
    "exerciseId": "ex_reverse_barbell_curl",
    "muscleId": "m_forearms",
    "percentage": 60,
    "role": "Primary",
    "notes": "Brachioradialis dominant pull"
  },
  {
    "id": "emc_ex_reverse_barbell_curl_m_brachialis_pri",
    "exerciseId": "ex_reverse_barbell_curl",
    "muscleId": "m_brachialis",
    "percentage": 30,
    "role": "Primary",
    "notes": "Deep brachialis flexor"
  },
  {
    "id": "emc_ex_reverse_barbell_curl_m_biceps_long_head_sec",
    "exerciseId": "ex_reverse_barbell_curl",
    "muscleId": "m_biceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Pronated bicep assistance"
  },
  {
    "id": "emc_ex_reverse_barbell_curl_m_core_stab",
    "exerciseId": "ex_reverse_barbell_curl",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Core brace"
  },
  {
    "id": "emc_ex_reverse_cable_curl_m_forearms_pri",
    "exerciseId": "ex_reverse_cable_curl",
    "muscleId": "m_forearms",
    "percentage": 60,
    "role": "Primary",
    "notes": "Forearms"
  },
  {
    "id": "emc_ex_reverse_cable_curl_m_brachialis_pri",
    "exerciseId": "ex_reverse_cable_curl",
    "muscleId": "m_brachialis",
    "percentage": 30,
    "role": "Primary",
    "notes": "Brachialis"
  },
  {
    "id": "emc_ex_reverse_cable_curl_m_biceps_long_head_sec",
    "exerciseId": "ex_reverse_cable_curl",
    "muscleId": "m_biceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Biceps"
  },
  {
    "id": "emc_ex_reverse_cable_curl_m_core_stab",
    "exerciseId": "ex_reverse_cable_curl",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Posture"
  },
  {
    "id": "emc_ex_ez_bar_21s_curl_m_biceps_short_head_pri",
    "exerciseId": "ex_ez_bar_21s_curl",
    "muscleId": "m_biceps_short_head",
    "percentage": 50,
    "role": "Primary",
    "notes": "Metabolic stress hypertrophy"
  },
  {
    "id": "emc_ex_ez_bar_21s_curl_m_biceps_long_head_pri",
    "exerciseId": "ex_ez_bar_21s_curl",
    "muscleId": "m_biceps_long_head",
    "percentage": 40,
    "role": "Primary",
    "notes": "Bicep peak"
  },
  {
    "id": "emc_ex_ez_bar_21s_curl_m_brachialis_sec",
    "exerciseId": "ex_ez_bar_21s_curl",
    "muscleId": "m_brachialis",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Brachialis"
  },
  {
    "id": "emc_ex_ez_bar_21s_curl_m_forearms_stab",
    "exerciseId": "ex_ez_bar_21s_curl",
    "muscleId": "m_forearms",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Grip burn"
  },
  {
    "id": "emc_ex_machine_preacher_curl_m_biceps_short_head_pri",
    "exerciseId": "ex_machine_preacher_curl",
    "muscleId": "m_biceps_short_head",
    "percentage": 65,
    "role": "Primary",
    "notes": "Machine guided short head"
  },
  {
    "id": "emc_ex_machine_preacher_curl_m_brachialis_pri",
    "exerciseId": "ex_machine_preacher_curl",
    "muscleId": "m_brachialis",
    "percentage": 25,
    "role": "Primary",
    "notes": "Brachialis"
  },
  {
    "id": "emc_ex_machine_preacher_curl_m_biceps_long_head_sec",
    "exerciseId": "ex_machine_preacher_curl",
    "muscleId": "m_biceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Long head"
  },
  {
    "id": "emc_ex_machine_preacher_curl_m_forearms_stab",
    "exerciseId": "ex_machine_preacher_curl",
    "muscleId": "m_forearms",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Wrist control"
  },
  {
    "id": "emc_ex_close_grip_barbell_bench_press_m_triceps_lateral_head_pri",
    "exerciseId": "ex_close_grip_barbell_bench_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 45,
    "role": "Primary",
    "notes": "Heavy lockout drive"
  },
  {
    "id": "emc_ex_close_grip_barbell_bench_press_m_triceps_medial_head_pri",
    "exerciseId": "ex_close_grip_barbell_bench_press",
    "muscleId": "m_triceps_medial_head",
    "percentage": 30,
    "role": "Primary",
    "notes": "Deep elbow extension"
  },
  {
    "id": "emc_ex_close_grip_barbell_bench_press_m_chest_sternal_sec",
    "exerciseId": "ex_close_grip_barbell_bench_press",
    "muscleId": "m_chest_sternal",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Horizontal adduction synergy"
  },
  {
    "id": "emc_ex_close_grip_barbell_bench_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_close_grip_barbell_bench_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Shoulder flexion assist"
  },
  {
    "id": "emc_ex_close_grip_barbell_bench_press_m_rotator_cuff_stab",
    "exerciseId": "ex_close_grip_barbell_bench_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Joint tracking"
  },
  {
    "id": "emc_ex_triceps_rope_pushdown_m_triceps_lateral_head_pri",
    "exerciseId": "ex_triceps_rope_pushdown",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 60,
    "role": "Primary",
    "notes": "Lateral head peak squeeze"
  },
  {
    "id": "emc_ex_triceps_rope_pushdown_m_triceps_medial_head_pri",
    "exerciseId": "ex_triceps_rope_pushdown",
    "muscleId": "m_triceps_medial_head",
    "percentage": 30,
    "role": "Primary",
    "notes": "Medial head extension"
  },
  {
    "id": "emc_ex_triceps_rope_pushdown_m_triceps_long_head_sec",
    "exerciseId": "ex_triceps_rope_pushdown",
    "muscleId": "m_triceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Long head assist"
  },
  {
    "id": "emc_ex_triceps_rope_pushdown_m_core_stab",
    "exerciseId": "ex_triceps_rope_pushdown",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Standing stability"
  },
  {
    "id": "emc_ex_straight_bar_triceps_pushdown_m_triceps_lateral_head_pri",
    "exerciseId": "ex_straight_bar_triceps_pushdown",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 55,
    "role": "Primary",
    "notes": "Lateral head"
  },
  {
    "id": "emc_ex_straight_bar_triceps_pushdown_m_triceps_medial_head_pri",
    "exerciseId": "ex_straight_bar_triceps_pushdown",
    "muscleId": "m_triceps_medial_head",
    "percentage": 35,
    "role": "Primary",
    "notes": "Medial head"
  },
  {
    "id": "emc_ex_straight_bar_triceps_pushdown_m_triceps_long_head_sec",
    "exerciseId": "ex_straight_bar_triceps_pushdown",
    "muscleId": "m_triceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Long head"
  },
  {
    "id": "emc_ex_straight_bar_triceps_pushdown_m_core_stab",
    "exerciseId": "ex_straight_bar_triceps_pushdown",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Core brace"
  },
  {
    "id": "emc_ex_v_bar_triceps_pushdown_m_triceps_lateral_head_pri",
    "exerciseId": "ex_v_bar_triceps_pushdown",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 55,
    "role": "Primary",
    "notes": "Lateral head power"
  },
  {
    "id": "emc_ex_v_bar_triceps_pushdown_m_triceps_medial_head_pri",
    "exerciseId": "ex_v_bar_triceps_pushdown",
    "muscleId": "m_triceps_medial_head",
    "percentage": 35,
    "role": "Primary",
    "notes": "Medial head"
  },
  {
    "id": "emc_ex_v_bar_triceps_pushdown_m_triceps_long_head_sec",
    "exerciseId": "ex_v_bar_triceps_pushdown",
    "muscleId": "m_triceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Long head"
  },
  {
    "id": "emc_ex_v_bar_triceps_pushdown_m_core_stab",
    "exerciseId": "ex_v_bar_triceps_pushdown",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Posture"
  },
  {
    "id": "emc_ex_skull_crushers_lying_triceps_extension_m_triceps_long_head_pri",
    "exerciseId": "ex_skull_crushers_lying_triceps_extension",
    "muscleId": "m_triceps_long_head",
    "percentage": 60,
    "role": "Primary",
    "notes": "Stretched long head extension"
  },
  {
    "id": "emc_ex_skull_crushers_lying_triceps_extension_m_triceps_medial_head_pri",
    "exerciseId": "ex_skull_crushers_lying_triceps_extension",
    "muscleId": "m_triceps_medial_head",
    "percentage": 25,
    "role": "Primary",
    "notes": "Medial head"
  },
  {
    "id": "emc_ex_skull_crushers_lying_triceps_extension_m_triceps_lateral_head_sec",
    "exerciseId": "ex_skull_crushers_lying_triceps_extension",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Lockout assist"
  },
  {
    "id": "emc_ex_skull_crushers_lying_triceps_extension_m_rotator_cuff_stab",
    "exerciseId": "ex_skull_crushers_lying_triceps_extension",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Glenohumeral stability"
  },
  {
    "id": "emc_ex_overhead_dumbbell_triceps_extension_m_triceps_long_head_pri",
    "exerciseId": "ex_overhead_dumbbell_triceps_extension",
    "muscleId": "m_triceps_long_head",
    "percentage": 75,
    "role": "Primary",
    "notes": "Maximum long head eccentric stretch"
  },
  {
    "id": "emc_ex_overhead_dumbbell_triceps_extension_m_triceps_medial_head_sec",
    "exerciseId": "ex_overhead_dumbbell_triceps_extension",
    "muscleId": "m_triceps_medial_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Medial head"
  },
  {
    "id": "emc_ex_overhead_dumbbell_triceps_extension_m_triceps_lateral_head_sec",
    "exerciseId": "ex_overhead_dumbbell_triceps_extension",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Lateral head"
  },
  {
    "id": "emc_ex_overhead_dumbbell_triceps_extension_m_core_stab",
    "exerciseId": "ex_overhead_dumbbell_triceps_extension",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Anti-extension seated core"
  },
  {
    "id": "emc_ex_overhead_cable_triceps_extension_m_triceps_long_head_pri",
    "exerciseId": "ex_overhead_cable_triceps_extension",
    "muscleId": "m_triceps_long_head",
    "percentage": 75,
    "role": "Primary",
    "notes": "Constant tension long head"
  },
  {
    "id": "emc_ex_overhead_cable_triceps_extension_m_triceps_lateral_head_sec",
    "exerciseId": "ex_overhead_cable_triceps_extension",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Lateral head"
  },
  {
    "id": "emc_ex_overhead_cable_triceps_extension_m_triceps_medial_head_sec",
    "exerciseId": "ex_overhead_cable_triceps_extension",
    "muscleId": "m_triceps_medial_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Medial head"
  },
  {
    "id": "emc_ex_overhead_cable_triceps_extension_m_core_stab",
    "exerciseId": "ex_overhead_cable_triceps_extension",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Standing forward lean core"
  },
  {
    "id": "emc_ex_triceps_dips_upright_m_triceps_lateral_head_pri",
    "exerciseId": "ex_triceps_dips_upright",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 50,
    "role": "Primary",
    "notes": "Elbow extension lockout"
  },
  {
    "id": "emc_ex_triceps_dips_upright_m_triceps_long_head_pri",
    "exerciseId": "ex_triceps_dips_upright",
    "muscleId": "m_triceps_long_head",
    "percentage": 30,
    "role": "Primary",
    "notes": "Triceps drive"
  },
  {
    "id": "emc_ex_triceps_dips_upright_m_chest_costal_sec",
    "exerciseId": "ex_triceps_dips_upright",
    "muscleId": "m_chest_costal",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Lower chest assist"
  },
  {
    "id": "emc_ex_triceps_dips_upright_m_deltoid_anterior_sec",
    "exerciseId": "ex_triceps_dips_upright",
    "muscleId": "m_deltoid_anterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Front delt"
  },
  {
    "id": "emc_ex_triceps_dips_upright_m_rotator_cuff_stab",
    "exerciseId": "ex_triceps_dips_upright",
    "muscleId": "m_rotator_cuff",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Shoulder joint support"
  },
  {
    "id": "emc_ex_bench_dips_m_triceps_medial_head_pri",
    "exerciseId": "ex_bench_dips",
    "muscleId": "m_triceps_medial_head",
    "percentage": 50,
    "role": "Primary",
    "notes": "Medial head extension"
  },
  {
    "id": "emc_ex_bench_dips_m_triceps_lateral_head_pri",
    "exerciseId": "ex_bench_dips",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 35,
    "role": "Primary",
    "notes": "Lateral head"
  },
  {
    "id": "emc_ex_bench_dips_m_deltoid_anterior_sec",
    "exerciseId": "ex_bench_dips",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Anterior shoulder"
  },
  {
    "id": "emc_ex_bench_dips_m_rotator_cuff_stab",
    "exerciseId": "ex_bench_dips",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Shoulder control"
  },
  {
    "id": "emc_ex_single_arm_cable_triceps_kickback_m_triceps_lateral_head_pri",
    "exerciseId": "ex_single_arm_cable_triceps_kickback",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 60,
    "role": "Primary",
    "notes": "Peak contraction lateral head"
  },
  {
    "id": "emc_ex_single_arm_cable_triceps_kickback_m_triceps_long_head_pri",
    "exerciseId": "ex_single_arm_cable_triceps_kickback",
    "muscleId": "m_triceps_long_head",
    "percentage": 30,
    "role": "Primary",
    "notes": "Shoulder extension support"
  },
  {
    "id": "emc_ex_single_arm_cable_triceps_kickback_m_triceps_medial_head_sec",
    "exerciseId": "ex_single_arm_cable_triceps_kickback",
    "muscleId": "m_triceps_medial_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Medial head"
  },
  {
    "id": "emc_ex_single_arm_cable_triceps_kickback_m_deltoid_posterior_stab",
    "exerciseId": "ex_single_arm_cable_triceps_kickback",
    "muscleId": "m_deltoid_posterior",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Arm elevation"
  },
  {
    "id": "emc_ex_dumbbell_triceps_kickback_m_triceps_lateral_head_pri",
    "exerciseId": "ex_dumbbell_triceps_kickback",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 65,
    "role": "Primary",
    "notes": "Lateral head peak squeeze"
  },
  {
    "id": "emc_ex_dumbbell_triceps_kickback_m_triceps_long_head_pri",
    "exerciseId": "ex_dumbbell_triceps_kickback",
    "muscleId": "m_triceps_long_head",
    "percentage": 25,
    "role": "Primary",
    "notes": "Long head"
  },
  {
    "id": "emc_ex_dumbbell_triceps_kickback_m_triceps_medial_head_sec",
    "exerciseId": "ex_dumbbell_triceps_kickback",
    "muscleId": "m_triceps_medial_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Medial head"
  },
  {
    "id": "emc_ex_dumbbell_triceps_kickback_m_deltoid_posterior_stab",
    "exerciseId": "ex_dumbbell_triceps_kickback",
    "muscleId": "m_deltoid_posterior",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Rear delt"
  },
  {
    "id": "emc_ex_jm_press_m_triceps_lateral_head_pri",
    "exerciseId": "ex_jm_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 50,
    "role": "Primary",
    "notes": "Extreme heavy triceps overload"
  },
  {
    "id": "emc_ex_jm_press_m_triceps_medial_head_pri",
    "exerciseId": "ex_jm_press",
    "muscleId": "m_triceps_medial_head",
    "percentage": 30,
    "role": "Primary",
    "notes": "Medial head power"
  },
  {
    "id": "emc_ex_jm_press_m_chest_sternal_sec",
    "exerciseId": "ex_jm_press",
    "muscleId": "m_chest_sternal",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Pectoral press assist"
  },
  {
    "id": "emc_ex_jm_press_m_deltoid_anterior_sec",
    "exerciseId": "ex_jm_press",
    "muscleId": "m_deltoid_anterior",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Front delt"
  },
  {
    "id": "emc_ex_jm_press_m_rotator_cuff_stab",
    "exerciseId": "ex_jm_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Heavy joint stability"
  },
  {
    "id": "emc_ex_tate_press_m_triceps_lateral_head_pri",
    "exerciseId": "ex_tate_press",
    "muscleId": "m_triceps_lateral_head",
    "percentage": 55,
    "role": "Primary",
    "notes": "Lateral head"
  },
  {
    "id": "emc_ex_tate_press_m_triceps_medial_head_pri",
    "exerciseId": "ex_tate_press",
    "muscleId": "m_triceps_medial_head",
    "percentage": 35,
    "role": "Primary",
    "notes": "Medial head"
  },
  {
    "id": "emc_ex_tate_press_m_triceps_long_head_sec",
    "exerciseId": "ex_tate_press",
    "muscleId": "m_triceps_long_head",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Long head assist"
  },
  {
    "id": "emc_ex_tate_press_m_rotator_cuff_stab",
    "exerciseId": "ex_tate_press",
    "muscleId": "m_rotator_cuff",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Rotator cuff"
  },
  {
    "id": "emc_ex_barbell_wrist_curl_m_forearms_pri",
    "exerciseId": "ex_barbell_wrist_curl",
    "muscleId": "m_forearms",
    "percentage": 100,
    "role": "Primary",
    "notes": "Wrist flexors (flexor carpi radialis/ulnaris)"
  },
  {
    "id": "emc_ex_barbell_reverse_wrist_curl_m_forearms_pri",
    "exerciseId": "ex_barbell_reverse_wrist_curl",
    "muscleId": "m_forearms",
    "percentage": 100,
    "role": "Primary",
    "notes": "Wrist extensors (extensor carpi radialis/ulnaris)"
  },
  {
    "id": "emc_ex_dumbbell_wrist_curl_m_forearms_pri",
    "exerciseId": "ex_dumbbell_wrist_curl",
    "muscleId": "m_forearms",
    "percentage": 100,
    "role": "Primary",
    "notes": "Unilateral wrist flexors"
  },
  {
    "id": "emc_ex_farmers_walk_m_forearms_pri",
    "exerciseId": "ex_farmers_walk",
    "muscleId": "m_forearms",
    "percentage": 50,
    "role": "Primary",
    "notes": "Crushing isometric grip & wrist endurance"
  },
  {
    "id": "emc_ex_farmers_walk_m_trapezius_upper_pri",
    "exerciseId": "ex_farmers_walk",
    "muscleId": "m_trapezius_upper",
    "percentage": 35,
    "role": "Primary",
    "notes": "Heavy isometric scapular elevation"
  },
  {
    "id": "emc_ex_farmers_walk_m_core_sec",
    "exerciseId": "ex_farmers_walk",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Braced spinal stabilization"
  },
  {
    "id": "emc_ex_farmers_walk_m_gluteus_medius_stab",
    "exerciseId": "ex_farmers_walk",
    "muscleId": "m_gluteus_medius",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Pelvic balance in single-leg gait"
  },
  {
    "id": "emc_ex_farmers_walk_m_calves_gastrocnemius_stab",
    "exerciseId": "ex_farmers_walk",
    "muscleId": "m_calves_gastrocnemius",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Ankle stabilization"
  },
  {
    "id": "emc_ex_barbell_back_squat_high_bar_m_quadriceps_pri",
    "exerciseId": "ex_barbell_back_squat_high_bar",
    "muscleId": "m_quadriceps",
    "percentage": 60,
    "role": "Primary",
    "notes": "Knee extension drive"
  },
  {
    "id": "emc_ex_barbell_back_squat_high_bar_m_gluteus_maximus_pri",
    "exerciseId": "ex_barbell_back_squat_high_bar",
    "muscleId": "m_gluteus_maximus",
    "percentage": 25,
    "role": "Primary",
    "notes": "Hip extension out of hole"
  },
  {
    "id": "emc_ex_barbell_back_squat_high_bar_m_adductor_magnus_sec",
    "exerciseId": "ex_barbell_back_squat_high_bar",
    "muscleId": "m_adductor_magnus",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Medial hip stabilization & extension"
  },
  {
    "id": "emc_ex_barbell_back_squat_high_bar_m_erector_spinae_stab",
    "exerciseId": "ex_barbell_back_squat_high_bar",
    "muscleId": "m_erector_spinae",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Torso angle support"
  },
  {
    "id": "emc_ex_barbell_back_squat_high_bar_m_core_stab",
    "exerciseId": "ex_barbell_back_squat_high_bar",
    "muscleId": "m_core",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Intra-abdominal pressure"
  },
  {
    "id": "emc_ex_barbell_back_squat_high_bar_m_calves_soleus_stab",
    "exerciseId": "ex_barbell_back_squat_high_bar",
    "muscleId": "m_calves_soleus",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Ankle dorsiflexion control"
  },
  {
    "id": "emc_ex_barbell_back_squat_low_bar_m_quadriceps_pri",
    "exerciseId": "ex_barbell_back_squat_low_bar",
    "muscleId": "m_quadriceps",
    "percentage": 45,
    "role": "Primary",
    "notes": "Knee extension"
  },
  {
    "id": "emc_ex_barbell_back_squat_low_bar_m_gluteus_maximus_pri",
    "exerciseId": "ex_barbell_back_squat_low_bar",
    "muscleId": "m_gluteus_maximus",
    "percentage": 35,
    "role": "Primary",
    "notes": "Hip extension"
  },
  {
    "id": "emc_ex_barbell_back_squat_low_bar_m_hamstrings_sec",
    "exerciseId": "ex_barbell_back_squat_low_bar",
    "muscleId": "m_hamstrings",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Posterior chain synergy"
  },
  {
    "id": "emc_ex_barbell_back_squat_low_bar_m_adductor_magnus_sec",
    "exerciseId": "ex_barbell_back_squat_low_bar",
    "muscleId": "m_adductor_magnus",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Adductor drive"
  },
  {
    "id": "emc_ex_barbell_back_squat_low_bar_m_erector_spinae_stab",
    "exerciseId": "ex_barbell_back_squat_low_bar",
    "muscleId": "m_erector_spinae",
    "percentage": 30,
    "role": "Stabilizer",
    "notes": "Forward torso brace"
  },
  {
    "id": "emc_ex_barbell_back_squat_low_bar_m_core_stab",
    "exerciseId": "ex_barbell_back_squat_low_bar",
    "muscleId": "m_core",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Abdominal pressure"
  },
  {
    "id": "emc_ex_front_squat_barbell_m_quadriceps_pri",
    "exerciseId": "ex_front_squat_barbell",
    "muscleId": "m_quadriceps",
    "percentage": 75,
    "role": "Primary",
    "notes": "Maximum knee extension recruitment"
  },
  {
    "id": "emc_ex_front_squat_barbell_m_gluteus_maximus_sec",
    "exerciseId": "ex_front_squat_barbell",
    "muscleId": "m_gluteus_maximus",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Hip extension"
  },
  {
    "id": "emc_ex_front_squat_barbell_m_rectus_abdominis_sec",
    "exerciseId": "ex_front_squat_barbell",
    "muscleId": "m_rectus_abdominis",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Thoracic extension synergy"
  },
  {
    "id": "emc_ex_front_squat_barbell_m_erector_spinae_stab",
    "exerciseId": "ex_front_squat_barbell",
    "muscleId": "m_erector_spinae",
    "percentage": 30,
    "role": "Stabilizer",
    "notes": "Thoracic spine support"
  },
  {
    "id": "emc_ex_front_squat_barbell_m_transverse_abdominis_stab",
    "exerciseId": "ex_front_squat_barbell",
    "muscleId": "m_transverse_abdominis",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Anti-flexion core brace"
  },
  {
    "id": "emc_ex_zercher_squat_m_quadriceps_pri",
    "exerciseId": "ex_zercher_squat",
    "muscleId": "m_quadriceps",
    "percentage": 65,
    "role": "Primary",
    "notes": "Knee extension"
  },
  {
    "id": "emc_ex_zercher_squat_m_gluteus_maximus_pri",
    "exerciseId": "ex_zercher_squat",
    "muscleId": "m_gluteus_maximus",
    "percentage": 20,
    "role": "Primary",
    "notes": "Hip extension"
  },
  {
    "id": "emc_ex_zercher_squat_m_rectus_abdominis_sec",
    "exerciseId": "ex_zercher_squat",
    "muscleId": "m_rectus_abdominis",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Heavy anterior load resistance"
  },
  {
    "id": "emc_ex_zercher_squat_m_biceps_short_head_stab",
    "exerciseId": "ex_zercher_squat",
    "muscleId": "m_biceps_short_head",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Isometric bar cradle"
  },
  {
    "id": "emc_ex_zercher_squat_m_trapezius_upper_stab",
    "exerciseId": "ex_zercher_squat",
    "muscleId": "m_trapezius_upper",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Upper back brace"
  },
  {
    "id": "emc_ex_safety_bar_squat_m_quadriceps_pri",
    "exerciseId": "ex_safety_bar_squat",
    "muscleId": "m_quadriceps",
    "percentage": 65,
    "role": "Primary",
    "notes": "Quads"
  },
  {
    "id": "emc_ex_safety_bar_squat_m_gluteus_maximus_pri",
    "exerciseId": "ex_safety_bar_squat",
    "muscleId": "m_gluteus_maximus",
    "percentage": 20,
    "role": "Primary",
    "notes": "Glutes"
  },
  {
    "id": "emc_ex_safety_bar_squat_m_adductor_magnus_sec",
    "exerciseId": "ex_safety_bar_squat",
    "muscleId": "m_adductor_magnus",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Adductors"
  },
  {
    "id": "emc_ex_safety_bar_squat_m_trapezius_upper_stab",
    "exerciseId": "ex_safety_bar_squat",
    "muscleId": "m_trapezius_upper",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Thoracic erector overload"
  },
  {
    "id": "emc_ex_hack_squat_machine_m_quadriceps_pri",
    "exerciseId": "ex_hack_squat_machine",
    "muscleId": "m_quadriceps",
    "percentage": 80,
    "role": "Primary",
    "notes": "Pure knee extension overload"
  },
  {
    "id": "emc_ex_hack_squat_machine_m_gluteus_maximus_sec",
    "exerciseId": "ex_hack_squat_machine",
    "muscleId": "m_gluteus_maximus",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Hip extension assist"
  },
  {
    "id": "emc_ex_hack_squat_machine_m_adductor_magnus_stab",
    "exerciseId": "ex_hack_squat_machine",
    "muscleId": "m_adductor_magnus",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Knee tracking"
  },
  {
    "id": "emc_ex_leg_press_45_degree_m_quadriceps_pri",
    "exerciseId": "ex_leg_press_45_degree",
    "muscleId": "m_quadriceps",
    "percentage": 70,
    "role": "Primary",
    "notes": "Quadriceps drive"
  },
  {
    "id": "emc_ex_leg_press_45_degree_m_gluteus_maximus_pri",
    "exerciseId": "ex_leg_press_45_degree",
    "muscleId": "m_gluteus_maximus",
    "percentage": 20,
    "role": "Primary",
    "notes": "Glute assistance"
  },
  {
    "id": "emc_ex_leg_press_45_degree_m_adductor_magnus_sec",
    "exerciseId": "ex_leg_press_45_degree",
    "muscleId": "m_adductor_magnus",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Adductors"
  },
  {
    "id": "emc_ex_leg_press_45_degree_m_calves_gastrocnemius_stab",
    "exerciseId": "ex_leg_press_45_degree",
    "muscleId": "m_calves_gastrocnemius",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Ankle drive"
  },
  {
    "id": "emc_ex_dumbbell_walking_lunge_m_quadriceps_pri",
    "exerciseId": "ex_dumbbell_walking_lunge",
    "muscleId": "m_quadriceps",
    "percentage": 50,
    "role": "Primary",
    "notes": "Front leg knee extension"
  },
  {
    "id": "emc_ex_dumbbell_walking_lunge_m_gluteus_maximus_pri",
    "exerciseId": "ex_dumbbell_walking_lunge",
    "muscleId": "m_gluteus_maximus",
    "percentage": 35,
    "role": "Primary",
    "notes": "Hip extension propulsion"
  },
  {
    "id": "emc_ex_dumbbell_walking_lunge_m_hamstrings_sec",
    "exerciseId": "ex_dumbbell_walking_lunge",
    "muscleId": "m_hamstrings",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Deceleration synergy"
  },
  {
    "id": "emc_ex_dumbbell_walking_lunge_m_gluteus_medius_stab",
    "exerciseId": "ex_dumbbell_walking_lunge",
    "muscleId": "m_gluteus_medius",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Single-leg pelvic stabilization"
  },
  {
    "id": "emc_ex_dumbbell_walking_lunge_m_core_stab",
    "exerciseId": "ex_dumbbell_walking_lunge",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Upright balance"
  },
  {
    "id": "emc_ex_reverse_lunge_dumbbell_m_quadriceps_pri",
    "exerciseId": "ex_reverse_lunge_dumbbell",
    "muscleId": "m_quadriceps",
    "percentage": 50,
    "role": "Primary",
    "notes": "Quads"
  },
  {
    "id": "emc_ex_reverse_lunge_dumbbell_m_gluteus_maximus_pri",
    "exerciseId": "ex_reverse_lunge_dumbbell",
    "muscleId": "m_gluteus_maximus",
    "percentage": 35,
    "role": "Primary",
    "notes": "Glutes"
  },
  {
    "id": "emc_ex_reverse_lunge_dumbbell_m_hamstrings_sec",
    "exerciseId": "ex_reverse_lunge_dumbbell",
    "muscleId": "m_hamstrings",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Hamstrings"
  },
  {
    "id": "emc_ex_reverse_lunge_dumbbell_m_gluteus_medius_stab",
    "exerciseId": "ex_reverse_lunge_dumbbell",
    "muscleId": "m_gluteus_medius",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Pelvic balance"
  },
  {
    "id": "emc_ex_bulgarian_split_squat_m_quadriceps_pri",
    "exerciseId": "ex_bulgarian_split_squat",
    "muscleId": "m_quadriceps",
    "percentage": 55,
    "role": "Primary",
    "notes": "Front leg quad driver"
  },
  {
    "id": "emc_ex_bulgarian_split_squat_m_gluteus_maximus_pri",
    "exerciseId": "ex_bulgarian_split_squat",
    "muscleId": "m_gluteus_maximus",
    "percentage": 35,
    "role": "Primary",
    "notes": "Deep hip extension"
  },
  {
    "id": "emc_ex_bulgarian_split_squat_m_adductor_magnus_sec",
    "exerciseId": "ex_bulgarian_split_squat",
    "muscleId": "m_adductor_magnus",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Hip stabilization"
  },
  {
    "id": "emc_ex_bulgarian_split_squat_m_gluteus_medius_stab",
    "exerciseId": "ex_bulgarian_split_squat",
    "muscleId": "m_gluteus_medius",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Unilateral hip balance"
  },
  {
    "id": "emc_ex_bulgarian_split_squat_m_core_stab",
    "exerciseId": "ex_bulgarian_split_squat",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Trunk stability"
  },
  {
    "id": "emc_ex_goblet_squat_m_quadriceps_pri",
    "exerciseId": "ex_goblet_squat",
    "muscleId": "m_quadriceps",
    "percentage": 65,
    "role": "Primary",
    "notes": "Knee extension"
  },
  {
    "id": "emc_ex_goblet_squat_m_gluteus_maximus_pri",
    "exerciseId": "ex_goblet_squat",
    "muscleId": "m_gluteus_maximus",
    "percentage": 25,
    "role": "Primary",
    "notes": "Hip extension"
  },
  {
    "id": "emc_ex_goblet_squat_m_adductor_magnus_sec",
    "exerciseId": "ex_goblet_squat",
    "muscleId": "m_adductor_magnus",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Adductors"
  },
  {
    "id": "emc_ex_goblet_squat_m_core_stab",
    "exerciseId": "ex_goblet_squat",
    "muscleId": "m_core",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Anterior core brace"
  },
  {
    "id": "emc_ex_sissy_squat_bodyweight_m_quadriceps_pri",
    "exerciseId": "ex_sissy_squat_bodyweight",
    "muscleId": "m_quadriceps",
    "percentage": 95,
    "role": "Primary",
    "notes": "Pure rectus femoris & knee extension stretch"
  },
  {
    "id": "emc_ex_sissy_squat_bodyweight_m_rectus_abdominis_sec",
    "exerciseId": "ex_sissy_squat_bodyweight",
    "muscleId": "m_rectus_abdominis",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Torso anti-extension"
  },
  {
    "id": "emc_ex_sissy_squat_bodyweight_m_tibialis_anterior_stab",
    "exerciseId": "ex_sissy_squat_bodyweight",
    "muscleId": "m_tibialis_anterior",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Ankle lock"
  },
  {
    "id": "emc_ex_leg_extension_machine_m_quadriceps_pri",
    "exerciseId": "ex_leg_extension_machine",
    "muscleId": "m_quadriceps",
    "percentage": 100,
    "role": "Primary",
    "notes": "Pure isolated quadriceps knee extension"
  },
  {
    "id": "emc_ex_romanian_deadlift_barbell_m_hamstrings_pri",
    "exerciseId": "ex_romanian_deadlift_barbell",
    "muscleId": "m_hamstrings",
    "percentage": 60,
    "role": "Primary",
    "notes": "Hamstring eccentric loaded stretch"
  },
  {
    "id": "emc_ex_romanian_deadlift_barbell_m_gluteus_maximus_pri",
    "exerciseId": "ex_romanian_deadlift_barbell",
    "muscleId": "m_gluteus_maximus",
    "percentage": 30,
    "role": "Primary",
    "notes": "Hip extension power"
  },
  {
    "id": "emc_ex_romanian_deadlift_barbell_m_erector_spinae_sec",
    "exerciseId": "ex_romanian_deadlift_barbell",
    "muscleId": "m_erector_spinae",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Isometric back brace"
  },
  {
    "id": "emc_ex_romanian_deadlift_barbell_m_latissimus_dorsi_stab",
    "exerciseId": "ex_romanian_deadlift_barbell",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Keeping bar close"
  },
  {
    "id": "emc_ex_romanian_deadlift_barbell_m_forearms_stab",
    "exerciseId": "ex_romanian_deadlift_barbell",
    "muscleId": "m_forearms",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Grip"
  },
  {
    "id": "emc_ex_romanian_deadlift_dumbbell_m_hamstrings_pri",
    "exerciseId": "ex_romanian_deadlift_dumbbell",
    "muscleId": "m_hamstrings",
    "percentage": 60,
    "role": "Primary",
    "notes": "Hamstrings"
  },
  {
    "id": "emc_ex_romanian_deadlift_dumbbell_m_gluteus_maximus_pri",
    "exerciseId": "ex_romanian_deadlift_dumbbell",
    "muscleId": "m_gluteus_maximus",
    "percentage": 30,
    "role": "Primary",
    "notes": "Glutes"
  },
  {
    "id": "emc_ex_romanian_deadlift_dumbbell_m_erector_spinae_sec",
    "exerciseId": "ex_romanian_deadlift_dumbbell",
    "muscleId": "m_erector_spinae",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Spinal support"
  },
  {
    "id": "emc_ex_romanian_deadlift_dumbbell_m_core_stab",
    "exerciseId": "ex_romanian_deadlift_dumbbell",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Core brace"
  },
  {
    "id": "emc_ex_stiff_legged_deadlift_m_hamstrings_pri",
    "exerciseId": "ex_stiff_legged_deadlift",
    "muscleId": "m_hamstrings",
    "percentage": 65,
    "role": "Primary",
    "notes": "Long-lever hamstring pull"
  },
  {
    "id": "emc_ex_stiff_legged_deadlift_m_erector_spinae_pri",
    "exerciseId": "ex_stiff_legged_deadlift",
    "muscleId": "m_erector_spinae",
    "percentage": 25,
    "role": "Primary",
    "notes": "Spinal erectors"
  },
  {
    "id": "emc_ex_stiff_legged_deadlift_m_gluteus_maximus_sec",
    "exerciseId": "ex_stiff_legged_deadlift",
    "muscleId": "m_gluteus_maximus",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Glutes"
  },
  {
    "id": "emc_ex_stiff_legged_deadlift_m_forearms_stab",
    "exerciseId": "ex_stiff_legged_deadlift",
    "muscleId": "m_forearms",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Grip"
  },
  {
    "id": "emc_ex_lying_leg_curl_machine_m_hamstrings_pri",
    "exerciseId": "ex_lying_leg_curl_machine",
    "muscleId": "m_hamstrings",
    "percentage": 85,
    "role": "Primary",
    "notes": "Direct knee flexion isolation"
  },
  {
    "id": "emc_ex_lying_leg_curl_machine_m_calves_gastrocnemius_sec",
    "exerciseId": "ex_lying_leg_curl_machine",
    "muscleId": "m_calves_gastrocnemius",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Gastrocnemius knee flexion assist"
  },
  {
    "id": "emc_ex_lying_leg_curl_machine_m_gluteus_maximus_stab",
    "exerciseId": "ex_lying_leg_curl_machine",
    "muscleId": "m_gluteus_maximus",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Hip stabilization against pad"
  },
  {
    "id": "emc_ex_seated_leg_curl_machine_m_hamstrings_pri",
    "exerciseId": "ex_seated_leg_curl_machine",
    "muscleId": "m_hamstrings",
    "percentage": 90,
    "role": "Primary",
    "notes": "Lengthened state hamstring knee flexion"
  },
  {
    "id": "emc_ex_seated_leg_curl_machine_m_calves_gastrocnemius_sec",
    "exerciseId": "ex_seated_leg_curl_machine",
    "muscleId": "m_calves_gastrocnemius",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Calf assist"
  },
  {
    "id": "emc_ex_standing_single_leg_curl_m_hamstrings_pri",
    "exerciseId": "ex_standing_single_leg_curl",
    "muscleId": "m_hamstrings",
    "percentage": 90,
    "role": "Primary",
    "notes": "Unilateral knee flexion"
  },
  {
    "id": "emc_ex_standing_single_leg_curl_m_calves_gastrocnemius_sec",
    "exerciseId": "ex_standing_single_leg_curl",
    "muscleId": "m_calves_gastrocnemius",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Calves"
  },
  {
    "id": "emc_ex_nordic_hamstring_curl_m_hamstrings_pri",
    "exerciseId": "ex_nordic_hamstring_curl",
    "muscleId": "m_hamstrings",
    "percentage": 85,
    "role": "Primary",
    "notes": "Extreme eccentric knee flexion load"
  },
  {
    "id": "emc_ex_nordic_hamstring_curl_m_gluteus_maximus_sec",
    "exerciseId": "ex_nordic_hamstring_curl",
    "muscleId": "m_gluteus_maximus",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Hip extension lockout"
  },
  {
    "id": "emc_ex_nordic_hamstring_curl_m_calves_gastrocnemius_sec",
    "exerciseId": "ex_nordic_hamstring_curl",
    "muscleId": "m_calves_gastrocnemius",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Knee flexion assistance"
  },
  {
    "id": "emc_ex_nordic_hamstring_curl_m_rectus_abdominis_stab",
    "exerciseId": "ex_nordic_hamstring_curl",
    "muscleId": "m_rectus_abdominis",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Torso alignment"
  },
  {
    "id": "emc_ex_nordic_hamstring_curl_m_erector_spinae_stab",
    "exerciseId": "ex_nordic_hamstring_curl",
    "muscleId": "m_erector_spinae",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Spine lock"
  },
  {
    "id": "emc_ex_glute_ham_raise_ghr_m_hamstrings_pri",
    "exerciseId": "ex_glute_ham_raise_ghr",
    "muscleId": "m_hamstrings",
    "percentage": 60,
    "role": "Primary",
    "notes": "Combined hip & knee flexion power"
  },
  {
    "id": "emc_ex_glute_ham_raise_ghr_m_gluteus_maximus_pri",
    "exerciseId": "ex_glute_ham_raise_ghr",
    "muscleId": "m_gluteus_maximus",
    "percentage": 30,
    "role": "Primary",
    "notes": "Hip extension"
  },
  {
    "id": "emc_ex_glute_ham_raise_ghr_m_erector_spinae_sec",
    "exerciseId": "ex_glute_ham_raise_ghr",
    "muscleId": "m_erector_spinae",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Back brace"
  },
  {
    "id": "emc_ex_glute_ham_raise_ghr_m_calves_gastrocnemius_stab",
    "exerciseId": "ex_glute_ham_raise_ghr",
    "muscleId": "m_calves_gastrocnemius",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Calf anchoring"
  },
  {
    "id": "emc_ex_step_up_dumbbell_m_quadriceps_pri",
    "exerciseId": "ex_step_up_dumbbell",
    "muscleId": "m_quadriceps",
    "percentage": 55,
    "role": "Primary",
    "notes": "Front leg knee extension"
  },
  {
    "id": "emc_ex_step_up_dumbbell_m_gluteus_maximus_pri",
    "exerciseId": "ex_step_up_dumbbell",
    "muscleId": "m_gluteus_maximus",
    "percentage": 35,
    "role": "Primary",
    "notes": "Hip extension"
  },
  {
    "id": "emc_ex_step_up_dumbbell_m_hamstrings_sec",
    "exerciseId": "ex_step_up_dumbbell",
    "muscleId": "m_hamstrings",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Hamstrings"
  },
  {
    "id": "emc_ex_step_up_dumbbell_m_gluteus_medius_stab",
    "exerciseId": "ex_step_up_dumbbell",
    "muscleId": "m_gluteus_medius",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Pelvic balance"
  },
  {
    "id": "emc_ex_box_squat_barbell_m_quadriceps_pri",
    "exerciseId": "ex_box_squat_barbell",
    "muscleId": "m_quadriceps",
    "percentage": 50,
    "role": "Primary",
    "notes": "Quads"
  },
  {
    "id": "emc_ex_box_squat_barbell_m_gluteus_maximus_pri",
    "exerciseId": "ex_box_squat_barbell",
    "muscleId": "m_gluteus_maximus",
    "percentage": 35,
    "role": "Primary",
    "notes": "Glutes"
  },
  {
    "id": "emc_ex_box_squat_barbell_m_hamstrings_sec",
    "exerciseId": "ex_box_squat_barbell",
    "muscleId": "m_hamstrings",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Hamstrings"
  },
  {
    "id": "emc_ex_box_squat_barbell_m_erector_spinae_stab",
    "exerciseId": "ex_box_squat_barbell",
    "muscleId": "m_erector_spinae",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Spinal brace"
  },
  {
    "id": "emc_ex_standing_calf_raise_machine_m_calves_gastrocnemius_pri",
    "exerciseId": "ex_standing_calf_raise_machine",
    "muscleId": "m_calves_gastrocnemius",
    "percentage": 75,
    "role": "Primary",
    "notes": "Straight-knee gastrocnemius recruitment"
  },
  {
    "id": "emc_ex_standing_calf_raise_machine_m_calves_soleus_pri",
    "exerciseId": "ex_standing_calf_raise_machine",
    "muscleId": "m_calves_soleus",
    "percentage": 25,
    "role": "Primary",
    "notes": "Soleus plantarflexion"
  },
  {
    "id": "emc_ex_seated_calf_raise_machine_m_calves_soleus_pri",
    "exerciseId": "ex_seated_calf_raise_machine",
    "muscleId": "m_calves_soleus",
    "percentage": 85,
    "role": "Primary",
    "notes": "Direct soleus isolation (bent knee)"
  },
  {
    "id": "emc_ex_seated_calf_raise_machine_m_calves_gastrocnemius_pri",
    "exerciseId": "ex_seated_calf_raise_machine",
    "muscleId": "m_calves_gastrocnemius",
    "percentage": 15,
    "role": "Primary",
    "notes": "Minor gastrocnemius assist"
  },
  {
    "id": "emc_ex_leg_press_calf_raise_m_calves_gastrocnemius_pri",
    "exerciseId": "ex_leg_press_calf_raise",
    "muscleId": "m_calves_gastrocnemius",
    "percentage": 75,
    "role": "Primary",
    "notes": "Gastrocnemius"
  },
  {
    "id": "emc_ex_leg_press_calf_raise_m_calves_soleus_pri",
    "exerciseId": "ex_leg_press_calf_raise",
    "muscleId": "m_calves_soleus",
    "percentage": 25,
    "role": "Primary",
    "notes": "Soleus"
  },
  {
    "id": "emc_ex_donkey_calf_raise_m_calves_gastrocnemius_pri",
    "exerciseId": "ex_donkey_calf_raise",
    "muscleId": "m_calves_gastrocnemius",
    "percentage": 80,
    "role": "Primary",
    "notes": "Gastrocnemius peak recruitment"
  },
  {
    "id": "emc_ex_donkey_calf_raise_m_calves_soleus_pri",
    "exerciseId": "ex_donkey_calf_raise",
    "muscleId": "m_calves_soleus",
    "percentage": 20,
    "role": "Primary",
    "notes": "Soleus"
  },
  {
    "id": "emc_ex_single_leg_dumbbell_calf_raise_m_calves_gastrocnemius_pri",
    "exerciseId": "ex_single_leg_dumbbell_calf_raise",
    "muscleId": "m_calves_gastrocnemius",
    "percentage": 75,
    "role": "Primary",
    "notes": "Unilateral gastrocnemius"
  },
  {
    "id": "emc_ex_single_leg_dumbbell_calf_raise_m_calves_soleus_pri",
    "exerciseId": "ex_single_leg_dumbbell_calf_raise",
    "muscleId": "m_calves_soleus",
    "percentage": 25,
    "role": "Primary",
    "notes": "Soleus"
  },
  {
    "id": "emc_ex_single_leg_dumbbell_calf_raise_m_tibialis_anterior_stab",
    "exerciseId": "ex_single_leg_dumbbell_calf_raise",
    "muscleId": "m_tibialis_anterior",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Ankle balance"
  },
  {
    "id": "emc_ex_tibialis_anterior_raise_wall_m_tibialis_anterior_pri",
    "exerciseId": "ex_tibialis_anterior_raise_wall",
    "muscleId": "m_tibialis_anterior",
    "percentage": 100,
    "role": "Primary",
    "notes": "Pure ankle dorsiflexion"
  },
  {
    "id": "emc_ex_tibialis_anterior_cable_pull_m_tibialis_anterior_pri",
    "exerciseId": "ex_tibialis_anterior_cable_pull",
    "muscleId": "m_tibialis_anterior",
    "percentage": 100,
    "role": "Primary",
    "notes": "Loaded shin dorsiflexion"
  },
  {
    "id": "emc_ex_smith_machine_squat_m_quadriceps_pri",
    "exerciseId": "ex_smith_machine_squat",
    "muscleId": "m_quadriceps",
    "percentage": 75,
    "role": "Primary",
    "notes": "Quadriceps focus"
  },
  {
    "id": "emc_ex_smith_machine_squat_m_gluteus_maximus_pri",
    "exerciseId": "ex_smith_machine_squat",
    "muscleId": "m_gluteus_maximus",
    "percentage": 25,
    "role": "Primary",
    "notes": "Glutes"
  },
  {
    "id": "emc_ex_smith_machine_calf_raise_m_calves_gastrocnemius_pri",
    "exerciseId": "ex_smith_machine_calf_raise",
    "muscleId": "m_calves_gastrocnemius",
    "percentage": 75,
    "role": "Primary",
    "notes": "Calves"
  },
  {
    "id": "emc_ex_smith_machine_calf_raise_m_calves_soleus_pri",
    "exerciseId": "ex_smith_machine_calf_raise",
    "muscleId": "m_calves_soleus",
    "percentage": 25,
    "role": "Primary",
    "notes": "Soleus"
  },
  {
    "id": "emc_ex_deficit_romanian_deadlift_m_hamstrings_pri",
    "exerciseId": "ex_deficit_romanian_deadlift",
    "muscleId": "m_hamstrings",
    "percentage": 65,
    "role": "Primary",
    "notes": "Extended range hamstring stretch"
  },
  {
    "id": "emc_ex_deficit_romanian_deadlift_m_gluteus_maximus_pri",
    "exerciseId": "ex_deficit_romanian_deadlift",
    "muscleId": "m_gluteus_maximus",
    "percentage": 25,
    "role": "Primary",
    "notes": "Glutes"
  },
  {
    "id": "emc_ex_deficit_romanian_deadlift_m_erector_spinae_sec",
    "exerciseId": "ex_deficit_romanian_deadlift",
    "muscleId": "m_erector_spinae",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Lower back"
  },
  {
    "id": "emc_ex_deficit_romanian_deadlift_m_core_stab",
    "exerciseId": "ex_deficit_romanian_deadlift",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Core brace"
  },
  {
    "id": "emc_ex_overhead_squat_barbell_m_quadriceps_pri",
    "exerciseId": "ex_overhead_squat_barbell",
    "muscleId": "m_quadriceps",
    "percentage": 50,
    "role": "Primary",
    "notes": "Deep knee flexion"
  },
  {
    "id": "emc_ex_overhead_squat_barbell_m_gluteus_maximus_pri",
    "exerciseId": "ex_overhead_squat_barbell",
    "muscleId": "m_gluteus_maximus",
    "percentage": 25,
    "role": "Primary",
    "notes": "Hip extension"
  },
  {
    "id": "emc_ex_overhead_squat_barbell_m_trapezius_upper_sec",
    "exerciseId": "ex_overhead_squat_barbell",
    "muscleId": "m_trapezius_upper",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Overhead active trap lock"
  },
  {
    "id": "emc_ex_overhead_squat_barbell_m_core_sec",
    "exerciseId": "ex_overhead_squat_barbell",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Torso stabilization"
  },
  {
    "id": "emc_ex_overhead_squat_barbell_m_rotator_cuff_stab",
    "exerciseId": "ex_overhead_squat_barbell",
    "muscleId": "m_rotator_cuff",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Shoulder lock"
  },
  {
    "id": "emc_ex_overhead_squat_barbell_m_erector_spinae_stab",
    "exerciseId": "ex_overhead_squat_barbell",
    "muscleId": "m_erector_spinae",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Thoracic extension"
  },
  {
    "id": "emc_ex_good_morning_safety_bar_m_hamstrings_pri",
    "exerciseId": "ex_good_morning_safety_bar",
    "muscleId": "m_hamstrings",
    "percentage": 60,
    "role": "Primary",
    "notes": "Hamstrings"
  },
  {
    "id": "emc_ex_good_morning_safety_bar_m_erector_spinae_pri",
    "exerciseId": "ex_good_morning_safety_bar",
    "muscleId": "m_erector_spinae",
    "percentage": 30,
    "role": "Primary",
    "notes": "Spinal erectors"
  },
  {
    "id": "emc_ex_good_morning_safety_bar_m_gluteus_maximus_sec",
    "exerciseId": "ex_good_morning_safety_bar",
    "muscleId": "m_gluteus_maximus",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Glutes"
  },
  {
    "id": "emc_ex_good_morning_safety_bar_m_core_stab",
    "exerciseId": "ex_good_morning_safety_bar",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Abdominal pressure"
  },
  {
    "id": "emc_ex_barbell_hip_thrust_m_gluteus_maximus_pri",
    "exerciseId": "ex_barbell_hip_thrust",
    "muscleId": "m_gluteus_maximus",
    "percentage": 80,
    "role": "Primary",
    "notes": "Peak hip extension in shortened position"
  },
  {
    "id": "emc_ex_barbell_hip_thrust_m_gluteus_medius_pri",
    "exerciseId": "ex_barbell_hip_thrust",
    "muscleId": "m_gluteus_medius",
    "percentage": 10,
    "role": "Primary",
    "notes": "Femoral external rotation & abduction"
  },
  {
    "id": "emc_ex_barbell_hip_thrust_m_hamstrings_sec",
    "exerciseId": "ex_barbell_hip_thrust",
    "muscleId": "m_hamstrings",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Hamstring hip extension synergy"
  },
  {
    "id": "emc_ex_barbell_hip_thrust_m_core_stab",
    "exerciseId": "ex_barbell_hip_thrust",
    "muscleId": "m_core",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Pelvic tilt control & bracing"
  },
  {
    "id": "emc_ex_barbell_hip_thrust_m_adductor_magnus_stab",
    "exerciseId": "ex_barbell_hip_thrust",
    "muscleId": "m_adductor_magnus",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Medial hip tracking"
  },
  {
    "id": "emc_ex_single_leg_hip_thrust_m_gluteus_maximus_pri",
    "exerciseId": "ex_single_leg_hip_thrust",
    "muscleId": "m_gluteus_maximus",
    "percentage": 75,
    "role": "Primary",
    "notes": "Unilateral glute drive"
  },
  {
    "id": "emc_ex_single_leg_hip_thrust_m_gluteus_medius_pri",
    "exerciseId": "ex_single_leg_hip_thrust",
    "muscleId": "m_gluteus_medius",
    "percentage": 15,
    "role": "Primary",
    "notes": "High pelvic stability demand"
  },
  {
    "id": "emc_ex_single_leg_hip_thrust_m_hamstrings_sec",
    "exerciseId": "ex_single_leg_hip_thrust",
    "muscleId": "m_hamstrings",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Hamstring synergy"
  },
  {
    "id": "emc_ex_single_leg_hip_thrust_m_core_stab",
    "exerciseId": "ex_single_leg_hip_thrust",
    "muscleId": "m_core",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Anti-rotation core"
  },
  {
    "id": "emc_ex_kas_glute_bridge_m_gluteus_maximus_pri",
    "exerciseId": "ex_kas_glute_bridge",
    "muscleId": "m_gluteus_maximus",
    "percentage": 90,
    "role": "Primary",
    "notes": "Constant tension upper range glute isolation"
  },
  {
    "id": "emc_ex_kas_glute_bridge_m_gluteus_medius_pri",
    "exerciseId": "ex_kas_glute_bridge",
    "muscleId": "m_gluteus_medius",
    "percentage": 10,
    "role": "Primary",
    "notes": "External rotation"
  },
  {
    "id": "emc_ex_kas_glute_bridge_m_core_stab",
    "exerciseId": "ex_kas_glute_bridge",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Pelvic control"
  },
  {
    "id": "emc_ex_dumbbell_glute_bridge_m_gluteus_maximus_pri",
    "exerciseId": "ex_dumbbell_glute_bridge",
    "muscleId": "m_gluteus_maximus",
    "percentage": 85,
    "role": "Primary",
    "notes": "Glute extension"
  },
  {
    "id": "emc_ex_dumbbell_glute_bridge_m_hamstrings_sec",
    "exerciseId": "ex_dumbbell_glute_bridge",
    "muscleId": "m_hamstrings",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Hamstring assist"
  },
  {
    "id": "emc_ex_dumbbell_glute_bridge_m_core_stab",
    "exerciseId": "ex_dumbbell_glute_bridge",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Core brace"
  },
  {
    "id": "emc_ex_cable_glute_kickback_m_gluteus_maximus_pri",
    "exerciseId": "ex_cable_glute_kickback",
    "muscleId": "m_gluteus_maximus",
    "percentage": 85,
    "role": "Primary",
    "notes": "Isolated hip extension"
  },
  {
    "id": "emc_ex_cable_glute_kickback_m_gluteus_medius_sec",
    "exerciseId": "ex_cable_glute_kickback",
    "muscleId": "m_gluteus_medius",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Abduction synergy"
  },
  {
    "id": "emc_ex_cable_glute_kickback_m_hamstrings_sec",
    "exerciseId": "ex_cable_glute_kickback",
    "muscleId": "m_hamstrings",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Hamstrings"
  },
  {
    "id": "emc_ex_cable_glute_kickback_m_gluteus_medius_stab",
    "exerciseId": "ex_cable_glute_kickback",
    "muscleId": "m_gluteus_medius",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Standing leg stability"
  },
  {
    "id": "emc_ex_machine_glute_kickback_m_gluteus_maximus_pri",
    "exerciseId": "ex_machine_glute_kickback",
    "muscleId": "m_gluteus_maximus",
    "percentage": 90,
    "role": "Primary",
    "notes": "Machine guided glute max"
  },
  {
    "id": "emc_ex_machine_glute_kickback_m_hamstrings_sec",
    "exerciseId": "ex_machine_glute_kickback",
    "muscleId": "m_hamstrings",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Hamstrings"
  },
  {
    "id": "emc_ex_hyperextension_glute_focus_m_gluteus_maximus_pri",
    "exerciseId": "ex_hyperextension_glute_focus",
    "muscleId": "m_gluteus_maximus",
    "percentage": 80,
    "role": "Primary",
    "notes": "Glute max extension with round back"
  },
  {
    "id": "emc_ex_hyperextension_glute_focus_m_hamstrings_sec",
    "exerciseId": "ex_hyperextension_glute_focus",
    "muscleId": "m_hamstrings",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Hamstring synergy"
  },
  {
    "id": "emc_ex_hyperextension_glute_focus_m_adductor_magnus_stab",
    "exerciseId": "ex_hyperextension_glute_focus",
    "muscleId": "m_adductor_magnus",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Hip stability"
  },
  {
    "id": "emc_ex_cable_pull_through_m_gluteus_maximus_pri",
    "exerciseId": "ex_cable_pull_through",
    "muscleId": "m_gluteus_maximus",
    "percentage": 65,
    "role": "Primary",
    "notes": "Horizontal hip extension"
  },
  {
    "id": "emc_ex_cable_pull_through_m_hamstrings_pri",
    "exerciseId": "ex_cable_pull_through",
    "muscleId": "m_hamstrings",
    "percentage": 25,
    "role": "Primary",
    "notes": "Hamstring hinge"
  },
  {
    "id": "emc_ex_cable_pull_through_m_erector_spinae_sec",
    "exerciseId": "ex_cable_pull_through",
    "muscleId": "m_erector_spinae",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Spinal support"
  },
  {
    "id": "emc_ex_cable_pull_through_m_core_stab",
    "exerciseId": "ex_cable_pull_through",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Core brace"
  },
  {
    "id": "emc_ex_frog_pumps_m_gluteus_maximus_pri",
    "exerciseId": "ex_frog_pumps",
    "muscleId": "m_gluteus_maximus",
    "percentage": 80,
    "role": "Primary",
    "notes": "Glute max in external rotation"
  },
  {
    "id": "emc_ex_frog_pumps_m_gluteus_medius_pri",
    "exerciseId": "ex_frog_pumps",
    "muscleId": "m_gluteus_medius",
    "percentage": 20,
    "role": "Primary",
    "notes": "Abduction holding knees apart"
  },
  {
    "id": "emc_ex_curtsy_lunge_m_gluteus_maximus_pri",
    "exerciseId": "ex_curtsy_lunge",
    "muscleId": "m_gluteus_maximus",
    "percentage": 50,
    "role": "Primary",
    "notes": "Glute max extension"
  },
  {
    "id": "emc_ex_curtsy_lunge_m_gluteus_medius_pri",
    "exerciseId": "ex_curtsy_lunge",
    "muscleId": "m_gluteus_medius",
    "percentage": 35,
    "role": "Primary",
    "notes": "Loaded lateral hip stabilization"
  },
  {
    "id": "emc_ex_curtsy_lunge_m_quadriceps_sec",
    "exerciseId": "ex_curtsy_lunge",
    "muscleId": "m_quadriceps",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Quad drive"
  },
  {
    "id": "emc_ex_curtsy_lunge_m_adductor_magnus_stab",
    "exerciseId": "ex_curtsy_lunge",
    "muscleId": "m_adductor_magnus",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Inner thigh balance"
  },
  {
    "id": "emc_ex_b_stance_romanian_deadlift_m_gluteus_maximus_pri",
    "exerciseId": "ex_b_stance_romanian_deadlift",
    "muscleId": "m_gluteus_maximus",
    "percentage": 55,
    "role": "Primary",
    "notes": "Targeted glute hinge"
  },
  {
    "id": "emc_ex_b_stance_romanian_deadlift_m_hamstrings_pri",
    "exerciseId": "ex_b_stance_romanian_deadlift",
    "muscleId": "m_hamstrings",
    "percentage": 35,
    "role": "Primary",
    "notes": "Hamstring stretch"
  },
  {
    "id": "emc_ex_b_stance_romanian_deadlift_m_gluteus_medius_sec",
    "exerciseId": "ex_b_stance_romanian_deadlift",
    "muscleId": "m_gluteus_medius",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Hip stabilization"
  },
  {
    "id": "emc_ex_b_stance_romanian_deadlift_m_core_stab",
    "exerciseId": "ex_b_stance_romanian_deadlift",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Anti-rotation core"
  },
  {
    "id": "emc_ex_step_up_glute_biased_m_gluteus_maximus_pri",
    "exerciseId": "ex_step_up_glute_biased",
    "muscleId": "m_gluteus_maximus",
    "percentage": 65,
    "role": "Primary",
    "notes": "High hip extension angle"
  },
  {
    "id": "emc_ex_step_up_glute_biased_m_quadriceps_pri",
    "exerciseId": "ex_step_up_glute_biased",
    "muscleId": "m_quadriceps",
    "percentage": 25,
    "role": "Primary",
    "notes": "Knee extension assist"
  },
  {
    "id": "emc_ex_step_up_glute_biased_m_hamstrings_sec",
    "exerciseId": "ex_step_up_glute_biased",
    "muscleId": "m_hamstrings",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Hamstrings"
  },
  {
    "id": "emc_ex_step_up_glute_biased_m_gluteus_medius_stab",
    "exerciseId": "ex_step_up_glute_biased",
    "muscleId": "m_gluteus_medius",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Unilateral balance"
  },
  {
    "id": "emc_ex_lateral_band_walk_m_gluteus_medius_pri",
    "exerciseId": "ex_lateral_band_walk",
    "muscleId": "m_gluteus_medius",
    "percentage": 75,
    "role": "Primary",
    "notes": "Direct hip abduction"
  },
  {
    "id": "emc_ex_lateral_band_walk_m_gluteus_minimus_pri",
    "exerciseId": "ex_lateral_band_walk",
    "muscleId": "m_gluteus_minimus",
    "percentage": 15,
    "role": "Primary",
    "notes": "Deep abductor"
  },
  {
    "id": "emc_ex_lateral_band_walk_m_gluteus_maximus_sec",
    "exerciseId": "ex_lateral_band_walk",
    "muscleId": "m_gluteus_maximus",
    "percentage": 10,
    "role": "Secondary",
    "notes": "External rotation support"
  },
  {
    "id": "emc_ex_lateral_band_walk_m_core_stab",
    "exerciseId": "ex_lateral_band_walk",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Athletic posture"
  },
  {
    "id": "emc_ex_clamshell_banded_m_gluteus_medius_pri",
    "exerciseId": "ex_clamshell_banded",
    "muscleId": "m_gluteus_medius",
    "percentage": 80,
    "role": "Primary",
    "notes": "Hip external rotation and abduction"
  },
  {
    "id": "emc_ex_clamshell_banded_m_gluteus_minimus_pri",
    "exerciseId": "ex_clamshell_banded",
    "muscleId": "m_gluteus_minimus",
    "percentage": 20,
    "role": "Primary",
    "notes": "Deep lateral pelvis"
  },
  {
    "id": "emc_ex_cable_hip_abduction_m_gluteus_medius_pri",
    "exerciseId": "ex_cable_hip_abduction",
    "muscleId": "m_gluteus_medius",
    "percentage": 80,
    "role": "Primary",
    "notes": "Standing abduction"
  },
  {
    "id": "emc_ex_cable_hip_abduction_m_gluteus_minimus_pri",
    "exerciseId": "ex_cable_hip_abduction",
    "muscleId": "m_gluteus_minimus",
    "percentage": 15,
    "role": "Primary",
    "notes": "Minimus"
  },
  {
    "id": "emc_ex_cable_hip_abduction_m_gluteus_maximus_sec",
    "exerciseId": "ex_cable_hip_abduction",
    "muscleId": "m_gluteus_maximus",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Upper max fibers"
  },
  {
    "id": "emc_ex_cable_hip_abduction_m_gluteus_medius_stab",
    "exerciseId": "ex_cable_hip_abduction",
    "muscleId": "m_gluteus_medius",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Support leg stability"
  },
  {
    "id": "emc_ex_seated_machine_hip_abduction_m_gluteus_medius_pri",
    "exerciseId": "ex_seated_machine_hip_abduction",
    "muscleId": "m_gluteus_medius",
    "percentage": 70,
    "role": "Primary",
    "notes": "Pure seated hip abduction"
  },
  {
    "id": "emc_ex_seated_machine_hip_abduction_m_gluteus_maximus_pri",
    "exerciseId": "ex_seated_machine_hip_abduction",
    "muscleId": "m_gluteus_maximus",
    "percentage": 20,
    "role": "Primary",
    "notes": "Upper glute max abduction"
  },
  {
    "id": "emc_ex_seated_machine_hip_abduction_m_gluteus_minimus_sec",
    "exerciseId": "ex_seated_machine_hip_abduction",
    "muscleId": "m_gluteus_minimus",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Minimus"
  },
  {
    "id": "emc_ex_standing_cable_kickback_angled_m_gluteus_maximus_pri",
    "exerciseId": "ex_standing_cable_kickback_angled",
    "muscleId": "m_gluteus_maximus",
    "percentage": 70,
    "role": "Primary",
    "notes": "Extension"
  },
  {
    "id": "emc_ex_standing_cable_kickback_angled_m_gluteus_medius_pri",
    "exerciseId": "ex_standing_cable_kickback_angled",
    "muscleId": "m_gluteus_medius",
    "percentage": 30,
    "role": "Primary",
    "notes": "Abduction synergy"
  },
  {
    "id": "emc_ex_standing_cable_kickback_angled_m_core_stab",
    "exerciseId": "ex_standing_cable_kickback_angled",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Core brace"
  },
  {
    "id": "emc_ex_dumbbell_sumo_squat_glutes_m_gluteus_maximus_pri",
    "exerciseId": "ex_dumbbell_sumo_squat_glutes",
    "muscleId": "m_gluteus_maximus",
    "percentage": 60,
    "role": "Primary",
    "notes": "Glute extension from wide base"
  },
  {
    "id": "emc_ex_dumbbell_sumo_squat_glutes_m_adductor_magnus_pri",
    "exerciseId": "ex_dumbbell_sumo_squat_glutes",
    "muscleId": "m_adductor_magnus",
    "percentage": 25,
    "role": "Primary",
    "notes": "Adductor synergy"
  },
  {
    "id": "emc_ex_dumbbell_sumo_squat_glutes_m_quadriceps_sec",
    "exerciseId": "ex_dumbbell_sumo_squat_glutes",
    "muscleId": "m_quadriceps",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Quads"
  },
  {
    "id": "emc_ex_dumbbell_sumo_squat_glutes_m_core_stab",
    "exerciseId": "ex_dumbbell_sumo_squat_glutes",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Core posture"
  },
  {
    "id": "emc_ex_hanging_leg_raise_m_rectus_abdominis_pri",
    "exerciseId": "ex_hanging_leg_raise",
    "muscleId": "m_rectus_abdominis",
    "percentage": 70,
    "role": "Primary",
    "notes": "Lower abdominal pelvic flexion"
  },
  {
    "id": "emc_ex_hanging_leg_raise_m_transverse_abdominis_pri",
    "exerciseId": "ex_hanging_leg_raise",
    "muscleId": "m_transverse_abdominis",
    "percentage": 20,
    "role": "Primary",
    "notes": "Deep intra-abdominal brace"
  },
  {
    "id": "emc_ex_hanging_leg_raise_m_obliques_sec",
    "exerciseId": "ex_hanging_leg_raise",
    "muscleId": "m_obliques",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Lateral stability"
  },
  {
    "id": "emc_ex_hanging_leg_raise_m_latissimus_dorsi_stab",
    "exerciseId": "ex_hanging_leg_raise",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Shoulder depression hang"
  },
  {
    "id": "emc_ex_hanging_leg_raise_m_forearms_stab",
    "exerciseId": "ex_hanging_leg_raise",
    "muscleId": "m_forearms",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Grip"
  },
  {
    "id": "emc_ex_captains_chair_knee_raise_m_rectus_abdominis_pri",
    "exerciseId": "ex_captains_chair_knee_raise",
    "muscleId": "m_rectus_abdominis",
    "percentage": 75,
    "role": "Primary",
    "notes": "Pelvic flexion on pad"
  },
  {
    "id": "emc_ex_captains_chair_knee_raise_m_transverse_abdominis_pri",
    "exerciseId": "ex_captains_chair_knee_raise",
    "muscleId": "m_transverse_abdominis",
    "percentage": 15,
    "role": "Primary",
    "notes": "Core compression"
  },
  {
    "id": "emc_ex_captains_chair_knee_raise_m_obliques_sec",
    "exerciseId": "ex_captains_chair_knee_raise",
    "muscleId": "m_obliques",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Obliques"
  },
  {
    "id": "emc_ex_captains_chair_knee_raise_m_serratus_anterior_stab",
    "exerciseId": "ex_captains_chair_knee_raise",
    "muscleId": "m_serratus_anterior",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Scapular support"
  },
  {
    "id": "emc_ex_ab_wheel_rollout_m_rectus_abdominis_pri",
    "exerciseId": "ex_ab_wheel_rollout",
    "muscleId": "m_rectus_abdominis",
    "percentage": 60,
    "role": "Primary",
    "notes": "Anti-extension eccentric resistance"
  },
  {
    "id": "emc_ex_ab_wheel_rollout_m_transverse_abdominis_pri",
    "exerciseId": "ex_ab_wheel_rollout",
    "muscleId": "m_transverse_abdominis",
    "percentage": 30,
    "role": "Primary",
    "notes": "Deep spinal bracing"
  },
  {
    "id": "emc_ex_ab_wheel_rollout_m_latissimus_dorsi_sec",
    "exerciseId": "ex_ab_wheel_rollout",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Shoulder extension pullover pull"
  },
  {
    "id": "emc_ex_ab_wheel_rollout_m_serratus_anterior_stab",
    "exerciseId": "ex_ab_wheel_rollout",
    "muscleId": "m_serratus_anterior",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Scapular stability"
  },
  {
    "id": "emc_ex_ab_wheel_rollout_m_gluteus_maximus_stab",
    "exerciseId": "ex_ab_wheel_rollout",
    "muscleId": "m_gluteus_maximus",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Pelvic posterior tilt"
  },
  {
    "id": "emc_ex_cable_woodchopper_m_obliques_pri",
    "exerciseId": "ex_cable_woodchopper",
    "muscleId": "m_obliques",
    "percentage": 75,
    "role": "Primary",
    "notes": "Internal and external oblique rotation"
  },
  {
    "id": "emc_ex_cable_woodchopper_m_transverse_abdominis_pri",
    "exerciseId": "ex_cable_woodchopper",
    "muscleId": "m_transverse_abdominis",
    "percentage": 15,
    "role": "Primary",
    "notes": "Rotational core stabilization"
  },
  {
    "id": "emc_ex_cable_woodchopper_m_rectus_abdominis_sec",
    "exerciseId": "ex_cable_woodchopper",
    "muscleId": "m_rectus_abdominis",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Trunk flexion synergy"
  },
  {
    "id": "emc_ex_cable_woodchopper_m_deltoid_anterior_stab",
    "exerciseId": "ex_cable_woodchopper",
    "muscleId": "m_deltoid_anterior",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Arm guide"
  },
  {
    "id": "emc_ex_cable_crunch_m_rectus_abdominis_pri",
    "exerciseId": "ex_cable_crunch",
    "muscleId": "m_rectus_abdominis",
    "percentage": 85,
    "role": "Primary",
    "notes": "Pure spinal flexion against resistance"
  },
  {
    "id": "emc_ex_cable_crunch_m_obliques_sec",
    "exerciseId": "ex_cable_crunch",
    "muscleId": "m_obliques",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Lateral ab assistance"
  },
  {
    "id": "emc_ex_cable_crunch_m_serratus_anterior_stab",
    "exerciseId": "ex_cable_crunch",
    "muscleId": "m_serratus_anterior",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Arm anchor"
  },
  {
    "id": "emc_ex_decline_sit_up_m_rectus_abdominis_pri",
    "exerciseId": "ex_decline_sit_up",
    "muscleId": "m_rectus_abdominis",
    "percentage": 80,
    "role": "Primary",
    "notes": "Full range spinal flexion"
  },
  {
    "id": "emc_ex_decline_sit_up_m_obliques_sec",
    "exerciseId": "ex_decline_sit_up",
    "muscleId": "m_obliques",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Oblique support"
  },
  {
    "id": "emc_ex_decline_sit_up_m_transverse_abdominis_sec",
    "exerciseId": "ex_decline_sit_up",
    "muscleId": "m_transverse_abdominis",
    "percentage": 5,
    "role": "Secondary",
    "notes": "Core"
  },
  {
    "id": "emc_ex_elbow_plank_m_transverse_abdominis_pri",
    "exerciseId": "ex_elbow_plank",
    "muscleId": "m_transverse_abdominis",
    "percentage": 50,
    "role": "Primary",
    "notes": "Isometric intra-abdominal brace"
  },
  {
    "id": "emc_ex_elbow_plank_m_rectus_abdominis_pri",
    "exerciseId": "ex_elbow_plank",
    "muscleId": "m_rectus_abdominis",
    "percentage": 40,
    "role": "Primary",
    "notes": "Anti-extension resistance"
  },
  {
    "id": "emc_ex_elbow_plank_m_obliques_sec",
    "exerciseId": "ex_elbow_plank",
    "muscleId": "m_obliques",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Lateral stability"
  },
  {
    "id": "emc_ex_elbow_plank_m_serratus_anterior_stab",
    "exerciseId": "ex_elbow_plank",
    "muscleId": "m_serratus_anterior",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Scapular protraction on elbows"
  },
  {
    "id": "emc_ex_elbow_plank_m_gluteus_maximus_stab",
    "exerciseId": "ex_elbow_plank",
    "muscleId": "m_gluteus_maximus",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Pelvic alignment"
  },
  {
    "id": "emc_ex_side_plank_m_obliques_pri",
    "exerciseId": "ex_side_plank",
    "muscleId": "m_obliques",
    "percentage": 75,
    "role": "Primary",
    "notes": "Anti-lateral flexion hold"
  },
  {
    "id": "emc_ex_side_plank_m_transverse_abdominis_pri",
    "exerciseId": "ex_side_plank",
    "muscleId": "m_transverse_abdominis",
    "percentage": 15,
    "role": "Primary",
    "notes": "Core compression"
  },
  {
    "id": "emc_ex_side_plank_m_gluteus_medius_sec",
    "exerciseId": "ex_side_plank",
    "muscleId": "m_gluteus_medius",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Lateral hip stabilization"
  },
  {
    "id": "emc_ex_side_plank_m_rotator_cuff_stab",
    "exerciseId": "ex_side_plank",
    "muscleId": "m_rotator_cuff",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Shoulder support"
  },
  {
    "id": "emc_ex_russian_twists_m_obliques_pri",
    "exerciseId": "ex_russian_twists",
    "muscleId": "m_obliques",
    "percentage": 70,
    "role": "Primary",
    "notes": "Dynamic trunk rotation"
  },
  {
    "id": "emc_ex_russian_twists_m_rectus_abdominis_pri",
    "exerciseId": "ex_russian_twists",
    "muscleId": "m_rectus_abdominis",
    "percentage": 20,
    "role": "Primary",
    "notes": "V-sit isometric hold"
  },
  {
    "id": "emc_ex_russian_twists_m_transverse_abdominis_sec",
    "exerciseId": "ex_russian_twists",
    "muscleId": "m_transverse_abdominis",
    "percentage": 10,
    "role": "Secondary",
    "notes": "TVA brace"
  },
  {
    "id": "emc_ex_dragon_flag_m_rectus_abdominis_pri",
    "exerciseId": "ex_dragon_flag",
    "muscleId": "m_rectus_abdominis",
    "percentage": 70,
    "role": "Primary",
    "notes": "Extreme eccentric bodyweight leverage"
  },
  {
    "id": "emc_ex_dragon_flag_m_transverse_abdominis_pri",
    "exerciseId": "ex_dragon_flag",
    "muscleId": "m_transverse_abdominis",
    "percentage": 20,
    "role": "Primary",
    "notes": "Total body tension"
  },
  {
    "id": "emc_ex_dragon_flag_m_latissimus_dorsi_sec",
    "exerciseId": "ex_dragon_flag",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Bench grip pulling lever"
  },
  {
    "id": "emc_ex_dragon_flag_m_gluteus_maximus_stab",
    "exerciseId": "ex_dragon_flag",
    "muscleId": "m_gluteus_maximus",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Posterior hip lock"
  },
  {
    "id": "emc_ex_dragon_flag_m_erector_spinae_stab",
    "exerciseId": "ex_dragon_flag",
    "muscleId": "m_erector_spinae",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Spine support"
  },
  {
    "id": "emc_ex_toes_to_bar_m_rectus_abdominis_pri",
    "exerciseId": "ex_toes_to_bar",
    "muscleId": "m_rectus_abdominis",
    "percentage": 70,
    "role": "Primary",
    "notes": "Complete abdominal curl"
  },
  {
    "id": "emc_ex_toes_to_bar_m_transverse_abdominis_pri",
    "exerciseId": "ex_toes_to_bar",
    "muscleId": "m_transverse_abdominis",
    "percentage": 15,
    "role": "Primary",
    "notes": "Compression"
  },
  {
    "id": "emc_ex_toes_to_bar_m_latissimus_dorsi_sec",
    "exerciseId": "ex_toes_to_bar",
    "muscleId": "m_latissimus_dorsi",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Active shoulder extension"
  },
  {
    "id": "emc_ex_toes_to_bar_m_forearms_stab",
    "exerciseId": "ex_toes_to_bar",
    "muscleId": "m_forearms",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Grip"
  },
  {
    "id": "emc_ex_pallof_press_m_transverse_abdominis_pri",
    "exerciseId": "ex_pallof_press",
    "muscleId": "m_transverse_abdominis",
    "percentage": 50,
    "role": "Primary",
    "notes": "Isometric anti-rotation brace"
  },
  {
    "id": "emc_ex_pallof_press_m_obliques_pri",
    "exerciseId": "ex_pallof_press",
    "muscleId": "m_obliques",
    "percentage": 40,
    "role": "Primary",
    "notes": "Rotational resistance"
  },
  {
    "id": "emc_ex_pallof_press_m_rectus_abdominis_sec",
    "exerciseId": "ex_pallof_press",
    "muscleId": "m_rectus_abdominis",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Anterior core support"
  },
  {
    "id": "emc_ex_pallof_press_m_gluteus_medius_stab",
    "exerciseId": "ex_pallof_press",
    "muscleId": "m_gluteus_medius",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Standing hip anchor"
  },
  {
    "id": "emc_ex_mountain_climbers_m_rectus_abdominis_pri",
    "exerciseId": "ex_mountain_climbers",
    "muscleId": "m_rectus_abdominis",
    "percentage": 60,
    "role": "Primary",
    "notes": "Dynamic knee drive core brace"
  },
  {
    "id": "emc_ex_mountain_climbers_m_transverse_abdominis_pri",
    "exerciseId": "ex_mountain_climbers",
    "muscleId": "m_transverse_abdominis",
    "percentage": 25,
    "role": "Primary",
    "notes": "Plank stability"
  },
  {
    "id": "emc_ex_mountain_climbers_m_obliques_sec",
    "exerciseId": "ex_mountain_climbers",
    "muscleId": "m_obliques",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Alternating hip rotation"
  },
  {
    "id": "emc_ex_mountain_climbers_m_serratus_anterior_stab",
    "exerciseId": "ex_mountain_climbers",
    "muscleId": "m_serratus_anterior",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Scapular stability"
  },
  {
    "id": "emc_ex_dead_bug_m_transverse_abdominis_pri",
    "exerciseId": "ex_dead_bug",
    "muscleId": "m_transverse_abdominis",
    "percentage": 60,
    "role": "Primary",
    "notes": "Anti-extension deep pelvic control"
  },
  {
    "id": "emc_ex_dead_bug_m_rectus_abdominis_pri",
    "exerciseId": "ex_dead_bug",
    "muscleId": "m_rectus_abdominis",
    "percentage": 30,
    "role": "Primary",
    "notes": "Spinal flat compression"
  },
  {
    "id": "emc_ex_dead_bug_m_obliques_sec",
    "exerciseId": "ex_dead_bug",
    "muscleId": "m_obliques",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Contralateral diagonal stability"
  },
  {
    "id": "emc_ex_bird_dog_m_erector_spinae_pri",
    "exerciseId": "ex_bird_dog",
    "muscleId": "m_erector_spinae",
    "percentage": 45,
    "role": "Primary",
    "notes": "Multifidus & erector spinal stability"
  },
  {
    "id": "emc_ex_bird_dog_m_transverse_abdominis_pri",
    "exerciseId": "ex_bird_dog",
    "muscleId": "m_transverse_abdominis",
    "percentage": 35,
    "role": "Primary",
    "notes": "Core pelvic stabilization"
  },
  {
    "id": "emc_ex_bird_dog_m_gluteus_maximus_sec",
    "exerciseId": "ex_bird_dog",
    "muscleId": "m_gluteus_maximus",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Hip extension reach"
  },
  {
    "id": "emc_ex_bird_dog_m_deltoid_posterior_stab",
    "exerciseId": "ex_bird_dog",
    "muscleId": "m_deltoid_posterior",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Shoulder balance"
  },
  {
    "id": "emc_ex_seated_machine_hip_adduction_m_adductor_magnus_pri",
    "exerciseId": "ex_seated_machine_hip_adduction",
    "muscleId": "m_adductor_magnus",
    "percentage": 60,
    "role": "Primary",
    "notes": "Adductor magnus power"
  },
  {
    "id": "emc_ex_seated_machine_hip_adduction_m_adductor_longus_pri",
    "exerciseId": "ex_seated_machine_hip_adduction",
    "muscleId": "m_adductor_longus",
    "percentage": 30,
    "role": "Primary",
    "notes": "Adductor longus & brevis"
  },
  {
    "id": "emc_ex_seated_machine_hip_adduction_m_gracilis_sec",
    "exerciseId": "ex_seated_machine_hip_adduction",
    "muscleId": "m_gracilis",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Medial knee adduction assist"
  },
  {
    "id": "emc_ex_seated_machine_hip_adduction_m_core_stab",
    "exerciseId": "ex_seated_machine_hip_adduction",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Seated posture"
  },
  {
    "id": "emc_ex_standing_cable_hip_adduction_m_adductor_longus_pri",
    "exerciseId": "ex_standing_cable_hip_adduction",
    "muscleId": "m_adductor_longus",
    "percentage": 60,
    "role": "Primary",
    "notes": "Adductor longus active pull"
  },
  {
    "id": "emc_ex_standing_cable_hip_adduction_m_adductor_magnus_pri",
    "exerciseId": "ex_standing_cable_hip_adduction",
    "muscleId": "m_adductor_magnus",
    "percentage": 30,
    "role": "Primary",
    "notes": "Adductor magnus"
  },
  {
    "id": "emc_ex_standing_cable_hip_adduction_m_gracilis_sec",
    "exerciseId": "ex_standing_cable_hip_adduction",
    "muscleId": "m_gracilis",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Gracilis"
  },
  {
    "id": "emc_ex_standing_cable_hip_adduction_m_gluteus_medius_stab",
    "exerciseId": "ex_standing_cable_hip_adduction",
    "muscleId": "m_gluteus_medius",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Standing leg stability"
  },
  {
    "id": "emc_ex_copenhagen_plank_m_adductor_magnus_pri",
    "exerciseId": "ex_copenhagen_plank",
    "muscleId": "m_adductor_magnus",
    "percentage": 55,
    "role": "Primary",
    "notes": "High isometric adductor shear resistance"
  },
  {
    "id": "emc_ex_copenhagen_plank_m_gracilis_pri",
    "exerciseId": "ex_copenhagen_plank",
    "muscleId": "m_gracilis",
    "percentage": 25,
    "role": "Primary",
    "notes": "Medial knee stabilization"
  },
  {
    "id": "emc_ex_copenhagen_plank_m_obliques_sec",
    "exerciseId": "ex_copenhagen_plank",
    "muscleId": "m_obliques",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Side plank lateral core"
  },
  {
    "id": "emc_ex_copenhagen_plank_m_gluteus_medius_stab",
    "exerciseId": "ex_copenhagen_plank",
    "muscleId": "m_gluteus_medius",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Pelvic alignment"
  },
  {
    "id": "emc_ex_sumo_deadlift_adductor_bias_m_adductor_magnus_pri",
    "exerciseId": "ex_sumo_deadlift_adductor_bias",
    "muscleId": "m_adductor_magnus",
    "percentage": 50,
    "role": "Primary",
    "notes": "Heavy adductor magnus hip extension"
  },
  {
    "id": "emc_ex_sumo_deadlift_adductor_bias_m_gluteus_maximus_pri",
    "exerciseId": "ex_sumo_deadlift_adductor_bias",
    "muscleId": "m_gluteus_maximus",
    "percentage": 30,
    "role": "Primary",
    "notes": "Glute extension"
  },
  {
    "id": "emc_ex_sumo_deadlift_adductor_bias_m_quadriceps_sec",
    "exerciseId": "ex_sumo_deadlift_adductor_bias",
    "muscleId": "m_quadriceps",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Knee extension"
  },
  {
    "id": "emc_ex_sumo_deadlift_adductor_bias_m_erector_spinae_stab",
    "exerciseId": "ex_sumo_deadlift_adductor_bias",
    "muscleId": "m_erector_spinae",
    "percentage": 25,
    "role": "Stabilizer",
    "notes": "Spine support"
  },
  {
    "id": "emc_ex_sumo_deadlift_adductor_bias_m_forearms_stab",
    "exerciseId": "ex_sumo_deadlift_adductor_bias",
    "muscleId": "m_forearms",
    "percentage": 20,
    "role": "Stabilizer",
    "notes": "Grip"
  },
  {
    "id": "emc_ex_wide_stance_leg_press_m_adductor_magnus_pri",
    "exerciseId": "ex_wide_stance_leg_press",
    "muscleId": "m_adductor_magnus",
    "percentage": 50,
    "role": "Primary",
    "notes": "Adductor magnus extension assist"
  },
  {
    "id": "emc_ex_wide_stance_leg_press_m_quadriceps_pri",
    "exerciseId": "ex_wide_stance_leg_press",
    "muscleId": "m_quadriceps",
    "percentage": 30,
    "role": "Primary",
    "notes": "Knee extension"
  },
  {
    "id": "emc_ex_wide_stance_leg_press_m_gluteus_maximus_sec",
    "exerciseId": "ex_wide_stance_leg_press",
    "muscleId": "m_gluteus_maximus",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Glute max"
  },
  {
    "id": "emc_ex_cossack_squat_m_adductor_magnus_pri",
    "exerciseId": "ex_cossack_squat",
    "muscleId": "m_adductor_magnus",
    "percentage": 50,
    "role": "Primary",
    "notes": "Eccentric stretch & concentric adductor drive"
  },
  {
    "id": "emc_ex_cossack_squat_m_quadriceps_pri",
    "exerciseId": "ex_cossack_squat",
    "muscleId": "m_quadriceps",
    "percentage": 35,
    "role": "Primary",
    "notes": "Working quad knee extension"
  },
  {
    "id": "emc_ex_cossack_squat_m_gluteus_maximus_sec",
    "exerciseId": "ex_cossack_squat",
    "muscleId": "m_gluteus_maximus",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Glute extension"
  },
  {
    "id": "emc_ex_cossack_squat_m_core_stab",
    "exerciseId": "ex_cossack_squat",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Upright balance"
  },
  {
    "id": "emc_ex_lateral_lunge_dumbbell_m_adductor_magnus_pri",
    "exerciseId": "ex_lateral_lunge_dumbbell",
    "muscleId": "m_adductor_magnus",
    "percentage": 50,
    "role": "Primary",
    "notes": "Adductors"
  },
  {
    "id": "emc_ex_lateral_lunge_dumbbell_m_quadriceps_pri",
    "exerciseId": "ex_lateral_lunge_dumbbell",
    "muscleId": "m_quadriceps",
    "percentage": 35,
    "role": "Primary",
    "notes": "Quads"
  },
  {
    "id": "emc_ex_lateral_lunge_dumbbell_m_gluteus_maximus_sec",
    "exerciseId": "ex_lateral_lunge_dumbbell",
    "muscleId": "m_gluteus_maximus",
    "percentage": 15,
    "role": "Secondary",
    "notes": "Glutes"
  },
  {
    "id": "emc_ex_lateral_lunge_dumbbell_m_gluteus_medius_stab",
    "exerciseId": "ex_lateral_lunge_dumbbell",
    "muscleId": "m_gluteus_medius",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Lateral hip control"
  },
  {
    "id": "emc_ex_cable_adductor_kick_in_m_adductor_longus_pri",
    "exerciseId": "ex_cable_adductor_kick_in",
    "muscleId": "m_adductor_longus",
    "percentage": 65,
    "role": "Primary",
    "notes": "Adductor longus"
  },
  {
    "id": "emc_ex_cable_adductor_kick_in_m_adductor_magnus_pri",
    "exerciseId": "ex_cable_adductor_kick_in",
    "muscleId": "m_adductor_magnus",
    "percentage": 25,
    "role": "Primary",
    "notes": "Adductor magnus"
  },
  {
    "id": "emc_ex_cable_adductor_kick_in_m_gracilis_sec",
    "exerciseId": "ex_cable_adductor_kick_in",
    "muscleId": "m_gracilis",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Gracilis"
  },
  {
    "id": "emc_ex_cable_adductor_kick_in_m_gluteus_medius_stab",
    "exerciseId": "ex_cable_adductor_kick_in",
    "muscleId": "m_gluteus_medius",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Support hip"
  },
  {
    "id": "emc_ex_adductor_squeeze_ball_m_adductor_longus_pri",
    "exerciseId": "ex_adductor_squeeze_ball",
    "muscleId": "m_adductor_longus",
    "percentage": 60,
    "role": "Primary",
    "notes": "Peak isometric adductor squeeze"
  },
  {
    "id": "emc_ex_adductor_squeeze_ball_m_adductor_magnus_pri",
    "exerciseId": "ex_adductor_squeeze_ball",
    "muscleId": "m_adductor_magnus",
    "percentage": 30,
    "role": "Primary",
    "notes": "Adductor magnus"
  },
  {
    "id": "emc_ex_adductor_squeeze_ball_m_gracilis_sec",
    "exerciseId": "ex_adductor_squeeze_ball",
    "muscleId": "m_gracilis",
    "percentage": 10,
    "role": "Secondary",
    "notes": "Gracilis"
  },
  {
    "id": "emc_ex_adductor_squeeze_ball_m_core_stab",
    "exerciseId": "ex_adductor_squeeze_ball",
    "muscleId": "m_core",
    "percentage": 10,
    "role": "Stabilizer",
    "notes": "Pelvic floor & core"
  },
  {
    "id": "emc_ex_dumbbell_goblet_sumo_squat_m_adductor_magnus_pri",
    "exerciseId": "ex_dumbbell_goblet_sumo_squat",
    "muscleId": "m_adductor_magnus",
    "percentage": 50,
    "role": "Primary",
    "notes": "Adductor magnus loaded stretch"
  },
  {
    "id": "emc_ex_dumbbell_goblet_sumo_squat_m_quadriceps_pri",
    "exerciseId": "ex_dumbbell_goblet_sumo_squat",
    "muscleId": "m_quadriceps",
    "percentage": 30,
    "role": "Primary",
    "notes": "Quads"
  },
  {
    "id": "emc_ex_dumbbell_goblet_sumo_squat_m_gluteus_maximus_sec",
    "exerciseId": "ex_dumbbell_goblet_sumo_squat",
    "muscleId": "m_gluteus_maximus",
    "percentage": 20,
    "role": "Secondary",
    "notes": "Glutes"
  },
  {
    "id": "emc_ex_dumbbell_goblet_sumo_squat_m_core_stab",
    "exerciseId": "ex_dumbbell_goblet_sumo_squat",
    "muscleId": "m_core",
    "percentage": 15,
    "role": "Stabilizer",
    "notes": "Torso posture"
  }
];

// Fast lookup maps
export const MUSCLE_MAP = new Map<string, Muscle>(MUSCLES.map(m => [m.id, m]));
export const REGION_MAP = new Map<string, MuscleRegion>(MUSCLE_REGIONS.map(r => [r.id, r]));
export const EXERCISE_MAP = new Map<string, Exercise>(EXERCISES.map(e => [e.id, e]));

// Group contributions by exercise
export const CONTRIBUTIONS_BY_EXERCISE = new Map<string, ExerciseMuscleContribution[]>();
EXERCISE_MUSCLE_CONTRIBUTIONS.forEach(c => {
  const list = CONTRIBUTIONS_BY_EXERCISE.get(c.exerciseId) || [];
  list.push(c);
  CONTRIBUTIONS_BY_EXERCISE.set(c.exerciseId, list);
});

// Group contributions by muscle (for reverse search)
export const CONTRIBUTIONS_BY_MUSCLE = new Map<string, ExerciseMuscleContribution[]>();
EXERCISE_MUSCLE_CONTRIBUTIONS.forEach(c => {
  const list = CONTRIBUTIONS_BY_MUSCLE.get(c.muscleId) || [];
  list.push(c);
  CONTRIBUTIONS_BY_MUSCLE.set(c.muscleId, list);
});

/**
 * Filter exercises by region according to Step 3 Rule:
 * Direct regionId/targetRegion match OR role === 'Primary' contribution in that region.
 * NEVER match on Secondary or Stabilizer contributions to prevent compound bleed.
 */
export function filterExercisesByRegion(regionId: string): Exercise[] {
  if (!regionId || regionId === 'all') return EXERCISES;
  return EXERCISES.filter(ex => {
    if (ex.targetRegionId === regionId) return true;
    const contribs = CONTRIBUTIONS_BY_EXERCISE.get(ex.id) || [];
    return contribs.some(c => {
      if (c.role !== 'Primary') return false;
      const m = MUSCLE_MAP.get(c.muscleId);
      return m && m.regionId === regionId;
    });
  });
}

/**
 * Reverse muscle search: select a muscle, return exercises that train it,
 * ranked by contribution percentage weight (descending).
 */
export function reverseSearchByMuscle(muscleId: string): Array<{ exercise: Exercise; contribution: ExerciseMuscleContribution }> {
  const contribs = CONTRIBUTIONS_BY_MUSCLE.get(muscleId) || [];
  return contribs
    .map(c => ({
      exercise: EXERCISE_MAP.get(c.exerciseId)!,
      contribution: c,
    }))
    .filter(item => Boolean(item.exercise))
    .sort((a, b) => {
      // Primary role first, then higher percentage
      const roleWeight = { Primary: 3, Secondary: 2, Stabilizer: 1 };
      const diff = (roleWeight[b.contribution.role] || 0) - (roleWeight[a.contribution.role] || 0);
      if (diff !== 0) return diff;
      return b.contribution.percentage - a.contribution.percentage;
    });
}
