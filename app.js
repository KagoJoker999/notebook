// DOM 元素
const noteInput = document.getElementById('noteInput');
const remainingChars = document.getElementById('remainingChars');
const saveButton = document.getElementById('saveButton');
const notesList = document.getElementById('notesList');
const analyzeButton = document.getElementById('analyzeButton');
const analysisResult = document.getElementById('analysisResult');
const noteTemplate = document.getElementById('noteTemplate');

// 常量
const MAX_CHARS = 2000;
const STORAGE_KEY = 'notebook_notes';

// 状态管理
let notes = loadNotes();

// 字数统计
noteInput.addEventListener('input', () => {
    const remaining = MAX_CHARS - noteInput.value.length;
    remainingChars.textContent = remaining;
});

// 保存笔记
saveButton.addEventListener('click', () => {
    const content = noteInput.value.trim();
    if (!content) {
        alert('请输入内容');
        return;
    }

    const note = {
        id: Date.now(),
        content,
        time: new Date().toLocaleString()
    };

    notes.unshift(note);
    saveNotes();
    renderNotes();
    noteInput.value = '';
    remainingChars.textContent = MAX_CHARS;
});

// 渲染笔记列表
function renderNotes() {
    notesList.innerHTML = '';
    notes.forEach(note => {
        const noteElement = noteTemplate.content.cloneNode(true);
        const noteItem = noteElement.querySelector('.note-item');
        
        noteItem.querySelector('.note-content').textContent = note.content;
        noteItem.querySelector('.note-time').textContent = note.time;
        
        // 编辑按钮
        noteItem.querySelector('.edit-btn').addEventListener('click', () => {
            const newContent = prompt('编辑笔记', note.content);
            if (newContent !== null && newContent.trim() !== '') {
                note.content = newContent.trim();
                note.time = new Date().toLocaleString() + ' (已编辑)';
                saveNotes();
                renderNotes();
            }
        });
        
        // 复制按钮
        noteItem.querySelector('.copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(note.content).then(() => {
                alert('已复制到剪贴板');
            });
        });
        
        // 删除按钮
        noteItem.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('确定要删除这条笔记吗？')) {
                notes = notes.filter(n => n.id !== note.id);
                saveNotes();
                renderNotes();
            }
        });
        
        notesList.appendChild(noteItem);
    });
}

// 保存笔记到本地存储
function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// 从本地存储加载笔记
function loadNotes() {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    return savedNotes ? JSON.parse(savedNotes) : [];
}

// AI分析功能
analyzeButton.addEventListener('click', async () => {
    if (notes.length === 0) {
        alert('没有可分析的笔记');
        return;
    }

    try {
        const allContent = notes.map(note => note.content).join('\n');
        
        // 这里需要替换为实际的 Gemini API 调用
        // const response = await fetch('YOUR_GEMINI_API_ENDPOINT', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer YOUR_API_KEY'
        //     },
        //     body: JSON.stringify({
        //         text: allContent
        //     })
        // });
        
        // const result = await response.json();
        // analysisResult.textContent = result.analysis;
        
        // 临时显示提示信息
        analysisResult.textContent = '请配置 Gemini API 密钥以启用 AI 分析功能';
    } catch (error) {
        console.error('分析失败:', error);
        analysisResult.textContent = '分析失败，请稍后重试';
    }
});

// 初始化
renderNotes(); 