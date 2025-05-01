// 設定學測日期（2026年1月16日）
const examDate = new Date('2026-01-16T08:00:00').getTime();

// 更新倒數計時
function updateCountdown() {
    const now = new Date().getTime();
    const distance = examDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(3, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// 每秒更新一次倒數計時
setInterval(updateCountdown, 1000);
updateCountdown();

// 笑話資料庫
const jokes = [
    "老師說這題很簡單，我想了三小時還沒想通，看來我的腦子跟老師不住在同一個次元。",
    "讀書讀到懷疑人生，翻開課本發現全都看過，合上課本發現全都忘記。",
    "當你覺得壓力大的時候，記住，水逆只是最基本的狀態。",
    "我把讀書當作一種休息，因為我的人生已經夠累了。",
    "老師：這章很重要，考試一定會考。\n我：每章都很重要，每章都會考，我懂。",
    "媽媽說熬夜對身體不好，但複習進度對我的心靈更不好。",
    "班上第一名說這次考試很難，看來我是去當志願者了。",
    "老師：記得要每天複習。\n我：我連今天學什麼都記不得了。",
    "明天就要段考了，我的程度是在用觀念理解題目，但同學已經在用觀念理解人生了。",
    "老師：這題很簡單，誰要來回答？\n全班：...\n老師：好，那我隨機點名。\n我：（開始祈禱）"
];

// 取得今日笑話
function getTodayJoke() {
    const today = new Date();
    const jokeIndex = (today.getMonth() * 31 + today.getDate()) % jokes.length;
    return jokes[jokeIndex];
}

// 顯示笑話
function displayJoke() {
    const jokeElement = document.getElementById('joke');
    const randomIndex = Math.floor(Math.random() * jokes.length);
    jokeElement.textContent = jokes[randomIndex];
}

// 初始顯示今日笑話
document.getElementById('joke').textContent = getTodayJoke();

// 點擊按鈕更換笑話
document.getElementById('newJoke').addEventListener('click', displayJoke);

// 日記功能
class DiaryManager {
    constructor() {
        this.diaries = JSON.parse(localStorage.getItem('diaries')) || [];
        this.diaryText = document.getElementById('diaryText');
        this.diaryList = document.getElementById('diaryList');
        this.saveDiaryBtn = document.getElementById('saveDiary');
        this.viewDiariesBtn = document.getElementById('viewDiaries');
        this.moodLevel = document.getElementById('moodLevel');
        
        this.setupEventListeners();
        this.isViewingDiaries = false;
        this.setupEmojiPicker();
    }

    setupEventListeners() {
        this.saveDiaryBtn.addEventListener('click', () => this.saveDiary());
        this.viewDiariesBtn.addEventListener('click', () => this.toggleDiaryList());
    }

    setupEmojiPicker() {
        const emojiButtons = document.querySelectorAll('.emoji-btn');
        emojiButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const emoji = btn.getAttribute('data-emoji');
                const cursorPos = this.diaryText.selectionStart;
                const textBefore = this.diaryText.value.substring(0, cursorPos);
                const textAfter = this.diaryText.value.substring(cursorPos);
                this.diaryText.value = textBefore + emoji + textAfter;
                this.diaryText.focus();
                const newCursorPos = cursorPos + emoji.length;
                this.diaryText.setSelectionRange(newCursorPos, newCursorPos);
            });
        });
    }

    getMoodEmoji(level) {
        const moods = {
            '1': '😭',
            '2': '😢',
            '3': '😐',
            '4': '😊',
            '5': '🥳'
        };
        return moods[level] || '😐';
    }

    saveDiary() {
        const text = this.diaryText.value.trim();
        if (!text) {
            alert('請輸入日記內容！');
            return;
        }

        const diary = {
            id: Date.now(),
            text: text,
            moodLevel: this.moodLevel.value,
            date: new Date().toLocaleString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        this.diaries.unshift(diary);
        localStorage.setItem('diaries', JSON.stringify(this.diaries));
        this.diaryText.value = '';
        
        if (this.isViewingDiaries) {
            this.renderDiaries();
        }

        alert('日記已儲存！');
    }

    toggleDiaryList() {
        this.isViewingDiaries = !this.isViewingDiaries;
        this.diaryList.classList.toggle('d-none');
        this.viewDiariesBtn.textContent = this.isViewingDiaries ? '隱藏日記' : '查看日記';
        
        if (this.isViewingDiaries) {
            this.renderDiaries();
        }
    }

    renderDiaries() {
        this.diaryList.innerHTML = this.diaries.map(diary => `
            <div class="diary-entry">
                <div class="diary-date">${diary.date}</div>
                <div class="diary-mood">${this.getMoodEmoji(diary.moodLevel)}</div>
                <div class="diary-content">${diary.text}</div>
            </div>
        `).join('');
    }
}

// 初始化日記功能
const diaryManager = new DiaryManager();