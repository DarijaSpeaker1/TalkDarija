export type Level = 'A0' | 'A1' | 'A2' | 'B1';
export type ExerciseKind =
  | 'translation' | 'select' | 'order' | 'missing' | 'matching'
  | 'context' | 'reading' | 'conversation';
export type LessonType = 'lesson' | 'story' | 'review' | 'unit-test';
export type Exercise = {
  id: string; kind: ExerciseKind; prompt: string; answer: string;
  options?: string[]; words?: string[]; hint?: string; explanation: string;
};
export type Lesson = {
  id: string; unitId: number; number: number; title: string; subtitle: string;
  duration: number; xp: number; type: LessonType; level: Level; exercises: Exercise[];
};
export type Unit = { id: number; title: string; darija: string; description: string; color: string; level: Level };
export type Vocabulary = {
  id: string; darija: string; romanization: string; english: string; category: string;
  level: Level; tags: string[]; example: string; timesSeen: number; timesCorrect: number;
  lastReviewed: string | null; learned: boolean;
};

export type ClickableVocabularyEntry = {
  darija: string;
  english: string;
  romanization: string;
  example: string;
};

export type AvatarOption = {
  id: string;
  name: string;
  category: "masculine" | "feminine";
  description: string;
  image: string;
};

export const avatarOptions: AvatarOption[] = [
  { id: "amina", name: "Amina", category: "feminine", description: "Long dark waves, coral blouse", image: "/avatars/amina.svg" },
  { id: "youssef", name: "Youssef", category: "masculine", description: "Short curls, teal overshirt", image: "/avatars/youssef.svg" },
  { id: "salma", name: "Salma", category: "feminine", description: "Soft hijab, saffron scarf", image: "/avatars/salma.svg" },
  { id: "omar", name: "Omar", category: "masculine", description: "Trim beard, indigo collar", image: "/avatars/omar.svg" },
  { id: "noura", name: "Noura", category: "feminine", description: "Short copper hair, rose jacket", image: "/avatars/noura.svg" },
  { id: "rayan", name: "Rayan", category: "masculine", description: "Wavy hair, sand hoodie", image: "/avatars/rayan.svg" },
  { id: "lina", name: "Lina", category: "feminine", description: "Shoulder-length curls, teal knit", image: "/avatars/lina.svg" },
  { id: "hamza", name: "Hamza", category: "masculine", description: "Longer hair, terracotta tee", image: "/avatars/hamza.svg" },
  { id: "farah", name: "Farah", category: "feminine", description: "Long auburn hair, olive top", image: "/avatars/farah.svg" },
  { id: "adil", name: "Adil", category: "masculine", description: "Clean shave, cream jacket", image: "/avatars/adil.svg" },
  { id: "meryem", name: "Meryem", category: "feminine", description: "Textured bob, cobalt shirt", image: "/avatars/meryem.svg" },
  { id: "karim", name: "Karim", category: "masculine", description: "Close crop, burnt orange jacket", image: "/avatars/karim.svg" },
  { id: "hanae", name: "Hanae", category: "feminine", description: "Patterned headscarf, plum top", image: "/avatars/hanae.svg" },
  { id: "mehdi", name: "Mehdi", category: "masculine", description: "Salt-and-pepper waves, navy tee", image: "/avatars/mehdi.svg" },
  { id: "aya", name: "Aya", category: "feminine", description: "Long braids, mustard blouse", image: "/avatars/aya.svg" },
  { id: "walid", name: "Walid", category: "masculine", description: "Coiled hair, forest jacket", image: "/avatars/walid.svg" },
];

export const clickableVocabulary: Record<string, ClickableVocabularyEntry> = {
  salam: { darija: 'salam', english: 'hello / peace', romanization: 'sa-lam', example: 'salam 3likom' },
  labas: { darija: 'labas', english: 'fine / well', romanization: 'la-bas', example: 'labas, hamdullah' },
  hamdullah: { darija: 'hamdullah', english: 'thank God', romanization: 'ham-du-l-lah', example: 'labas, hamdullah' },
  bslama: { darija: 'bslama', english: 'goodbye', romanization: 'bslama', example: 'bslama, 3afak' },
  chokran: { darija: 'chokran', english: 'thank you', romanization: 'sho-kraan', example: 'chokran bzaf' },
  '3afak': { darija: '3afak', english: 'please', romanization: '3a-fak', example: '3afak, atay' },
  smiti: { darija: 'smiti', english: 'my name is', romanization: 'smi-ti', example: 'smiti Sara' },
  sara: { darija: 'Sara', english: 'Sara', romanization: 'sa-ra', example: 'smiti Sara' },
  chno: { darija: 'chno', english: 'what', romanization: 'sh-no', example: 'chno smitek?' },
  smitek: { darija: 'smitek', english: 'your name', romanization: 'smi-tek', example: 'chno smitek?' },
  ana: { darija: 'ana', english: 'I', romanization: 'a-na', example: 'ana mn lmaghrib' },
  nta: { darija: 'nta', english: 'you (male)', romanization: 'nta', example: 'nta mnin?' },
  nti: { darija: 'nti', english: 'you (female)', romanization: 'nti', example: 'nti mnin?' },
  mn: { darija: 'mn', english: 'from', romanization: 'mn', example: 'ana mn lmaghrib' },
  lmaghrib: { darija: 'lmaghrib', english: 'Morocco', romanization: 'l-maghrib', example: 'ana mn lmaghrib' },
  bghit: { darija: 'bghit', english: 'I want', romanization: 'b-ghit', example: 'bghit atay' },
  khasni: { darija: 'khasni', english: 'I need', romanization: 'kha-sni', example: 'khasni atay' },
  atay: { darija: 'atay', english: 'tea', romanization: 'a-tay', example: 'bghit atay' },
  ma: { darija: 'ma', english: 'water', romanization: 'ma', example: 'bghit ma' },
  fin: { darija: 'fin', english: 'where', romanization: 'fin', example: 'fin kayn sou9?' },
  sou9: { darija: 'sou9', english: 'market', romanization: 'sooq', example: 'fin kayn sou9?' },
  hna: { darija: 'hna', english: 'here', romanization: 'hna', example: 'hna' },
  ltema: { darija: 'ltema', english: 'there', romanization: 'l-te-ma', example: 'ltema' },
  fhemt: { darija: 'fhemt', english: 'I understood', romanization: 'fhemt', example: 'fhemt' },
  'mafhemtch': { darija: 'ma fhemtch', english: "I didn't understand", romanization: 'ma fhemtch', example: 'ma fhemtch' },
  '3awed': { darija: '3awed', english: 'repeat', romanization: '3a-wed', example: '3awed 3afak' },
  bchwiya: { darija: 'bchwiya', english: 'a little / slowly', romanization: 'b-shwi-ya', example: 'bchwiya 3lik' },
  lyoum: { darija: 'lyoum', english: 'today', romanization: 'lyoom', example: 'lyoum' },
  ghdda: { darija: 'ghdda', english: 'tomorrow', romanization: 'gh-da', example: 'ghdda' },
  mzyan: { darija: 'mzyan', english: 'good / nice', romanization: 'm-zi-yan', example: 'mzyan bzaf' },
  '7seb': { darija: '7seb', english: 'the bill / count', romanization: '7-seb', example: '7seb lia 3afak' },
  tajine: { darija: 'tajine', english: 'tajine', romanization: 'ta-jeen', example: 'bghit tajine' },
  bch7al: { darija: 'bch7al', english: 'how much', romanization: 'b-sh-7al', example: 'bch7al hada?' },
  s7abi: { darija: 's7abi', english: 'my friend / my friends', romanization: 's7a-bi', example: 's7abi' },
  khouya: { darija: 'khouya', english: 'my brother', romanization: 'khoo-ya', example: 'khouya' },
  khti: { darija: 'khti', english: 'my sister', romanization: 'khti', example: 'khti' },
  fer7an: { darija: 'fer7an', english: 'happy', romanization: 'fer-7an', example: 'fer7an lyoum' },
  ta3ban: { darija: 'ta3ban', english: 'tired', romanization: 'ta-3ban', example: 'ta3ban' },
};

export const placementQuestions = [
  { id:'p1', category:'Greetings', difficulty:1, prompt:'What does “salam” mean?', options:['Goodbye','Hello / peace','Please','Thank you'], answer:'Hello / peace', explanation:'Salam is the everyday hello in Morocco. You can also say salam 3likom.' },
  { id:'p2', category:'Greetings', difficulty:1, prompt:'Choose the best reply to “labas?”', options:['Bslama','Labas, hamdullah','Chno?','Smah lia'], answer:'Labas, hamdullah', explanation:'Labas? means “Are you well?” A warm reply is labas, hamdullah — well, thank God.' },
  { id:'p3', category:'People', difficulty:1, prompt:'“Chno smitek?” asks for your…', options:['home','name','age','city'], answer:'name', explanation:'Chno smitek? literally asks “what is your name?” Say smiti… to answer.' },
  { id:'p4', category:'People', difficulty:2, prompt:'Complete: “Smiti ___.”', options:['mzyan','Sara','f lmdina','bslama'], answer:'Sara', explanation:'Smiti means “my name is”. Add your name after it.' },
  { id:'p5', category:'Places', difficulty:2, prompt:'What does “fin sakn?” mean?', options:['Where do you live?','What do you want?','How are you?','Where are you going?'], answer:'Where do you live?', explanation:'Fin means where and sakn means living. Together: where do you live?' },
  { id:'p6', category:'Needs', difficulty:2, prompt:'“Bghit atay” means…', options:['I drank tea','I want tea','Tea is good','Make tea'], answer:'I want tea', explanation:'Bghit is the useful beginner phrase “I want”. Atay is Moroccan mint tea.' },
  { id:'p7', category:'Daily life', difficulty:3, prompt:'Translate: “Kanqra darija.”', options:['I teach Darija','I am learning Darija','I speak Arabic','I write Darija'], answer:'I am learning Darija', explanation:'The prefix kan- often marks an action happening regularly. Qra means study/read.' },
  { id:'p8', category:'Repair', difficulty:3, prompt:'You missed what someone said. Choose:', options:['Ma fhemtch','Ma3lish','Bssa7a','Aji hna'], answer:'Ma fhemtch', explanation:'Ma fhemtch means “I didn’t understand”. It is a kind, useful repair phrase.' },
  { id:'p9', category:'Conversation', difficulty:3, prompt:'“Kidayr?” is closest to…', options:['What is this?','How are you?','Where are you?','Who are you?'], answer:'How are you?', explanation:'Kidayr (to a man) and kidayra (to a woman) mean how are you / how is it going.' },
  { id:'p10', category:'Grammar', difficulty:4, prompt:'Pick the natural sentence for “I live in Rabat.”', options:['Sakn Rabat','Sakna f Rabat','Ana sakn f Rabat','Ana kanqra Rabat'], answer:'Ana sakn f Rabat', explanation:'Ana is I, sakn is live (masculine form), and f means in.' },
  { id:'p11', category:'Grammar', difficulty:4, prompt:'What does “ghadi nmshi” express?', options:['I went','I am going to go','I want to eat','I am sitting'], answer:'I am going to go', explanation:'Ghadi + verb is a handy future construction: I am going to…' },
  { id:'p12', category:'Conversation', difficulty:4, prompt:'Someone says “bslama”. You say…', options:['Bslama','Labas','Chokran','Sbah lkhir'], answer:'Bslama', explanation:'Bslama is goodbye — literally “with peace”. Mirror it back when leaving.' },
];

const unitSeeds: Array<[string, string, string, Level, string]> = [
  ['First hellos','Salam w l3arbiya','Start a real conversation with warmth.','A0','#df704f'],
  ['Your people','Nta / nti','Names, introductions, and where you are from.','A0','#e6a74d'],
  ['Home base','Dari w 3a2ilti','Talk about home, family, and the people close to you.','A0','#c77955'],
  ['Around town','F lmdina','Find places, ask directions, and get curious.','A1','#337d82'],
  ['Food and tea','Lmakla w atay','Order, taste, and compliment the table.','A1','#d45a55'],
  ['The market','F sou9','Buy what you need and ask a fair price.','A1','#bb7b43'],
  ['Daily rhythm','Nhari','Talk about work, study, and ordinary days.','A1','#e39b4e'],
  ['People close by','S7abi','Describe friends, family, and your circle.','A1','#4f8a78'],
  ['Feelings today','L7ss w lmach3ar','Say how you feel and respond with care.','A2','#b56b70'],
  ['Make it clear','Fhemti?','Repair a conversation and ask for help.','A2','#d47757'],
  ['Plans and movement','Ghadi','Talk about tomorrow and where you are headed.','A2','#507899'],
  ['At work','Lkhedma','Handle practical conversations at work.','A2','#6a7f68'],
  ['Little stories','L7wayej','Connect ideas and share what happened.','A2','#c27566'],
  ['Health and body','S7a','Explain a problem and find support.','A2','#7b8d9a'],
  ['Travel days','Ssefr','Navigate stations, stays, and new roads.','A2','#8d765f'],
  ['Opinions','Ra2yi','Share what you think without losing warmth.','B1','#6d789a'],
  ['Better conversations','Hder mzyan','Ask follow-ups and keep a chat moving.','B1','#3f7775'],
  ['News and community','Lkhbar','Discuss what is happening around you.','B1','#766b8d'],
  ['Stories with texture','L7kaya','Tell a fuller story with time and detail.','B1','#aa725e'],
  ['Culture and custom','L3ada','Talk about Moroccan life and traditions.','B1','#9b7a4f'],
  ['Work it out','Nla9aw 7el','Suggest, negotiate, and solve a small problem.','B1','#667f72'],
  ['Your own style','B tari9tk','Sound natural, expressive, and sure of yourself.','B1','#8b6578'],
  ['Open doors','N9dro nhdro','Bring it all together in a natural chat.','B1','#3f7775'],
];

export const units: Unit[] = unitSeeds.map(([title, darija, description, level, color], index) => ({
  id:index + 1, title, darija, description, level, color,
}));

export type WildScenario = {
  id: string;
  title: string;
  setting: string;
  level: Level;
  prompt: string;
  response: string;
  meaning: string;
  note: string;
};

export const wildScenarios: WildScenario[] = [
  { id: "cafe", title: "At the cafe", setting: "Order a mint tea", level: "A0", prompt: "You sit down and want tea. What do you say?", response: "bghit atay", meaning: "I want tea", note: "Bghit is a useful way to say “I want” in everyday Darija." },
  { id: "market", title: "At the market", setting: "Ask the price", level: "A1", prompt: "You point to something and ask how much it costs.", response: "bch7al hada?", meaning: "How much is this?", note: "Hada means “this” and bch7al asks about the price." },
  { id: "taxi", title: "Taking a taxi", setting: "Find the city center", level: "A1", prompt: "You need to get to the city. What can you ask?", response: "bghit nmshi lmdina", meaning: "I want to go to the city", note: "Short, direct phrases are perfectly natural when getting around." },
  { id: "family", title: "With family", setting: "Check in warmly", level: "A0", prompt: "A relative asks how you are. Choose a warm reply.", response: "labas, hamdullah", meaning: "Fine, thank God", note: "This is a very common everyday reply to labas?" },
];

export const cultureCards = [
  { id: "tea", title: "Mint tea is a welcome", text: "Atay b n3na3 is more than a drink. Offering tea is a warm way to welcome someone.", phrase: "bssa7a", meaning: "enjoy your meal / drink" },
  { id: "bslama", title: "A gentle goodbye", text: "Bslama literally carries the idea of leaving with peace. It works in everyday goodbyes.", phrase: "bslama", meaning: "goodbye" },
  { id: "salam", title: "Start with warmth", text: "Salam is a friendly everyday hello. Add 3likom for a fuller greeting.", phrase: "salam 3likom", meaning: "peace be upon you" },
];

const lessonGroups: Array<Array<[string, string, string]>> = [
  [['Say hello','salam, labas?','hello, how are you?'],['A warm reply','labas, hamdullah','well, thank God'],['Good morning','sbah lkhir','good morning'],['A little goodbye','bslama','goodbye'],['First hello story','t3arafna lyom','we met today']],
  [['Your name','smiti Sara','my name is Sara'],['Ask a name','chno smitek?','what is your name?'],['Where from?','mnin nta?','where are you from?'],['A kind meeting','fr7an b l9a','nice to meet you'],['Introductions review','ana mn lmaghrib','I am from Morocco']],
  [['My home','dari f lmdina','my home is in the city'],['My family','3a2ilti kbira','my family is big'],['This is my brother','hada khouya','this is my brother'],['At home story','kan3ich m3a 3a2ilti','I live with my family'],['Home unit test','fin sakn w m3a men?','where do you live and with whom?']],
  [['Find a place','fin kayn sou9?','where is the market?'],['Near and far','qrib w b3id','near and far'],['Turn left','dour 3la lisr','turn left'],['Around town story','lmdina kbira w 3amra','the city is big and lively'],['Town unit test','bghit nmshi lma7atta','I want to go to the station']],
  [['Mint tea','atay b n3na3','mint tea'],['At the table','bssa7a','enjoy your meal'],['Order a bite','bghit tajine','I want tajine'],['Food story','lmakla bnina bzaf','the food is very delicious'],['Food unit test','7seb lia 3afak','the bill please']],
  [['At the market','bch7al hada?','how much is this?'],['A good price','taman mzyan','a good price'],['I need two','bghit jouj','I want two'],['Market story','ma3ndich sraf','I do not have change'],['Market unit test','n9der nchri had l7aja?','can I buy this thing?']],
  [['Every morning','kol sba7','every morning'],['Work and study','kanqra w nkhdem','I study and work'],['Today','lyoum','today'],['Time words','daba w mn b3d','now and later'],['Daily unit test','ach katdir f nhar?','what do you do in a day?']],
  [['My friends','s7abi','my friends'],['People words','khouya w khti','my brother and sister'],['How they are','kidayrin?','how are they?'],['A good friend story','s7abi kay3awnoni','my friends help me'],['People unit test','3ndi s7ab f kol blassa','I have friends everywhere']],
  [['I feel good','7ass bikhir','I feel good'],['A hard day','nhari s3ib','my day is difficult'],['I am happy','fer7an lyoum','I am happy today'],['Feelings story','mra mzyan mra ta3ban','sometimes well, sometimes tired'],['Feelings unit test','kifach 7ass daba?','how do you feel now?']],
  [['I understand','fhemt','I understand'],['I do not understand','ma fhemtch','I did not understand'],['Say it again','3awed 3afak','repeat please'],['Slowly please','bchwiya 3lik','slowly please'],['Repair unit test','chra7 lia b tari9a okhra','explain it another way']],
  [['Going tomorrow','ghadi nmshi','I am going to go'],['Where next?','fin ghadi?','where are you going?'],['Plans','3ndi plan','I have a plan'],['Come with me','aji m3aya','come with me'],['Movement unit test','ghdda ghadi nji bekri','tomorrow I will come early']],
  [['At work','kankhdem f charika','I work in a company'],['A quick meeting','3ndna lmeeting daba','we have the meeting now'],['Send the message','sift lia lmail','send me the email'],['Work story','khdmna m3a b3diyatna','we worked together'],['Work unit test','wa9tach khasna nsaliw?','when do we need to finish?']],
  [['Yesterday','lbare7','yesterday'],['Because','7it','because'],['A small story','wa7ed nhar','one day'],['And then','mn b3d','and then'],['Story unit test','mlli wslna ldar t3china','when we arrived home we had dinner']],
  [['My head hurts','rassi kaydorni','my head hurts'],['I need a doctor','khasni tbib','I need a doctor'],['Rest a little','rta7 chwia','rest a little'],['Health story','mchit lsbitar bach nt3alj','I went to the hospital to get treated'],['Health unit test','fin kayn lpharmacie?','where is the pharmacy?']],
  [['At the station','fin lma7atta?','where is the station?'],['One ticket','wa7ed ticket 3afak','one ticket please'],['Where to stay','fin n9der nbat?','where can I stay?'],['Travel story','ssefr kay3llm bzaf','travel teaches a lot'],['Travel unit test','ch7al katakhod tri9?','how long does the journey take?']],
  [['My opinion','f ra2yi','in my opinion'],['I agree','kanetfe9 m3ak','I agree with you'],['Not quite','ma kanetfe9ch','I do not agree'],['Opinion story','kol wa7ed 3ndo ra2y','everyone has an opinion'],['Opinions unit test','ach katfker f had lmawdo3?','what do you think about this topic?']],
  [['Ask a follow-up','w nta?','and you?'],['Tell me more','gol lia kter','tell me more'],['Natural rhythm','mzyan bzaf','very nice'],['Conversation story','b9ina kanhdro tal lil','we kept talking until night'],['Conversation unit test','kifach doz nhark?','how did your day go?']],
  [['The news','ach kayn f lkhbar?','what is in the news?'],['I heard','sme3t belli','I heard that'],['In the neighborhood','f l7ouma','in the neighborhood'],['Community story','jran kay3awno b3diyathom','neighbors help one another'],['News unit test','wach 3arf ach wa9e3?','do you know what happened?']],
  [['Long ago','9bel bzaf','long ago'],['At that time','dak sa3a','at that time'],['Suddenly','fje2a','suddenly'],['A story unfolds','7kit lihom chno tra','I told them what happened'],['Story unit test','mnin salat l7kaya?','how did the story end?']],
  [['A family custom','3ada dyalna','our custom'],['During Eid','f l3id','during Eid'],['Welcome guests','kanr7bo b ddiouf','we welcome guests'],['Culture story','l3id kayjme3 l3a2ila','Eid brings the family together'],['Culture unit test','ach kat3ni lik had l3ada?','what does this custom mean to you?']],
  [['Find a solution','nl9aw 7el','let us find a solution'],['Maybe tomorrow','ymken ghdda','maybe tomorrow'],['That works','hadchi kaynsebni','that works for me'],['Solve it together','n9dro nsal7oha m3a b3d','we can fix it together'],['Problem unit test','kifach n9dro n3awno?','how can we help?']],
  [['Say it clearly','golha b s7a7','say it clearly'],['A careful answer','khassni nefker chwia','I need to think a little'],['I mean...','9sdi...','I mean...'],['Conversation gets easier with time','lhedra katwli sahla m3a lwa9t','conversation gets easier with time'],['What do you want to say?','chno bghiti tgoul?','what do you want to say?']],
  [['Keep talking','hder m3aya','talk with me'],['Ask kindly','sowl b lutf','ask kindly'],['We can talk','n9dro nhdro','we can talk'],['Conversation brings people closer','lklam kay9reb nnas','conversation brings people closer'],['Let us start talking','yallah nbdaw lhedra','let us start talking']],
];

function makeExercises(id: string, phrase: string, english: string, index: number, type: LessonType): Exercise[] {
  const safeWords = phrase.split(/[\s,]+/).filter(Boolean);
  const firstWord = safeWords[0] ?? phrase;
  const focusWord = safeWords.find((word) => word.toLowerCase() in clickableVocabulary) ?? firstWord;
  const focusMeaning = clickableVocabulary[(focusWord || firstWord).toLowerCase()]?.english ?? english;
  const distractors = Object.values(clickableVocabulary)
    .map((value) => value.english)
    .filter((value) => value !== focusMeaning)
    .slice(0, 3);
  const missingPrompt = safeWords.length > 1
    ? `Complete the sentence: “___ ${safeWords.slice(1).join(' ')}.”`
    : `Complete the sentence: “___”`;

  const base: Exercise[] = [
    { id:`${id}-1`, kind:'translation', prompt:`Translate “${phrase}”.`, answer:english, options:[english, index % 2 ? 'goodbye' : 'hello', 'I do not understand', 'where are you going?'], hint:'Choose the meaning that fits the whole phrase.', explanation:`${phrase} is a natural phrase to keep close. Follow the rhythm, not just one word.` },
    { id:`${id}-2`, kind:'select', prompt:`What does “${focusWord}” mean in this lesson?`, answer:focusMeaning, options:[focusMeaning, ...distractors], explanation:`“${focusWord}” is a useful word in this lesson and it keeps coming up in real conversations.` },
    { id:`${id}-3`, kind:'missing', prompt:missingPrompt, answer:firstWord, options:[firstWord, safeWords[1] ?? 'salam', 'bslama', 'mzyan'], explanation:`This is a very short, natural sentence pattern. The missing word is the part that starts the phrase.` },
    { id:`${id}-4`, kind:'matching', prompt:'Match the word to its meaning.', answer:`${focusWord} — ${focusMeaning}`, options:[`${focusWord} — ${focusMeaning}`, `${safeWords[0] ?? 'salam'} — goodbye`, `${safeWords[1] ?? 'labas'} —  now`, `${safeWords.at(-1) ?? 'bslama'} — where`], explanation:'Matching the word and its meaning helps the word stick in context.' },
    { id:`${id}-5`, kind:'order', prompt:'Order the words into a simple sentence.', answer:phrase, words:[...safeWords].sort(() => Math.random() - 0.5), explanation:'Short phrases are easier to remember when you build them in order.' },
    { id:`${id}-6`, kind:'context', prompt:`Choose the best meaning for this lesson phrase: “${phrase}”.`, answer:english, options:[english, 'A random question', 'A place name', 'A goodbye only'], explanation:'A quick comprehension check helps you connect the phrase to a real situation.' },
  ];
  if (type === 'story') {
    base.push({ id:`${id}-7`, kind:'reading', prompt:`Read this phrase: “${phrase}.” What does it communicate?`, answer:english, options:[english, 'A farewell only', 'A question about a price', 'A request to slow down'], explanation:'Short stories give a phrase a place to live.' });
  }
  if (type === 'unit-test') {
    return base.concat([
      { id:`${id}-7`, kind:'conversation', prompt:'Complete the exchange with the best line.', answer:phrase, options:[phrase, 'ma fhemtch', 'bslama', 'smah lia'], explanation:'A unit test asks you to choose by context, not by pattern alone.' },
      { id:`${id}-8`, kind:'reading', prompt:`In a conversation, someone says “${phrase}”. Choose the meaning that fits.`, answer:english, options:[english, 'They want to leave', 'They are asking your name', 'They need a doctor'], explanation:'You passed the unit when you can recognize the phrase in a new setting.' },
    ]);
  }
  if (type === 'review') return base.slice(0, 5);
  if (type === 'lesson' && index % 3 === 0) {
    base.push({ id:`${id}-7`, kind:'select', prompt:'Build the phrase from the words.', answer:phrase, words:[...safeWords, 'daba', 'mzyan'].sort((a,b) => (a.length + index) - (b.length + index)), explanation:'Put the words back into their natural order.' });
  }
  return base;
}

export const lessons: Lesson[] = lessonGroups.flatMap((group, unitIndex) => group.map(([title, phrase, english], lessonIndex) => {
  const unit = units[unitIndex];
  const type: LessonType = lessonIndex === 4 ? 'unit-test' : lessonIndex === 3 ? 'story' : lessonIndex === 2 ? 'review' : 'lesson';
  const number = unitIndex * group.length + lessonIndex + 1;
  const id = `lesson-${number}`;
  return { id, unitId:unit.id, number, title, subtitle:phrase, duration:type === 'unit-test' ? 9 : type === 'story' ? 7 : 5 + (number % 3), xp:type === 'unit-test' ? 28 : type === 'story' ? 20 : 12 + (number % 4) * 3, type, level:unit.level, exercises:makeExercises(id, phrase, english, number, type) };
}));

// The source is organized by level and conversation category. Each entry is a useful
// word or phrase; five common frames turn each source item into a distinct recall card.
const vocabularySources: Record<Level, Record<string, string[]>> = {
  A0: {
    Greetings:['salam|hello','labas|well / okay','bslama|goodbye','sbah lkhir|good morning','msa lkhir|good evening','chokran|thank you','3afak|please','smah lia|excuse me','mar7ba|welcome','ila l9a|see you'],
    People:['smiti|my name is','chno smitek|what is your name','ana|I','nta|you, masculine','nti|you, feminine','howa|he','hiya|she','s7abi|my friends','khouya|my brother','khti|my sister'],
    Home:['dar|house','bit|room','bab|door','chrajem|window','korsi|chair','mida|table','serir|bed','matbakh|kitchen','7mam|bathroom','mfta7|key'],
    Numbers:['wa7ed|one','jouj|two','tlata|three','rb3a|four','khmssa|five','setta|six','seb3a|seven','tmnya|eight','tes3oud|nine','3chra|ten'],
    Needs:['bghit|I want','khasni|I need','ma bghitch|I do not want','3ndi|I have','ma3ndich|I do not have','n9der|I can','ma n9derch|I cannot','3awnni|help me','sber|wait','ji|come'],
  },
  A1: {
    Places:['mdina|city','zen9a|street','sou9|market','hanout|corner shop','qahwa|cafe','ma7atta|station','jam3|mosque','madrassa|school','sbitar|hospital','pharmacie|pharmacy'],
    Food:['atay|tea','qahwa|coffee','ma|water','khobz|bread','7lib|milk','tajine|tajine','couscous|couscous','djaj|chicken','l7em|meat','7out|fish'],
    Time:['lyoum|today','ghdda|tomorrow','lbare7|yesterday','daba|now','mn b3d|later','dima|always','mra mra|sometimes','sba7|morning','lil|night','simana|week'],
    Directions:['fin|where','hna|here','ltema|there','fo9|up','ta7t|down','limen|right','lisr|left','9dam|in front','mor|behind','qrib|near'],
    Everyday:['mzyan|good','kbir|big','sghir|small','jdid|new','9dim|old','sahl|easy','s3ib|difficult','bared|cold','skhoun|hot','bzaf|a lot'],
  },
  A2: {
    Actions:['kanqra|I study','kankhdem|I work','kanmchi|I go','kanji|I come','kanakol|I eat','kanchreb|I drink','kanchof|I see','kansme3|I hear','kan3ref|I know','kanfker|I think'],
    Market:['bch7al|how much','taman|price','rkhis|cheap','ghali|expensive','sraf|change','flous|money','kilo|kilogram','noss|half','zid|add more','na9es|less'],
    Feelings:['fer7an|happy','ta3ban|tired','m9elle9|worried','mrta7|comfortable','m3asseb|upset','m7mou9|excited','7chman|shy','msta3jeb|surprised','m3ya|sick / unwell','wa7edani|lonely'],
    Repair:['fhemt|I understood','ma fhemtch|I did not understand','3awed|repeat','chra7|explain','sme3|listen','chof|look','hder|speak','bchwiya|slowly','wade7|clear','ma3lich|no problem'],
    Travel:['ssefr|travel','tomobil|car','train|train','tonobil|bus','taxi|taxi','ticket|ticket','hotel|hotel','blassa|place','tri9|road','wssel|arrive'],
  },
  B1: {
    Work:['charika|company','m3a9ed|contract','projet|project','mou3id|appointment','ijtima3|meeting','rasala|message','fikra|idea','mouchkil|problem','7el|solution','mas2oul|responsible'],
    Opinions:['ra2y|opinion','fekra|thought','mohem|important','3adi|normal','momtaz|excellent','momkin|possible','darori|necessary','s7i7|correct','ghalat|wrong','t9der|you can'],
    Community:['7ouma|neighborhood','jran|neighbors','derb|local lane','jama3a|community','khbar|news','lmojtama3|society','ta3awen|cooperation','mosa3ada|help','mas2ouliya|responsibility','9anoun|law'],
    Culture:['3ada|custom','3id|holiday','3ers|wedding','diouf|guests','l3a2ila|family','t9afa|culture','mousi9a|music','lbas|clothing','7kaya|story','jil|generation'],
    Conversation:['7it|because','walakin|but','ila|if','7itach|because','mlli|when','ila bghiti|if you want','f ra2yi|in my opinion','bssif|by force','b l3a9el|carefully','bss7|really'],
  },
};

const frameFor = (frame: number, darija: string, english: string) => {
  const frames: Array<[string, string]> = [
    [darija, english],
    [`had ${darija}`, `this ${english}`],
    [`fin kayn ${darija}`, `where is the ${english}`],
    [`bghit ${darija}`, `I want ${english}`],
    [`m3a ${darija}`, `with ${english}`],
    [`ma3ndich ${darija}`, `I do not have ${english}`],
    [`kanchof ${darija}`, `I see ${english}`],
    [`3tini ${darija}`, `give me ${english}`],
    [`ma fhemtch ${darija}`, `I did not understand ${english}`],
    [`khasni ${darija}`, `I need ${english}`],
    [`kayn ${darija} hna`, `there is ${english} here`],
    [`ma kaynch ${darija}`, `there is no ${english}`],
    [`wach 3ndk ${darija}?`, `do you have ${english}?`],
    [`lyoum ${darija}`, `${english} today`],
    [`ghdda ${darija}`, `${english} tomorrow`],
  ];
  return frames[frame] ?? frames[0];
};

export const vocabulary: Vocabulary[] = Object.entries(vocabularySources).flatMap(([level, groups]) =>
  Object.entries(groups).flatMap(([category, entries]) =>
    entries.flatMap((entry, sourceIndex) => {
      const [darija, english] = entry.split('|');
      return Array.from({ length: 15 }, (_, frame) => {
        const [cardDarija, cardEnglish] = frameFor(frame, darija, english);
        return {
          id:`v-${level.toLowerCase()}-${category.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${sourceIndex}-${frame}`,
          darija:cardDarija, romanization:cardDarija, english:cardEnglish, category,
          level:level as Level, tags:[category.toLowerCase(), level], example:`${cardDarija}, 3afak.`,
          timesSeen:0, timesCorrect:0, lastReviewed:null, learned:false,
        };
      });
    }),
  ),
);

export const vocabularyCount = vocabulary.length;

export const achievements = [
  { id:'first-step', title:'First step', detail:'Complete your first lesson', icon:'flag' },
  { id:'steady-sun', title:'Steady sun', detail:'Practice three days in a row', icon:'sun' },
  { id:'word-hoarder', title:'Word collector', detail:'Learn ten words', icon:'book' },
  { id:'good-ear', title:'Good ear', detail:'Answer 25 questions correctly', icon:'ear' },
  { id:'open-door', title:'Open door', detail:'Complete five lessons', icon:'door' },
  { id:'pathfinder', title:'Pathfinder', detail:'Complete ten lessons', icon:'map' },
];