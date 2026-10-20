// Initial React sample, transcribed from the owner's Puzzle Pen v2 archive.
// The archived 144 activities and three casebooks are NOT yet all ported.
export const BOOKS = [
  { id: 'rebus', name: 'Classic Rebus', icon: '▤', tint: 'rose', about: 'Hidden phrases in plain sight', archived: 50 },
  { id: 'codes', name: 'Secret Codes', icon: '⌘', tint: 'blue', about: 'Decode every little secret', archived: 25 },
  { id: 'words', name: 'Word Tricks', icon: '✦', tint: 'amber', about: 'Unscramble the unexpected', archived: 20 },
  { id: 'originals', name: 'Puzzle Pen Originals', icon: '◈', tint: 'mint', about: 'Fresh brain-teasing inventions', archived: 12 },
  { id: 'logic', name: 'Logic Lab', icon: '⌬', tint: 'violet', about: 'Order, deduction, connections', archived: 15 },
  { id: 'mazes', name: 'Magic Mazes', icon: '↝', tint: 'green', about: 'Draw your own way out', archived: 12 },
  { id: 'hidden', name: 'Hidden Pictures', icon: '◉', tint: 'peach', about: 'Find the unexpected', archived: 10 },
  { id: 'cases', name: 'Mystery Casebook', icon: '◇', tint: 'slate', about: 'Three linked investigations', archived: 3 }
];

export const PUZZLES = [
  {id:'r01',book:'rebus',display:'MAN\n────────\nBOARD',answer:'man overboard',accepted:['man over board'],hint:'Where is MAN compared with BOARD?',explanation:'MAN is over BOARD.',difficulty:'Easy'},
  {id:'r02',book:'rebus',display:'CYCLE   CYCLE   CYCLE',answer:'tricycle',accepted:['tri cycle'],hint:'Count how many CYCLEs there are.',explanation:'Three CYCLEs make a tri-cycle.',difficulty:'Easy'},
  {id:'r03',book:'rebus',display:'HEAD\n\nHEELS',answer:'head over heels',hint:'What is on top?',explanation:'HEAD appears over HEELS.',difficulty:'Easy'},
  {id:'r04',book:'rebus',display:'MIND\nMATTER',answer:'mind over matter',hint:'MIND is above what?',explanation:'MIND is over MATTER.',difficulty:'Easy'},
  {id:'r05',book:'rebus',display:'YOU\nJUST\nME',answer:'just between you and me',accepted:['between you and me'],hint:'Where is JUST?',explanation:'JUST is between YOU and ME.',difficulty:'Easy'},
  {id:'r06',book:'rebus',display:'STAND\n   I',answer:'i understand',hint:'Where is the I?',explanation:'I is under STAND.',difficulty:'Easy'},
  {id:'c01',book:'codes',display:'KHOOR',answer:'hello',hint:'Shift each letter back three.',explanation:'Caesar shift +3 encoded HELLO.',difficulty:'Easy'},
  {id:'c02',book:'codes',display:'DLROW',answer:'world',hint:'Read from right to left.',explanation:'WORLD written backward.',difficulty:'Easy'},
  {id:'c03',book:'codes',display:'3 - 1 - 20',answer:'cat',hint:'A=1, B=2, and so on.',explanation:'Alphabet positions spell CAT.',difficulty:'Easy'},
  {id:'c04',book:'codes',display:'4 - 15 - 7',answer:'dog',hint:'Use alphabet positions.',explanation:'4=D, 15=O, 7=G.',difficulty:'Easy'},
  {id:'c05',book:'codes',display:'SxExCxRxExT',answer:'secret',hint:'Remove the x filler characters.',explanation:'Every other character spells SECRET.',difficulty:'Easy'},
  {id:'w01',book:'words',display:'MGAIC',prompt:'Unscramble this word',answer:'magic',hint:'It fits Puzzle Pen pretty well.',explanation:'The letters spell MAGIC.',difficulty:'Easy'},
  {id:'w02',book:'words',display:'ZZLPEU',prompt:'Unscramble this word',answer:'puzzle',hint:'You are solving one.',explanation:'The letters spell PUZZLE.',difficulty:'Easy'},
  {id:'w03',book:'words',display:'NPE',prompt:'Unscramble this word',answer:'pen',hint:'You write with one.',explanation:'The letters spell PEN.',difficulty:'Easy'},
  {id:'w04',book:'words',display:'OCDE',prompt:'Unscramble this word',answer:'code',hint:'Programming uses it.',explanation:'The letters spell CODE.',difficulty:'Easy'},
  {id:'o01',book:'originals',display:'PING\nPING\nPING',answer:'triple ping',hint:'Count the PINGs.',explanation:'PING appears three times.',difficulty:'Easy'},
  {id:'o02',book:'originals',display:'LINK        LINK',answer:'link apart',hint:'What separates the links?',explanation:'The two LINKs are apart.',difficulty:'Easy'},
  {id:'l05',book:'logic',display:'MOUSE  •  HORSE  •  DOG  •  ELEPHANT',prompt:'List these from smallest to largest',answer:'mouse dog horse elephant',accepted:['mouse, dog, horse, elephant','mouse → dog → horse → elephant'],hint:'The mouse comes first.',explanation:'Mouse, dog, horse, elephant.',difficulty:'Easy'}
];
