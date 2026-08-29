export type Level = 'A0' | 'A1' | 'A2' | 'B1';
export type ExerciseKind = 'translation' | 'choice' | 'reverse' | 'select' | 'order' | 'missing';
export type Exercise = { id: string; kind: ExerciseKind; prompt: string; answer: string; options?: string[]; words?: string[]; hint?: string; explanation: string };
export type Lesson = { id: string; unitId: number; number: number; title: string; subtitle: string; duration: number; xp: number; exercises: Exercise[] };
export type Unit = { id: number; title: string; darija: string; description: string; color: string };
export type Vocabulary = { id: string; darija: string; romanization: string; english: string; category: string; example: string; timesSeen: number; timesCorrect: number; lastReviewed: string | null; learned: boolean };

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
  { id:'p10', category:'Grammar', difficulty:4, prompt:'Pick the natural sentence for “I live in Rabat.”', options:['Sakn Rabat','Sakna f Rabat','Ana sakn f Rabat','Ana kanqra Rabat'], answer:'Ana sakn f Rabat', explanation:'Ana is I, sakn is live (masculine speaker), and f means in.' },
  { id:'p11', category:'Grammar', difficulty:4, prompt:'What does “ghadi nmshi” express?', options:['I went','I am going to go','I want to eat','I am sitting'], answer:'I am going to go', explanation:'Ghadi + verb is a handy future construction: I am going to…' },
  { id:'p12', category:'Conversation', difficulty:4, prompt:'Someone says “bslama”. You say…', options:['Bslama','Labas','Chokran','Sbah lkhir'], answer:'Bslama', explanation:'Bslama is goodbye — literally “with peace”. Mirror it back when leaving.' },
];

export const units: Unit[] = [
  { id:1, title:'First hellos', darija:'Salam w l3arbiya', description:'Start a real conversation with warmth.', color:'#df704f' },
  { id:2, title:'Your people', darija:'Nta / nti', description:'Names, introductions, and where you are from.', color:'#e6a74d' },
  { id:3, title:'Around town', darija:'F lmdina', description:'Find places, ask directions, get curious.', color:'#337d82' },
  { id:4, title:'Food & tea', darija:'Lmakla w atay', description:'Order, taste, and compliment the table.', color:'#d45a55' },
  { id:5, title:'Daily rhythm', darija:'Nhari', description:'Talk about what you do every day.', color:'#e39b4e' },
  { id:6, title:'People close by', darija:'S7abi', description:'Family, friends, and the people around you.', color:'#4f8a78' },
  { id:7, title:'Make it clear', darija:'Fhemti?', description:'Repair a conversation and ask for help.', color:'#d47757' },
  { id:8, title:'Plans & movement', darija:'Ghadi', description:'Talk about tomorrow and where you are headed.', color:'#507899' },
  { id:9, title:'Little stories', darija:'L7wayej', description:'Connect ideas and share what happened.', color:'#c27566' },
  { id:10, title:'Open doors', darija:'Hder m3aya', description:'Bring it all together in a natural chat.', color:'#3f7775' },
];

const lessonSeeds = [
  ['Say hello','salam, labas?'],['A warm reply','labas, hamdullah'],['Good morning','sbah lkhir'],['Goodbye softly','bslama'],['Tiny introductions','chno smitek?'],
  ['Your name','smiti…'],['Where from?','mnin nta?'],['Where you live','fin sakn?'],['Meet someone new','fr7an b l9a'],['Quick recap','ana mn…'],
  ['Find your way','fin kayn?'],['Near and far','qrib w b3id'],['The city','lmdina kbira'],['Ask politely','smah lia'],['Town recap','f lmdina'],
  ['Mint tea','atay b n3na3'],['At the table','bssa7a'],['Order a bite','bghit…'],['Taste words','bnin بزاف'],['Food recap','lmakla'],
  ['Every morning','kol sba7'],['Work and study','kanqra w nkhdem'],['Today','lyoum'],['Time words','daba / mn b3d'],['Daily recap','nhari'],
  ['My family','3a2ilti'],['A good friend','s7abi'],['People words','khouya / khti'],['How they are','kidayrin?'],['People recap','nas'],
  ['I understand','fhemt'],['I do not understand','ma fhemtch'],['Say it again','3awed 3afak'],['Slowly please','bchwiya 3lik'],['Repair recap','fhemti?'],
  ['Going tomorrow','ghadi nmshi'],['Where next?','fin ghadi?'],['Plans','3ndi plan'],['Come with me','aji m3aya'],['Movement recap','ghadi'],
  ['Yesterday','lbare7'],['Because','7it'],['A small story','wa7ed nhar'],['And then','mn b3d'],['Story recap','l7kaya'],
  ['Keep chatting','hder m3aya'],['Ask a follow-up','w nta?'],['Natural rhythm','mzyan بزاف'],['Your voice','golha b sotk'],['Open doors','n9dro nhdro'],
];

const exerciseFor = (id: string, phrase: string, index: number): Exercise[] => {
  const [title, answer] = [phrase, phrase];
  const english = index % 3 === 0 ? 'hello' : index % 3 === 1 ? 'I want tea' : 'How are you?';
  return [
    { id:`${id}-1`, kind:'translation', prompt:`Translate “${answer}”.`, answer: english, options:['hello','I want tea','How are you?','Goodbye'], hint:'Listen for the phrase you just saw.', explanation:`${answer} is a useful phrase for your next real conversation.` },
    { id:`${id}-2`, kind:'choice', prompt:'Which phrase sounds right?', answer:answer, options:[answer, 'ma fhemtch', 'chokran bzaf', 'fin sakn'], explanation:'Choose the Darija phrase from this lesson.' },
    { id:`${id}-3`, kind:'reverse', prompt:`How would you say “${english}”?`, answer:answer, options:[answer, 'bslama', 'smiti Sara', 'atay b n3na3'], explanation:'English to Darija is how you make recognition become recall.' },
    { id:`${id}-4`, kind:'select', prompt:'Tap the words to build the phrase.', answer:answer, words:answer.split(' ').concat(['mzyan','daba']).sort(() => (id.charCodeAt(1) % 2 ? .5 : -.5)), explanation:'Build the phrase in its natural order.' },
    { id:`${id}-5`, kind:'order', prompt:'Put this mini conversation in order.', answer:`salam, ${answer}`, words:['salam,', answer], explanation:'A greeting makes even a short exchange feel human.' },
  ];
};

export const lessons: Lesson[] = lessonSeeds.map(([title, phrase], i) => {
  const unitId = Math.floor(i / 5) + 1;
  const id = `lesson-${i + 1}`;
  return { id, unitId, number:i + 1, title, subtitle:phrase, duration:5 + (i % 3), xp:12 + (i % 4) * 3, exercises:exerciseFor(id, phrase, i) };
});

export const vocabulary: Vocabulary[] = [
  ['sal1','salam','salam','hello','Greetings','Salam! Labas?',3,3],['lab1','labas','labas','well / okay','Greetings','Labas, hamdullah.',4,3],['sbh1','sbah lkhir','sbah lkhir','good morning','Greetings','Sbah lkhir, kif dayr?',2,2],['bsl1','bslama','bslama','goodbye','Greetings','Bslama, nchofok ghdda.',2,1],
  ['ch1','chno smitek?','chno smitek?','what is your name?','People','Chno smitek? Smiti Lina.',3,2],['sm1','smiti','smiti','my name is','People','Smiti Youssef.',2,2],['fin1','fin sakn?','fin sakn?','where do you live?','Places','Fin sakn daba?',1,1],['bgh1','bghit','bghit','I want','Needs','Bghit atay, 3afak.',4,3],
  ['atay1','atay','atay','tea','Food','Atay b n3na3, 3afak.',2,2],['smah1','smah lia','smah lia','excuse me','Repair','Smah lia, fin kayn sou9?',1,0],['fhm1','ma fhemtch','ma fhemtch','I did not understand','Repair','Smah lia, ma fhemtch.',3,2],['mzy1','mzyan','mzyan','good / nice','Feelings','Lfilm mzyan بزاف.',2,1],['kan1','kanqra','kanqra','I study / read','Daily life','Kanqra Darija kol nhar.',1,1],['gh1','ghadi','ghadi','going to','Plans','Ghadi nmshi lmdina.',2,1],['qr1','qrib','qrib','near','Places','Lhanout qrib.',1,0],['chok1','chokran','chokran','thank you','Greetings','Chokran بزاف.',4,4],['3af1','3afak','3afak','please','Needs','3afak, wa7ed atay.',2,2],['s7ab1','s7abi','s7abi','my friends','People','S7abi f lqahwa.',1,1],['lym1','lyoum','lyoum','today','Daily life','Lyoum kanqra.',1,0],['hder1','hder m3aya','hder m3aya','talk with me','Conversation','Hder m3aya bchwiya.',0,0],
].map(([id,darija,romanization,english,category,example,timesSeen,timesCorrect]) => ({ id:id as string, darija:darija as string, romanization:romanization as string, english:english as string, category:category as string, example:example as string, timesSeen:timesSeen as number, timesCorrect:timesCorrect as number, lastReviewed:null, learned:(timesCorrect as number) >= 3 }));

export const achievements = [
  { id:'first-step', title:'First step', detail:'Complete your first lesson', icon:'flag' },
  { id:'steady-sun', title:'Steady sun', detail:'Practice three days in a row', icon:'sun' },
  { id:'word-hoarder', title:'Word collector', detail:'Learn ten words', icon:'book' },
  { id:'good-ear', title:'Good ear', detail:'Answer 25 questions correctly', icon:'ear' },
  { id:'open-door', title:'Open door', detail:'Finish a full unit', icon:'door' },
];