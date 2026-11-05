'use strict';
/* כל החומר למבחן – לפי דף ההכנה של המורה וספר Jet 2 (Unit 1) */

const PARTS = {
  1: 'חלק 1 – Karen',
  2: 'חלק 2 – At School',
  3: 'חלק 3 – The Bag',
  4: 'חלק 4 – The New Teacher',
  5: 'מילים מהסיפורים',
};

/* pic = null כשאין תמונה ברורה – המילה לא תופיע במשחקי תמונה */
const VOCAB = [
  // Part 1
  { en: 'friend', he: 'חבר / חברה', pic: '🧑‍🤝‍🧑', part: 1 },
  { en: 'grade', he: 'כיתה (שכבה)', pic: '4️⃣', part: 1 },
  { en: 'house', he: 'בית', pic: '🏠', part: 1 },
  { en: 'new', he: 'חדש / חדשה', pic: '🆕', part: 1 },
  { en: 'school', he: 'בית ספר', pic: '🏫', part: 1 },
  { en: 'teacher', he: 'מורה', pic: '👩‍🏫', part: 1 },
  { en: 'town', he: 'עיר', pic: '🏙️', part: 1 },
  // Part 2
  { en: 'pet', he: 'חיית מחמד', pic: '🐾', part: 2 },
  { en: 'bird', he: 'ציפור', pic: '🐦', part: 2 },
  { en: 'brother', he: 'אח', pic: '👦', part: 2 },
  { en: 'English', he: 'אנגלית', pic: '🔤', part: 2 },
  { en: 'family', he: 'משפחה', pic: '👨‍👩‍👧‍👦', part: 2 },
  { en: 'fly', he: 'לעוף', pic: '✈️', part: 2 },
  { en: 'lesson', he: 'שיעור', pic: null, part: 2 },
  { en: 'nice', he: 'נחמד / נחמדה', pic: '😊', part: 2 },
  { en: 'sister', he: 'אחות', pic: '👧', part: 2 },
  { en: 'talk', he: 'לדבר', pic: '🗣️', part: 2 },
  { en: 'want', he: 'לרצות / רוצה', pic: null, part: 2 },
  // Part 3
  { en: 'board', he: 'לוח', pic: null, part: 3 },
  { en: 'book', he: 'ספר', pic: '📕', part: 3 },
  { en: 'chair', he: 'כיסא', pic: '🪑', part: 3 },
  { en: 'eraser', he: 'מחק', pic: null, part: 3 },
  { en: 'homework', he: 'שיעורי בית', pic: '📝', part: 3 },
  { en: 'lunch', he: 'ארוחת צהריים', pic: '🥪', part: 3 },
  { en: 'need', he: 'צריך / צריכה', pic: null, part: 3 },
  { en: 'notebook', he: 'מחברת', pic: '📓', part: 3 },
  { en: 'paper', he: 'נייר / דף', pic: '📄', part: 3 },
  { en: 'pencil', he: 'עיפרון', pic: '✏️', part: 3 },
  { en: 'thanks', he: 'תודה', pic: '🙏', part: 3 },
  // Part 4
  { en: 'address', he: 'כתובת', pic: '📬', part: 4 },
  { en: 'food', he: 'אוכל', pic: '🍔', part: 4 },
  { en: 'me', he: 'אני / אותי / לי', pic: '🙋', part: 4 },
  { en: 'meet', he: 'לפגוש / להכיר', pic: '🤝', part: 4 },
  { en: 'please', he: 'בבקשה', pic: null, part: 4 },
  { en: 'phone number', he: 'מספר טלפון', pic: '☎️', part: 4 },
  { en: 'pupil', he: 'תלמיד / תלמידה', pic: '🧑‍🎓', part: 4 },
  { en: 'see', he: 'לראות', pic: '👀', part: 4 },
  { en: 'write', he: 'לכתוב', pic: '✍️', part: 4 },
  // מילים נוספות מהסיפורים
  { en: 'red', he: 'אדום', pic: '🟥', part: 5 },
  { en: 'blue', he: 'כחול', pic: '🟦', part: 5 },
  { en: 'green', he: 'ירוק', pic: '🟩', part: 5 },
  { en: 'yellow', he: 'צהוב', pic: '🟨', part: 5 },
  { en: 'orange', he: 'כתום', pic: '🟧', part: 5 },
  { en: 'brown', he: 'חום', pic: '🟫', part: 5 },
  { en: 'white', he: 'לבן', pic: '⬜', part: 5 },
  { en: 'big', he: 'גדול', pic: null, part: 5 },
  { en: 'small', he: 'קטן', pic: null, part: 5 },
  { en: 'dog', he: 'כלב', pic: '🐕', part: 5 },
  { en: 'fish', he: 'דג', pic: '🐟', part: 5 },
  { en: 'shop', he: 'חנות', pic: '🏪', part: 5 },
  { en: 'phone', he: 'טלפון', pic: '📱', part: 5 },
  { en: 'dolphin', he: 'דולפין', pic: '🐬', part: 5 },
  { en: 'elephant', he: 'פיל', pic: '🐘', part: 5 },
  { en: 'music', he: 'מוזיקה', pic: '🎵', part: 5 },
  { en: 'art', he: 'אומנות', pic: '🎨', part: 5 },
  { en: 'math', he: 'חשבון', pic: '🔢', part: 5 },
  { en: 'sports', he: 'ספורט', pic: '⚽', part: 5 },
  { en: 'computers', he: 'מחשבים', pic: '💻', part: 5 },
];

const DAYS = [
  { en: 'Sunday', he: 'יום ראשון' },
  { en: 'Monday', he: 'יום שני' },
  { en: 'Tuesday', he: 'יום שלישי' },
  { en: 'Wednesday', he: 'יום רביעי' },
  { en: 'Thursday', he: 'יום חמישי' },
  { en: 'Friday', he: 'יום שישי' },
  { en: 'Saturday', he: 'יום שבת' },
];

/* משפט ↔ תמונה */
const SENT_PICS = [
  { en: 'I have a dog.', pic: '🐕' },
  { en: 'I have a bird. It can fly.', pic: '🐦✈️' },
  { en: 'I live in the red house.', pic: '🟥🏠' },
  { en: 'The teacher is at school.', pic: '👩‍🏫🏫' },
  { en: 'I have a pencil and a notebook.', pic: '✏️📓' },
  { en: 'I like English lessons.', pic: '❤️🔤' },
  { en: 'I have four brothers and two sisters.', pic: '👦👦👦👦👧👧' },
  { en: 'Please sit in the chairs.', pic: '🪑🪑🪑' },
  { en: 'Do you have lunch?', pic: '🥪❓' },
  { en: 'My phone number is 099-5320240.', pic: '📱🔢' },
  { en: 'I like fish.', pic: '❤️🐟' },
  { en: 'The elephant is big.', pic: '🐘' },
  { en: 'I write my homework.', pic: '✍️📝' },
  { en: 'Nice to meet you!', pic: '🤝😊' },
  { en: 'No food, please.', pic: '🚫🍔' },
  { en: 'I like to sing in English.', pic: '🎤🎶' },
  { en: 'I like English books.', pic: '❤️📚' },
  { en: 'The dog has the bag.', pic: '🐕🎒' },
];

/* השלמת משפטים – מתוך הסיפורים */
const FILL = [
  { s: 'My name ___ Karen.', a: 'is', o: ['is', 'am', 'are'], he: 'השם שלי הוא קרן.' },
  { s: 'I ___ in grade 4.', a: 'am', o: ['am', 'is', 'are'], he: 'אני בכיתה ד׳.' },
  { s: 'I am the new ___.', a: 'girl', o: ['girl', 'house', 'town'], he: 'אני הילדה החדשה.' },
  { s: 'The school is in ___.', a: 'town', o: ['town', 'lunch', 'paper'], he: 'בית הספר נמצא בעיר.' },
  { s: 'I live in the red ___.', a: 'house', o: ['house', 'pencil', 'bird'], he: 'אני גר/ה בבית האדום.' },
  { s: 'Wow! A new ___!', a: 'friend', o: ['friend', 'chair', 'food'], he: 'וואו! חבר חדש!' },
  { s: '___ do you live?', a: 'Where', o: ['Where', 'How', 'What'], he: 'איפה את/ה גר/ה?' },
  { s: 'I am ten years ___.', a: 'old', o: ['old', 'new', 'nice'], he: 'אני בן/בת עשר.' },
  { s: 'I have four brothers and two ___.', a: 'sisters', o: ['sisters', 'houses', 'lessons'], he: 'יש לי ארבעה אחים ושתי אחיות.' },
  { s: 'I like English ___.', a: 'lessons', o: ['lessons', 'chairs', 'towns'], he: 'אני אוהב/ת שיעורי אנגלית.' },
  { s: 'I have a bird. It can fly and ___.', a: 'talk', o: ['talk', 'write', 'eat'], he: 'יש לי ציפור. היא יכולה לעוף ולדבר.' },
  { s: 'She is ___.', a: 'nice', o: ['nice', 'lunch', 'board'], he: 'היא נחמדה.' },
  { s: 'I ___ a brother.', a: 'want', o: ['want', 'is', 'am'], he: 'אני רוצה אח.' },
  { s: 'I have a book, a pencil and a ___.', a: 'notebook', o: ['notebook', 'teacher', 'town'], he: 'יש לי ספר, עיפרון ומחברת.' },
  { s: 'I have a pen, an eraser and my ___.', a: 'homework', o: ['homework', 'house', 'family'], he: 'יש לי עט, מחק ושיעורי הבית שלי.' },
  { s: 'Do you have ___?', a: 'lunch', o: ['lunch', 'old', 'where'], he: 'יש לך ארוחת צהריים?' },
  { s: 'No, I don\'t. ___.', a: 'Thanks', o: ['Thanks', 'Where', 'Grade'], he: 'לא, אין לי. תודה.' },
  { s: 'Please sit in the ___.', a: 'chairs', o: ['chairs', 'birds', 'lunch'], he: 'בבקשה שבו על הכיסאות.' },
  { s: 'You need a pencil and ___.', a: 'paper', o: ['paper', 'pet', 'town'], he: 'אתם צריכים עיפרון ודף.' },
  { s: 'Look at the ___.', a: 'board', o: ['board', 'lunch', 'old'], he: 'הסתכלו על הלוח.' },
  { s: 'Hello ___,', a: 'pupils', o: ['pupils', 'houses', 'phones'], he: 'שלום תלמידים,' },
  { s: 'It\'s nice to ___ you.', a: 'meet', o: ['meet', 'fly', 'need'], he: 'נעים להכיר אתכם.' },
  { s: 'Please ___ to me.', a: 'write', o: ['write', 'fly', 'have'], he: 'בבקשה כתבו לי.' },
  { s: 'I want your name, phone number and ___.', a: 'address', o: ['address', 'lunch', 'pet'], he: 'אני רוצה את השם, מספר הטלפון והכתובת שלכם.' },
  { s: 'No ___, please.', a: 'food', o: ['food', 'teacher', 'grade'], he: 'בלי אוכל, בבקשה.' },
  { s: '___ you on Monday.', a: 'See', o: ['See', 'Fly', 'Need'], he: 'נתראה ביום שני.' },
  { s: 'English lessons are on ___ and Thursdays.', a: 'Mondays', o: ['Mondays', 'Pencils', 'Friends'], he: 'שיעורי אנגלית בימי שני וחמישי.' },
  { s: 'Chad is in ___ 4C.', a: 'class', o: ['class', 'house', 'lunch'], he: 'צ׳אד בכיתה ד׳3.' },
  { s: 'Chad\'s favorite ___ is Friday.', a: 'day', o: ['day', 'pet', 'book'], he: 'היום האהוב על צ׳אד הוא יום שישי.' },
  { s: 'Do you ___ a pencil? Yes, I need a pencil.', a: 'need', o: ['need', 'like', 'fly'], he: 'את/ה צריך/ה עיפרון? כן, אני צריך/ה עיפרון.' },
];

/* Do you have / like / want / need */
const VERBS = {
  have: { yes: 'יש לי', no: 'אין לי', q: 'יש לך' },
  like: { yes: 'אני אוהב/ת', no: 'אני לא אוהב/ת', q: 'את/ה אוהב/ת' },
  want: { yes: 'אני רוצה', no: 'אני לא רוצה', q: 'את/ה רוצה' },
  need: { yes: 'אני צריך/ה', no: 'אני לא צריך/ה', q: 'את/ה צריך/ה' },
};
const VERB_OBJECTS = {
  have: [['a dog', 'כלב'], ['a pencil', 'עיפרון'], ['a sister', 'אחות'], ['a book', 'ספר'], ['a bird', 'ציפור'], ['homework', 'שיעורי בית']],
  like: [['English', 'אנגלית'], ['my teacher', 'את המורה שלי'], ['fish', 'דגים'], ['school', 'את בית הספר'], ['my family', 'את המשפחה שלי'], ['music', 'מוזיקה']],
  want: [['a brother', 'אח'], ['a pet', 'חיית מחמד'], ['a new book', 'ספר חדש'], ['lunch', 'ארוחת צהריים'], ['a phone', 'טלפון'], ['a dog', 'כלב']],
  need: [['a pencil', 'עיפרון'], ['an eraser', 'מחק'], ['a notebook', 'מחברת'], ['paper', 'דף'], ['a chair', 'כיסא'], ['a book', 'ספר']],
};

/* שאלות ותשובות */
const QA = [
  { q: "What's your name?", qhe: 'מה שמך?', a: 'My name is Karen.', ahe: 'השם שלי הוא קרן.' },
  { q: 'What grade are you in?', qhe: 'באיזו כיתה את/ה?', a: 'I am in grade 4.', ahe: 'אני בכיתה ד׳.' },
  { q: 'Where do you live?', qhe: 'היכן את/ה גר/ה?', a: 'I live in Afula.', ahe: 'אני גר/ה בעפולה.' },
  { q: 'How old are you?', qhe: 'בן/בת כמה את/ה?', a: "I'm nine years old.", ahe: 'אני בן/בת תשע.' },
  { q: "What's your phone number?", qhe: 'מה מספר הטלפון שלך?', a: 'My phone number is 099-567890.', ahe: 'מספר הטלפון שלי הוא...' },
  { q: "What's your favorite lesson?", qhe: 'מה השיעור האהוב עליך?', a: "It's math.", ahe: 'זה חשבון.' },
  { q: 'Where is the school?', qhe: 'איפה בית הספר?', a: 'The school is in town.', ahe: 'בית הספר בעיר.' },
  { q: 'Do you have lunch?', qhe: 'יש לך ארוחת צהריים?', a: "No, I don't. Thanks.", ahe: 'לא, אין לי. תודה.' },
  { q: "What's your address?", qhe: 'מה הכתובת שלך?', a: 'My address is 3 Mango Street.', ahe: 'הכתובת שלי היא רחוב מנגו 3.' },
];

/* בונים משפט */
const BUILD = [
  { en: 'Do you have a pet?', he: 'יש לך חיית מחמד?' },
  { en: 'I have a dog.', he: 'יש לי כלב.' },
  { en: "I don't have a sister.", he: 'אין לי אחות.' },
  { en: 'Do you like English?', he: 'את/ה אוהב/ת אנגלית?' },
  { en: 'I like my teacher.', he: 'אני אוהב/ת את המורה שלי.' },
  { en: "I don't like fish.", he: 'אני לא אוהב/ת דגים.' },
  { en: 'Do you want a book?', he: 'את/ה רוצה ספר?' },
  { en: 'I want a brother.', he: 'אני רוצה אח.' },
  { en: "I don't want lunch.", he: 'אני לא רוצה ארוחת צהריים.' },
  { en: 'Do you need a pencil?', he: 'את/ה צריך/ה עיפרון?' },
  { en: 'I need a notebook.', he: 'אני צריך/ה מחברת.' },
  { en: "I don't need paper.", he: 'אני לא צריך/ה דף.' },
  { en: 'What is your name?', he: 'מה שמך?' },
  { en: 'My name is Shira.', he: 'השם שלי הוא שירה.' },
  { en: 'Where do you live?', he: 'איפה את/ה גר/ה?' },
  { en: 'I live in the green house.', he: 'אני גר/ה בבית הירוק.' },
  { en: 'How old are you?', he: 'בן/בת כמה את/ה?' },
  { en: 'I am nine years old.', he: 'אני בן/בת תשע.' },
  { en: 'What grade are you in?', he: 'באיזו כיתה את/ה?' },
  { en: 'I am in grade 4.', he: 'אני בכיתה ד׳.' },
  { en: 'I live in a big white house.', he: 'אני גר/ה בבית לבן גדול.' },
  { en: 'Look at the board.', he: 'הסתכלו על הלוח.' },
];

/* צלילים */
const SOUNDS = {
  ch: ['lunch', 'chair', 'teacher', 'Chad', 'Champ'],
  sh: ['English', 'shop', 'fish', 'Shira', 'Shelly'],
  th: ['brother', 'thanks', 'Thursday', 'three', 'mother'],
  ph: ['phone', 'dolphin', 'elephant', 'photo'],
};

/* סדר ABC */
const ABC_SETS = [
  ['Pam', 'Karen', 'Ben', 'Max'],
  ['Fran', 'Edna', 'Pedro', 'Rita'],
  ['Bob', 'Ann', 'Jet', 'Nat'],
  ['school', 'friend', 'house', 'teacher', 'grade'],
  ['pet', 'bird', 'sister', 'lesson', 'fly'],
  ['pencil', 'book', 'chair', 'eraser', 'notebook'],
  ['address', 'food', 'meet', 'write', 'see'],
  ['Tom', 'Pat', 'Mom', 'Champ', 'Tali'],
];

/* מערכת השעות של צ׳אד */
const CHAD_WEEK = {
  Sunday: ['English', 'art'],
  Monday: ['sports', 'computers'],
  Tuesday: ['math', 'computers'],
  Wednesday: ['music', 'math'],
  Thursday: ['English', 'sports'],
  Friday: ['art', 'math'],
};

/* קטעי קריאה */
const YES = 'Yes ✔️', NO = 'No ✖️';
const STORIES = [
  {
    id: 'karen', title: 'Karen Meets New Friends', page: 'עמ׳ 4', icon: '👧',
    lines: [
      ['Karen', 'Hi. My name is Karen. I am the new girl. I am in grade 4. Where is the school?'],
      ['Pam', 'Hi. My name is Pam. The school is in town.'],
      ['Karen', 'Where do you live?'],
      ['Pam', 'I live in the red house.'],
      ['Max', 'I live in the blue house.'],
      ['Ned', 'I live in the brown house.'],
      ['Karen', 'I live in the green house.'],
      ['Pam', 'The teacher lives in the orange house.'],
      ['Max', 'Wow! A new friend!'],
      ['Dog', "I'm nice to new friends."],
    ],
    questions: [
      { q: 'Karen is the new girl.', a: YES },
      { q: 'Karen is in grade 5.', a: NO },
      { q: 'The school is in town.', a: YES },
      { q: 'Pam lives in the blue house.', a: NO },
      { q: 'Ned lives in the brown house.', a: YES },
      { q: 'The teacher lives in the green house.', a: NO },
      { q: 'Who lives in the green house?', o: ['Karen', 'Pam', 'Max', 'Ned'], a: 'Karen' },
      { q: 'Max lives in the ___ house.', o: ['blue', 'red', 'brown', 'orange'], a: 'blue' },
      { q: 'The teacher lives in the ___ house.', o: ['orange', 'green', 'red', 'blue'], a: 'orange' },
      { q: 'Where is the school?', o: ['in town', 'in the red house', 'in Orange Town'], a: 'in town' },
    ],
  },
  {
    id: 'shira', title: 'Meet Shira and Shelly', page: 'עמ׳ 6-7', icon: '👭',
    lines: [
      ['Shira', 'My name is Shira. I live in Orange Town. I am ten years old. I go to Orange School. I have four brothers and two sisters. I have a dog. I like English lessons.'],
      ['Shelly', 'My name is Shelly. I live in Yellow Town. I am nine years old. I go to Yellow School. I have a sister. She is nice. I want a brother. I have a bird. It can fly and talk.'],
    ],
    questions: [
      { q: 'Shira has two sisters.', a: YES },
      { q: 'Shira likes English lessons.', a: YES },
      { q: 'Shelly can fly.', a: NO },
      { q: 'Shelly has a brother.', a: NO },
      { q: 'Shira and Shelly are nine years old.', a: NO },
      { q: 'Shelly has a sister.', a: YES },
      { q: 'Shira lives in ___ Town.', o: ['Orange', 'Yellow', 'Red'], a: 'Orange' },
      { q: 'How old is Shelly?', o: ['nine', 'ten', 'four'], a: 'nine' },
      { q: 'Shira has a ___.', o: ['dog', 'bird', 'fish'], a: 'dog' },
      { q: "Shelly's bird can ___.", o: ['fly and talk', 'swim', 'write'], a: 'fly and talk' },
      { q: 'Who wants a brother?', o: ['Shelly', 'Shira'], a: 'Shelly' },
      { q: 'Shira goes to ___.', o: ['Orange School', 'Yellow School', 'Green School'], a: 'Orange School' },
    ],
  },
  {
    id: 'bag', title: 'The Bag', page: 'עמ׳ 8-9', icon: '🎒',
    lines: [
      ['Tom', 'Look, Pat. I have a book, a pencil and a notebook.'],
      ['Pat', 'I have a pen, an eraser and my homework.'],
      ['Mom', 'Do you have lunch?'],
      ['Tom', "No, I don't. Thanks."],
      ['Champ', 'Oh no! The bag!'],
      ['Mom', 'Wow! Look at the dog.'],
      ['Champ', 'Tom, Tom! The bag!'],
      ['Teacher', 'Good morning, boys and girls. Please sit in the chairs. You need a pencil and paper. Look at the board.'],
      ['Tom', 'Oh, my bag! Thanks, Champ!'],
    ],
    questions: [
      { q: 'Who says: "I have my homework."?', o: ['Pat', 'Tom', 'Mom', 'Champ'], a: 'Pat' },
      { q: 'Who says: "I have a notebook."?', o: ['Tom', 'Pat', 'Mom', 'Champ'], a: 'Tom' },
      { q: 'Who says: "The bag!"?', o: ['Champ', 'Tom', 'Pat', 'Mom'], a: 'Champ' },
      { q: 'Who says: "Thanks."?', o: ['Tom', 'Pat', 'Mom', 'Champ'], a: 'Tom' },
      { q: 'Who says: "Do you have lunch?"', o: ['Mom', 'Tom', 'Pat', 'Champ'], a: 'Mom' },
      { q: 'Tom needs ___ at school.', o: ['a pencil', 'an eraser', 'a dog'], a: 'a pencil' },
      { q: 'Tom has ___ at school.', o: ['a pencil', 'paper', 'lunch'], a: 'a pencil' },
      { q: 'Champ helps ___.', o: ['Tom', 'Pat', 'Mom'], a: 'Tom' },
      { q: 'Champ is a dog.', a: YES },
      { q: 'Tom has lunch.', a: NO },
      { q: 'Pat has an eraser.', a: YES },
    ],
  },
  {
    id: 'tali', title: 'The New Teacher', page: 'עמ׳ 10-11', icon: '📱',
    lines: [
      ['Tali', 'Hello pupils, My name is Tali. I\'m your new English teacher. It\'s nice to meet you.'],
      ['Tali', 'Please write to me. I want your name, phone number and address.'],
      ['Tali', 'English lessons are on Mondays and Thursdays.'],
      ['Tali', 'You need a book, a notebook and a pencil. No food, please. See you on Monday. Tali'],
      ['Amit', "Hi, Tali. I'm Amit. My phone number is 099-5320240. My address is 3 Mango Street. I like English books."],
      ['Yuval', "Hi, Tali. I'm Yuval. My phone number is 099-6473281. My address is 12 Lemon Street. I like to sing in English."],
    ],
    questions: [
      { q: 'Tali is writing to the pupils.', a: YES },
      { q: 'Tali is a pupil.', a: NO },
      { q: 'Tali wants phone numbers.', a: YES },
      { q: 'English lessons are on Tuesdays.', a: NO },
      { q: 'English lessons are on ___.', o: ['Mondays and Thursdays', 'Sundays and Fridays', 'Tuesdays'], a: 'Mondays and Thursdays' },
      { q: 'The pupils need ___.', o: ['a book, a notebook and a pencil', 'food and a phone', 'a dog and a bird'], a: 'a book, a notebook and a pencil' },
      { q: 'Food in class is OK.', a: NO },
      { q: 'Who likes to sing in English?', o: ['Yuval', 'Amit', 'Tali'], a: 'Yuval' },
      { q: 'Who likes English books?', o: ['Amit', 'Yuval', 'Tali'], a: 'Amit' },
      { q: "Amit's address is ___.", o: ['3 Mango Street', '12 Lemon Street', 'Orange Town'], a: '3 Mango Street' },
      { q: "Yuval's phone number is ___.", o: ['099-6473281', '099-5320240', '099-567890'], a: '099-6473281' },
    ],
  },
  {
    id: 'chad', title: 'Chad at School', page: 'עמ׳ 12-13', icon: '📅',
    lines: [
      ['', 'Chad is in class 4C. Look at Chad\'s week at school:'],
      ['', 'Music is on Wednesday.'],
      ['', 'English is on Sunday and Thursday.'],
      ['', 'Art is on Sunday and Friday.'],
      ['', 'Math is on Tuesday, Wednesday and Friday.'],
      ['', 'The class learns sports on Monday and Thursday.'],
      ['', 'The class learns computers on Monday and Tuesday.'],
      ['', "Chad's favorite day is Friday."],
    ],
    questions: [
      { q: 'Chad learns ... on Tuesday. (2 answers)', o: ['computers', 'math', 'sports'], a: ['computers', 'math'] },
      { q: 'Chad learns ... on Sunday. (2 answers)', o: ['English', 'math', 'art'], a: ['English', 'art'] },
      { q: 'Chad learns ... on Wednesday. (2 answers)', o: ['computers', 'music', 'math'], a: ['music', 'math'] },
      { q: 'Chad learns ... on Monday. (2 answers)', o: ['sports', 'music', 'computers'], a: ['sports', 'computers'] },
      { q: 'Chad learns ... on Thursday. (2 answers)', o: ['English', 'sports', 'art'], a: ['English', 'sports'] },
      { q: "Chad's favorite day is ___.", o: ['Friday', 'Monday', 'Sunday'], a: 'Friday' },
      { q: 'Chad is in class ___.', o: ['4C', '4A', '5C'], a: '4C' },
      { q: 'Music is on ___.', o: ['Wednesday', 'Sunday', 'Friday'], a: 'Wednesday' },
      { q: 'Chad learns math three days a week.', a: YES },
    ],
  },
];
