import { ChapterDefinition } from '../types/game.types';

export const CAMPAIGN_CHAPTERS: ChapterDefinition[] = [
  {
    id: 'chapter_1_eden',
    order: 1,
    testament: 'OLD_TESTAMENT',
    bookName: 'Génesis',
    title: 'Capítulo I: El Aliento en el Jardín',
    eraDescription: 'Los Orígenes — El Jardín de Edén al oriente (Génesis 2–3)',
    unlockedByDefault: true,
    isPlayableInBuild: true,
    spawnPosition: { x: 0, y: 0, z: 22 },
    missions: [
      {
        id: 'mission_eden_1',
        chapterId: 'chapter_1_eden',
        title: 'La Sombra de la Elección',
        subtitle: 'Sé testigo de la armonía primordial, el mandato divino y la tentación junto al Árbol.',
        biblicalBook: 'Génesis 2:8 - 3:24',
        introCinematicText: [
          '«Y Jehová Dios plantó un huerto en Edén, al oriente; y puso allí al hombre que había formado.» (Génesis 2:8)',
          'Como EL TESTIGO, caminas entre la creación intacta antes de la fractura. Observa, escucha y guarda testimonio de la Promesa que nacerá aun en medio de la caída.'
        ],
        scriptureRef: {
          book: 'Génesis',
          chapter: 2,
          verses: '15-17',
          summaryText: 'Jehová Dios puso al hombre en el huerto de Edén para que lo labrara y lo guardase, con el mandato de no comer del árbol de la ciencia del bien y del mal.',
          adaptationType: 'CANONICAL',
          adaptationNote: 'El mandato central y los eventos en torno al árbol siguen fielmente Génesis 2–3. La presencia del jugador como "El Testigo" es el recurso narrativo interactivo.'
        },
        rewardCodexTitle: 'Códice de Génesis 3:15 — El Protoevangelio (La Primera Promesa)',
        objectives: [
          {
            id: 'obj_1_rivers',
            title: 'Explora el Manantial de los Cuatro Ríos',
            description: 'Camina hacia el altar de piedra junto a la confluencia de los ríos del Edén para orientarte en el santuario terrenal.',
            type: 'INSPECT_OBJECT',
            targetId: 'obj_river_altar',
            targetPosition: { x: 0, y: 0, z: 8 },
            radius: 4.5,
            completed: false,
            scriptureRef: {
              book: 'Génesis',
              chapter: 2,
              verses: '10-14',
              summaryText: 'Y salía de Edén un río para regar el huerto, y de allí se repartía en cuatro brazos: Pisón, Gihón, Hidekel y Éufrates.',
              adaptationType: 'CANONICAL',
              adaptationNote: 'Geografía bíblica descrita en Génesis 2:10-14.'
            }
          },
          {
            id: 'obj_2_talk_adam',
            title: 'Dialoga con Adán junto al Árbol de la Vida',
            description: 'Acércate a Adán en el claro central y conversa sobre la mayordomía del huerto y el mandato recibido.',
            type: 'TALK_TO_NPC',
            targetId: 'npc_adam',
            targetPosition: { x: -8, y: 0, z: -2 },
            radius: 4,
            completed: false,
            scriptureRef: {
              book: 'Génesis',
              chapter: 2,
              verses: '15-20',
              summaryText: 'Adán recibe el encargo de guardar el huerto y da nombre a todo ser viviente.',
              adaptationType: 'CANONICAL',
              adaptationNote: 'Diálogo adaptado a partir de la comisión dada a Adán en Génesis 2.'
            }
          },
          {
            id: 'obj_3_talk_eve',
            title: 'Busca a Eva cerca de la arboleda occidental',
            description: 'Encuentra a Eva, quien observa con inquietud hacia el límite donde se alza el Árbol del Conocimiento.',
            type: 'TALK_TO_NPC',
            targetId: 'npc_eve',
            targetPosition: { x: 10, y: 0, z: -10 },
            radius: 4,
            completed: false,
            scriptureRef: {
              book: 'Génesis',
              chapter: 3,
              verses: '1-3',
              summaryText: 'La serpiente interroga a la mujer sobre la palabra de Dios respecto a los árboles del huerto.',
              adaptationType: 'CANONICAL',
              adaptationNote: 'Refleja la antesala del diálogo registrado en Génesis 3:1-5.'
            }
          },
          {
            id: 'obj_4_inspect_forbidden_tree',
            title: 'Examina el Árbol de la Ciencia del Bien y del Mal',
            description: 'Dirígete hacia la colina norte y presencia la tensión espiritual junto al fruto prohibido y la serpiente.',
            type: 'INSPECT_OBJECT',
            targetId: 'obj_tree_knowledge',
            targetPosition: { x: 0, y: 0, z: -24 },
            radius: 5.5,
            completed: false,
            scriptureRef: {
              book: 'Génesis',
              chapter: 3,
              verses: '6-7',
              summaryText: 'Y vio la mujer que el árbol era bueno para comer, y que era agradable a los ojos, y árbol codiciable para alcanzar la sabiduría; y tomó de su fruto, y comió; y dio también a su marido.',
              adaptationType: 'CANONICAL',
              adaptationNote: 'El acontecimiento bíblico permanece inalterable; el jugador presencia las consecuencias y recibe el testimonio de la Promesa.'
            }
          },
          {
            id: 'obj_5_cherub_promise',
            title: 'Recibe el Testimonio de la Promesa en el Umbral Oriental',
            description: 'Habla con el Querubín Guardián en el límite oriental sobre el juicio y la promesa de redención futura (Génesis 3:15).',
            type: 'TALK_TO_NPC',
            targetId: 'npc_cherub_guardian',
            targetPosition: { x: -14, y: 0, z: -18 },
            radius: 4.5,
            completed: false,
            scriptureRef: {
              book: 'Génesis',
              chapter: 3,
              verses: '15, 24',
              summaryText: '«Y pondré enemistad entre ti y la mujer, y entre tu simiente y la simiente suya; ésta te herirá en la cabeza, y tú le herirás en el calcañar.»',
              adaptationType: 'DRAMATIC_ADAPTATION',
              adaptationNote: 'Los querubines en Génesis 3:24 custodian el camino al Árbol de la Vida. El diálogo sintetiza teológicamente la promesa mesiánica de Génesis 3:15.'
            }
          }
        ]
      }
    ],
    npcs: [
      {
        id: 'npc_adam',
        name: 'Adán',
        role: 'Primer Hombre — Guardián del Huerto',
        position: { x: -8, y: 0, z: -2 },
        rotationY: 0.6,
        appearance: {
          skinTone: '#c68652',
          tunicColor: '#5c4028',
          mantleColor: '#8c6d46',
          hairColor: '#241811',
          hasBeard: true,
          scale: 1.04
        },
        initialDialogueId: 'dlg_adam_1'
      },
      {
        id: 'npc_eve',
        name: 'Eva',
        role: 'Madre de todos los vivientes',
        position: { x: 10, y: 0, z: -10 },
        rotationY: -0.7,
        appearance: {
          skinTone: '#d19461',
          tunicColor: '#7a5230',
          mantleColor: '#b58d5c',
          hairColor: '#2e1d12',
          hasBeard: false,
          scale: 0.98
        },
        initialDialogueId: 'dlg_eve_1'
      },
      {
        id: 'npc_cherub_guardian',
        name: 'Centinela del Oriente',
        role: 'Querubín Custodio del Camino (Génesis 3:24)',
        position: { x: -14, y: 0, z: -18 },
        rotationY: 0.4,
        appearance: {
          skinTone: '#e8d5b7',
          tunicColor: '#f5ebd6',
          mantleColor: '#d4af37',
          hairColor: '#f3e5ab',
          hasBeard: false,
          isCelestial: true,
          scale: 1.15
        },
        initialDialogueId: 'dlg_cherub_1'
      }
    ],
    interactiveObjects: [
      {
        id: 'obj_river_altar',
        name: 'Hito de los Cuatro Ríos',
        subtitle: 'Pisón, Gihón, Hidekel y Éufrates',
        position: { x: 0, y: 0, z: 8 },
        interactionRadius: 4,
        type: 'RIVER_ALTAR',
        dialogueNodeId: 'dlg_object_rivers',
        scriptureRef: {
          book: 'Génesis',
          chapter: 2,
          verses: '10-14',
          summaryText: 'El agua viva fluye desde el centro de Edén para sustentar toda la faz de la tierra.',
          adaptationType: 'HISTORICAL_CONTEXT',
          adaptationNote: 'Hito de exploración geográfica basado en los cuatro ríos mencionados en el texto hebreo.'
        }
      },
      {
        id: 'obj_tree_life',
        name: 'El Árbol de la Vida',
        subtitle: 'En medio del Huerto (Génesis 2:9)',
        position: { x: -3, y: 0, z: -5 },
        interactionRadius: 5,
        type: 'TREE_OF_LIFE',
        dialogueNodeId: 'dlg_object_tree_life',
        scriptureRef: {
          book: 'Génesis',
          chapter: 2,
          verses: '9',
          summaryText: 'El árbol de vida en medio del huerto, símbolo de comunión perpetua con el Creador.',
          adaptationType: 'CANONICAL',
          adaptationNote: 'Reaparecerá al final de la campaña en Apocalipsis 22:2.'
        }
      },
      {
        id: 'obj_tree_knowledge',
        name: 'Árbol de la Ciencia del Bien y del Mal',
        subtitle: 'El Lugar de la Prueba (Génesis 2:17 / 3:6)',
        position: { x: 0, y: 0, z: -24 },
        interactionRadius: 5.5,
        type: 'TREE_OF_KNOWLEDGE',
        dialogueNodeId: 'dlg_object_tree_knowledge',
        scriptureRef: {
          book: 'Génesis',
          chapter: 3,
          verses: '1-7',
          summaryText: 'El punto donde la desobediencia introdujo la fractura, pero también donde Dios anunció la primera promesa de redención.',
          adaptationType: 'CANONICAL',
          adaptationNote: 'Representación directa del relato de Génesis 3.'
        }
      }
    ],
    dialogues: {
      dlg_object_rivers: {
        id: 'dlg_object_rivers',
        speakerName: 'Crónica del Testigo',
        speakerRole: 'Observación Histórica y Escritural',
        text: 'Las aguas cristalinas brotan del manantial central y se dividen en cuatro corrientes: Pisón, que rodea la tierra de Havila; Gihón; Hidekel (Tigris), que va al oriente de Asiria; y el Éufrates. Todo respira un orden sagrado.',
        scriptureRef: {
          book: 'Génesis',
          chapter: 2,
          verses: '10-14',
          summaryText: 'Descripción de la hidrografía del Edén.',
          adaptationType: 'CANONICAL',
          adaptationNote: 'Texto bíblico directo.'
        },
        choices: [
          {
            id: 'c_rivers_done',
            text: 'Registrar en el Códice y buscar a Adán junto al Árbol de la Vida.',
            nextNodeId: null,
            grantCodexEntryId: 'codex_eden_rivers'
          }
        ]
      },
      dlg_object_tree_life: {
        id: 'dlg_object_tree_life',
        speakerName: 'Crónica del Testigo',
        speakerRole: 'Contemplación',
        text: 'El Árbol de la Vida irradia una luz cálida y perenne. Sus hojas no conocen marchitez. Este mismo árbol volverá a ser visto en la Nueva Jerusalén para la sanidad de las naciones.',
        scriptureRef: {
          book: 'Génesis',
          chapter: 2,
          verses: '9',
          summaryText: 'El árbol de vida plantado en el centro del huerto.',
          adaptationType: 'CANONICAL',
          adaptationNote: 'Conexión canónica entre Génesis 2:9 y Apocalipsis 22:2.'
        },
        choices: [
          {
            id: 'c_tree_life_close',
            text: 'Continuar explorando el Jardín.',
            nextNodeId: null
          }
        ]
      },
      dlg_adam_1: {
        id: 'dlg_adam_1',
        speakerName: 'Adán',
        speakerRole: 'Guardián del Huerto',
        text: 'La paz del Creador sea contigo, caminante. Cada criatura que ves ha recibido su nombre, y la tierra responde sin espinos a nuestras manos. Nuestro encargo es claro: labrar este santuario y guardarlo en fidelidad.',
        scriptureRef: {
          book: 'Génesis',
          chapter: 2,
          verses: '15-17',
          summaryText: 'Comisión de Adán de labrar y guardar el huerto.',
          adaptationType: 'CANONICAL',
          adaptationNote: 'Basado en el mandato de Génesis 2:15.'
        },
        choices: [
          {
            id: 'c_adam_ask_command',
            text: '¿Cuál es el precepto que el Creador estableció sobre los árboles?',
            nextNodeId: 'dlg_adam_2'
          },
          {
            id: 'c_adam_ask_eve',
            text: '¿Dónde se encuentra Eva en este momento?',
            nextNodeId: 'dlg_adam_3'
          }
        ]
      },
      dlg_adam_2: {
        id: 'dlg_adam_2',
        speakerName: 'Adán',
        speakerRole: 'Guardián del Huerto',
        text: '«De todo árbol del huerto podrás comer; mas del árbol de la ciencia del bien y del mal no comerás; porque el día que de él comieres, ciertamente morirás.» No es una carencia, sino el sello de nuestra confianza en Aquel que nos dio el aliento.',
        scriptureRef: {
          book: 'Génesis',
          chapter: 2,
          verses: '16-17',
          summaryText: 'Cita textual del mandato en Génesis 2:16-17.',
          adaptationType: 'CANONICAL',
          adaptationNote: 'Palabras fieles al texto bíblico.'
        },
        choices: [
          {
            id: 'c_adam_to_3',
            text: '¿Has notado alguna inquietud hacia la colina del norte?',
            nextNodeId: 'dlg_adam_3'
          }
        ]
      },
      dlg_adam_3: {
        id: 'dlg_adam_3',
        speakerName: 'Adán',
        speakerRole: 'Guardián del Huerto',
        text: 'Eva caminó hace poco hacia la arboleda oriental, cerca del sendero que sube al Árbol de la Ciencia. Un susurro extraño pareció agitar las ramas altas. Ve hacia ella; yo me acercaré en breve.',
        scriptureRef: {
          book: 'Génesis',
          chapter: 3,
          verses: '1-6',
          summaryText: 'Preludio del encuentro junto al árbol.',
          adaptationType: 'DRAMATIC_ADAPTATION',
          adaptationNote: 'Transición interactiva para guiar al jugador hacia el evento de Génesis 3.'
        },
        choices: [
          {
            id: 'c_adam_finish',
            text: 'Iré hacia la arboleda para encontrar a Eva.',
            nextNodeId: null
          }
        ]
      },
      dlg_eve_1: {
        id: 'dlg_eve_1',
        speakerName: 'Eva',
        speakerRole: 'Madre de los Vivientes',
        text: 'Detente un instante y mira hacia la colina del norte... Aquel árbol en el límite tiene frutos de un resplandor distinto. Una voz astuta entre el follaje preguntó: «¿Conque Dios os ha dicho: No comáis de todo árbol del huerto?»',
        scriptureRef: {
          book: 'Génesis',
          chapter: 3,
          verses: '1-3',
          summaryText: 'La pregunta de la serpiente en Génesis 3:1.',
          adaptationType: 'CANONICAL',
          adaptationNote: 'Reproduce la estructura de la tentación descrita en Génesis 3:1-5.'
        },
        choices: [
          {
            id: 'c_eve_warn',
            text: 'Recuerda la Palabra primera: Dios dio libertad sobre todo el huerto para preservar la vida.',
            nextNodeId: 'dlg_eve_2',
            consequenceTag: 'witness_reminded_word'
          },
          {
            id: 'c_eve_ask_serpent',
            text: '¿Qué más ha dicho esa voz entre las ramas?',
            nextNodeId: 'dlg_eve_2',
            consequenceTag: 'witness_inquired_serpent'
          }
        ]
      },
      dlg_eve_2: {
        id: 'dlg_eve_2',
        speakerName: 'Eva',
        speakerRole: 'Madre de los Vivientes',
        text: 'Aseguró que no moriremos, sino que serán abiertos nuestros ojos para conocer el bien y el mal... El árbol parece bueno para comer, agradable a los ojos y codiciable para alcanzar sabiduría. La decisión ya pesa sobre nosotros en aquella colina.',
        scriptureRef: {
          book: 'Génesis',
          chapter: 3,
          verses: '4-6',
          summaryText: 'El argumento de la serpiente y la percepción del fruto.',
          adaptationType: 'CANONICAL',
          adaptationNote: 'Fiel a Génesis 3:4-6. El jugador no puede impedir la caída canónica, pero atestigua su gravedad espiritual.'
        },
        choices: [
          {
            id: 'c_eve_end',
            text: 'Acercarse al Árbol de la Ciencia del Bien y del Mal.',
            nextNodeId: null
          }
        ]
      },
      dlg_object_tree_knowledge: {
        id: 'dlg_object_tree_knowledge',
        speakerName: 'Acontecimiento Escritural — Génesis 3:6-13',
        speakerRole: 'La Fractura en el Edén',
        text: 'Ante tus ojos se consuma el relato antiguo: el fruto es tomado y compartido. De pronto, la brisa del día trae la voz del Creador: «¿Dónde estás tú?». La inocencia ha sido herida y el temor entra en el mundo, pero el juicio divino no termina en desesperanza: una Promesa está a punto de ser proclamada.',
        scriptureRef: {
          book: 'Génesis',
          chapter: 3,
          verses: '6-15',
          summaryText: 'La desobediencia, el llamado de Dios en el huerto y el anuncio de la Simiente.',
          adaptationType: 'CANONICAL',
          adaptationNote: 'Núcleo canónico del capítulo 3 de Génesis.'
        },
        choices: [
          {
            id: 'c_tree_knowledge_done',
            text: 'Acudir al Centinela del Oriente para escuchar la Promesa (Génesis 3:15).',
            nextNodeId: null,
            grantCodexEntryId: 'codex_fall_and_call'
          }
        ]
      },
      dlg_cherub_1: {
        id: 'dlg_cherub_1',
        speakerName: 'Centinela del Oriente',
        speakerRole: 'Querubín Custodio (Génesis 3:24)',
        text: 'El acceso directo al Árbol de la Vida queda ahora resguardado, Testigo, para que el hombre no viva eternamente en su quebranto. Pero escucha lo que el Altísimo ha sentenciado contra la serpiente: «Pondré enemistad entre ti y la mujer, y entre tu simiente y la simiente suya; ésta te herirá en la cabeza, y tú le herirás en el calcañar.»',
        scriptureRef: {
          book: 'Génesis',
          chapter: 3,
          verses: '15, 24',
          summaryText: 'El Protoevangelio: la promesa del Redentor que aplastará la cabeza de la serpiente.',
          adaptationType: 'CANONICAL',
          adaptationNote: 'Génesis 3:15 conecta directamente este primer capítulo con la cruz y resurrección en los Evangelios.'
        },
        choices: [
          {
            id: 'c_cherub_complete',
            text: 'Guardar el testimonio de la Promesa y completar la misión del Edén.',
            nextNodeId: null,
            grantCodexEntryId: 'codex_protoevangelium'
          }
        ]
      }
    }
  },
  // CAPÍTULOS SIGUIENTES PREPARADOS EN LA ARQUITECTURA PARA EXPANSIÓN PROGRESIVA
  {
    id: 'chapter_2_noah',
    order: 2,
    testament: 'OLD_TESTAMENT',
    bookName: 'Génesis 6–9',
    title: 'Capítulo II: Las Aguas del Juicio y el Arca del Pacto',
    eraDescription: 'Noé, la construcción del Arca, el Diluvio y el Arco en las nubes',
    unlockedByDefault: false,
    isPlayableInBuild: false,
    spawnPosition: { x: 0, y: 0, z: 0 },
    missions: [],
    npcs: [],
    interactiveObjects: [],
    dialogues: {}
  },
  {
    id: 'chapter_3_exodus',
    order: 3,
    testament: 'OLD_TESTAMENT',
    bookName: 'Éxodo 3–20',
    title: 'Capítulo III: Fuego en Horeb y el Camino por el Mar',
    eraDescription: 'Moisés, la Zarza Ardiente, Egipto, el Mar Rojo y el Monte Sinaí',
    unlockedByDefault: false,
    isPlayableInBuild: false,
    spawnPosition: { x: 0, y: 0, z: 0 },
    missions: [],
    npcs: [],
    interactiveObjects: [],
    dialogues: {}
  },
  {
    id: 'chapter_4_david_prophets',
    order: 4,
    testament: 'OLD_TESTAMENT',
    bookName: 'Josué, Samuel y Daniel',
    title: 'Capítulo IV: Murallas, Gigantes y Profetas del Reino',
    eraDescription: 'Jericó, el Valle de Ela (David y Goliat) y Babilonia (Daniel)',
    unlockedByDefault: false,
    isPlayableInBuild: false,
    spawnPosition: { x: 0, y: 0, z: 0 },
    missions: [],
    npcs: [],
    interactiveObjects: [],
    dialogues: {}
  },
  {
    id: 'chapter_5_gospels',
    order: 5,
    testament: 'NEW_TESTAMENT',
    bookName: 'Mateo, Marcos, Lucas y Juan',
    title: 'Capítulo V: El Verbo Hecho Carne — Discípulo en Galilea y Jerusalén',
    eraDescription: 'El Ministerio de Jesús, Milagros, la Última Cena, el Calvario y la Tumba Vacía al Tercer Día',
    unlockedByDefault: false,
    isPlayableInBuild: false,
    spawnPosition: { x: 0, y: 0, z: 0 },
    missions: [],
    npcs: [],
    interactiveObjects: [],
    dialogues: {}
  },
  {
    id: 'chapter_6_revelation',
    order: 6,
    testament: 'NEW_TESTAMENT',
    bookName: 'Hechos y Apocalipsis',
    title: 'Capítulo VI: Testigos hasta lo Último de la Tierra y la Nueva Jerusalén',
    eraDescription: 'La Iglesia Primitiva, Patmos y el Árbol de la Vida Restaurado (Apocalipsis 21–22)',
    unlockedByDefault: false,
    isPlayableInBuild: false,
    spawnPosition: { x: 0, y: 0, z: 0 },
    missions: [],
    npcs: [],
    interactiveObjects: [],
    dialogues: {}
  }
];