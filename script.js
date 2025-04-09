let language = 'en';
let currentQuestion = 0;
let score = 0;
let currentPage = 0;
let totalPages = 0;
let messagePages = {};

const quizData = {
  en: {
    questions: [
      { question: "Between this two, which one?", answers: ["Real Madrid CF", "FC Barcelona"], correct: "FC Barcelona" },
      { question: "What was the first singer you actually made me addicted for... well, I'm still addicted...", answers: ["Lady Gaga", "Panic! At the Disco", "Arctic Monkeys", "Camila Cabello"], correct: "Arctic Monkeys" },
      { question: "Which country we'll be together and enjoy the climate?", answers: ["Japan", "China", "Argentina", "Canada"], correct: "Canada" },
      { question: "If this feelin' flows both ways?", answers: ["You couldnt blame me, though", "Sad to see you go...", "You dont have to run...", "Yeah, I got bitter when you got cold"], correct: "Sad to see you go..." },
      { question: "What are we? More than you're thinking", answers: ["Cousins", "Best friends", "Bitches", "Strangers"], correct: "Cousins" },
    ],
    results: [
      "Impossible... I'll cry now",
      "Outch, are we even friends?",
      "Uhm... cheers?",
      "Congrats! You'll still get a surprise!",
      "Almost Mari, probably you choose girl in red's lyrics instead... hehe",
      "Damn, you really know about our friendship!"
    ],
    surpriseText: "Click here",
    finalMessage: `First things first, you should be aware my English is pretty rusty compared to yours so... uhm... 🤷🏻‍♂️

Hey, uhm, it's pretty complicated to open up like that, mainly to someone I consider my sister, literally... we're so alike- it- it scares me sometimes...

Anyway, I wanted to make sure this year you had something special, since you're so special to me as well, hope you enjoyed the little quiz, and I'm glad you choose English as the language being executed right now. Hah, you have no idea how much I tried to make this shit work out, lmao.

How have you been? Kinda distant, I don't really know why I'm being this clingy to you guys this year, have no idea, seriously, maybe I just consider you all as part of my family, more than my own family.

I can tell you've been through a lot lately, school, personal live, relationship, it can be stressfull, I know, but you'll never be alone, trust me. Whenever you feel stressout, or just craving to end everything, give up even, don't forget you're more than capable of making through it! You're more than enough. At the end, I'll be there, cheering for you, so loud, that you won't even notice the ones not cheering for you.

So that's it, Mariana, bestie, cousing, not from the blood, but from the heart. The trust, the love, not romantic, but platonic. Hope you have an amazing birthday, see ya 🎂🎉`,
    nextPage: "Next Page",
    prevPage: "Previous Page",
    pageIndicator: "Page {current} of {total}"
  },
  pt: {
    questions: [
      { question: "Entre esses dois, qual você escolheria?", answers: ["Real Madrid CF", "FC Barcelona"], correct: "FC Barcelona" },
      { question: "Qual foi o primeiro cantor/banda que você realmente me fez viciar... bom, ainda sou viciado...", answers: ["Lady Gaga", "Panic! At the Disco", "Arctic Monkeys", "Camila Cabello"], correct: "Arctic Monkeys" },
      { question: "Em qual país a gente vai estar curtindo o clima?", answers: ["Japan", "China", "Argentina", "Canada"], correct: "Canada" },
      { question: "If this feelin' flows both ways?", answers: ["You couldnt blame me, though", "Sad to see you go...", "You dont have to run...", "Yeah, I got bitter when you got cold"], correct: "Sad to see you go..." },
      { question: "O que a gente é? Mais do que você está pensando", answers: ["Cousins", "Best friends", "Bitches", "Strangers"], correct: "Cousins" },
    ],
    results: [
      "Impossível... agora eu vou chorar.",
      "Eita, será que a gente é mesmo amigo?",
      "Uhm... saúde?",
      "Mandou bem. Ainda assim, você vai receber uma surpresa.",
      "Quase, Mari. Aposto que você escolheu uma letra da girl in red... hehe",
      "Caramba, você realmente sabe tudo sobre a nossa amizade..."
    ],
    surpriseText: "Clique aqui",
    finalMessage: `Ei, uhm, é meio complicado me abrir assim, principalmente pra alguém que eu considero como uma irmã, literalmente... a gente é tão parecido que... às vezes até me assusta.

Enfim, eu só queria garantir que esse ano você tivesse algo especial, já que você também é muito especial pra mim. Espero que tenha curtido o quiz, e fico feliz que tenha escolhido português como a linguagem sendo executada agora. Hah, você não faz ideia do quanto eu tentei fazer essa parada funcionar, e como ta estranho falar isso em português- geralmente eu não me abro na minha língua materna.

Como você tem estado? Meio distante... eu nem sei direito por que tô tão apegado a vocês esse ano, de verdade, talvez eu só considere vocês como minha família, mais do que a minha própria família.

Dá pra ver que você tem passado por muita coisa ultimamente- escola, vida pessoal, relacionamento... pode ser bem estressante, eu sei. Mas você nunca vai estar sozinha, sério. Sempre que se sentir sobrecarregada, ou com vontade de desistir de tudo, não esquece que você é mais do que capaz de passar por isso. Você é mais do que o suficiente. E no fim, eu vou estar lá, torcendo por você tão alto, que nem vai notar quem não tá torcendo.

Então é isso, Mariana, melhor amiga, prima, não de sangue, mas de coração. A confiança, o amor- não romântico, mas platônico. Espero que você tenha um aniversário incrível. A gente se vê por ai 🎂🎉`,
    nextPage: "Próxima Página",
    prevPage: "Página Anterior",
    pageIndicator: "Página {current} de {total}"
  }
};

// iOS Safari fixes
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btn-en').addEventListener('click', function() {
    startApp('en');
  });
  document.getElementById('btn-pt').addEventListener('click', function() {
    startApp('pt');
  });

  document.addEventListener('touchmove', function(e) {
    if (e.target.tagName === 'BUTTON') {
      e.preventDefault();
    }
  }, { passive: false });
});

function splitMessageIntoPages(message) {
  const paragraphs = message.split('\n\n').filter(p => p.trim());
  const totalParagraphs = paragraphs.length;
  const paragraphsPerPage = Math.ceil(totalParagraphs / 3);

  const pages = [];
  for (let i = 0; i < totalParagraphs; i += paragraphsPerPage) {
    const pageContent = paragraphs.slice(i, i + paragraphsPerPage).join('\n\n');
    pages.push(pageContent);
  }

  return pages;
}

function startApp(lang) {
  language = lang;
  currentQuestion = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  const app = document.getElementById('app');
  const q = quizData[language].questions[currentQuestion];

  const questionCard = document.createElement('div');
  questionCard.className = 'question-card slide-in';

  questionCard.innerHTML = `
    <h2>Q${currentQuestion + 1}: ${q.question}</h2>
    <div class="answers" id="answer-buttons">
      ${q.answers.map((ans, index) => 
        `<button data-answer="${ans.replace(/"/g, '&quot;')}" id="ans-${index}">${ans}</button>`
      ).join('')}
    </div>
  `;

  app.innerHTML = '';
  app.appendChild(questionCard);

  q.answers.forEach((ans, index) => {
    const btn = document.getElementById(`ans-${index}`);
    if (btn) {
      btn.addEventListener('click', function() {
        selectAnswer(ans, btn);
      });
    }
  });
}

function selectAnswer(selected, button) {
  const correct = quizData[language].questions[currentQuestion].correct;
  const isCorrect = selected === correct;
  if (isCorrect) score++;

  button.classList.add(isCorrect ? 'correct' : 'incorrect');

  setTimeout(() => {
    const questionCard = document.querySelector('.question-card');
    questionCard.classList.add('slide-out');

    setTimeout(() => {
      currentQuestion++;
      if (currentQuestion < quizData[language].questions.length) {
        showQuestion();
      } else {
        showScore();
      }
    }, 300);
  }, 500);
}

function showScore() {
  const app = document.getElementById('app');
  const msg = quizData[language].results[score];
  const surpriseText = quizData[language].surpriseText;

  app.innerHTML = `
    <div class="score-screen">
      <h2>${score}/5</h2>
      <p>${msg}</p>
      <button id="btn-surprise">${surpriseText}</button>
    </div>
  `;

  document.getElementById('btn-surprise').addEventListener('click', showFinalMessage);
}

function showFinalMessage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="black-screen">
      <div class="popup">
        <h2>🎉</h2>
        <button id="btn-reveal">✨ ${quizData[language].surpriseText} ✨</button>
      </div>
    </div>
  `;

  document.getElementById('btn-reveal').addEventListener('click', revealMessage);
}

function revealMessage() {
  confetti({
    colors: ['#ffffff', '#c0c0c0', '#808080'],
    shapes: ['circle'],
    gravity: 0.3
  });
  
  // Add sparkle effect
  const addSparkles = () => {
    const container = document.querySelector('.final-message');
    if (!container) return;
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    container.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1500);
  };
  
  setInterval(addSparkles, 300);

  const message = quizData[language].finalMessage;
  messagePages = splitMessageIntoPages(message);
  totalPages = messagePages.length;
  currentPage = 0;

  updateMessagePage();
}

function updateMessagePage() {
  const app = document.getElementById('app');
  const pageContent = messagePages[currentPage];
  const nextPageText = quizData[language].nextPage;
  const prevPageText = quizData[language].prevPage;
  const pageIndicatorText = quizData[language].pageIndicator
    .replace('{current}', (currentPage + 1))
    .replace('{total}', totalPages);

  if (!document.querySelector('.final-message')) {
    const messageEl = document.createElement('div');
    messageEl.className = 'final-message';
    messageEl.innerHTML = `
      <div class="message-content slide-down">
        ${pageContent}
      </div>
      <div class="pagination-controls">
        ${currentPage > 0 ? `<button id="btn-prev">${prevPageText}</button>` : ''}
        ${currentPage < totalPages - 1 ? `<button id="btn-next">${nextPageText}</button>` : ''}
      </div>
      <div class="page-indicator">${pageIndicatorText}</div>
    `;
    app.innerHTML = '';
    app.appendChild(messageEl);

    setupNavigationHandlers();
  } else {
    const contentEl = document.querySelector('.message-content');
    const controls = document.querySelector('.pagination-controls');
    const pageIndicator = document.querySelector('.page-indicator');

    contentEl.classList.add('slide-up');

    setTimeout(() => {
      contentEl.innerHTML = pageContent;
      contentEl.classList.remove('slide-up');
      contentEl.classList.add('slide-down');

      controls.innerHTML = `
        ${currentPage > 0 ? `<button id="btn-prev">${prevPageText}</button>` : ''}
        ${currentPage < totalPages - 1 ? `<button id="btn-next">${nextPageText}</button>` : ''}
      `;

      pageIndicator.textContent = pageIndicatorText;

      setupNavigationHandlers();
    }, 500);
  }
  if (currentPage > 0 || currentPage < totalPages - 1) {
    const notification = document.createElement('div');
    notification.className = 'dynamic-island';
    notification.innerHTML = pageIndicatorText;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s';
      setTimeout(() => notification.remove(), 500);
    }, 1500);
  }
}

function setupNavigationHandlers() {
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigateMessage(-1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigateMessage(1));
  }
}

function navigateMessage(direction) {
  currentPage = Math.max(0, Math.min(totalPages - 1, currentPage + direction));
  updateMessagePage();
}
