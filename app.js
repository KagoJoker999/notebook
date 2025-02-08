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

    // 创建新笔记元素
    const noteElement = document.createElement('div');
    noteElement.className = 'note-item';
    
    // 设置笔记内容
    noteElement.innerHTML = `
        <div class="note-content">${content}</div>
        <div class="note-time">${new Date().toLocaleString()}</div>
        <div class="note-actions">
            <button class="ios-button-small edit-btn">编辑</button>
            <button class="ios-button-small copy-btn">复制</button>
            <button class="ios-button-small delete-btn">删除</button>
        </div>
    `;
    
    // 添加事件监听器
    const editBtn = noteElement.querySelector('.edit-btn');
    const copyBtn = noteElement.querySelector('.copy-btn');
    const deleteBtn = noteElement.querySelector('.delete-btn');
    
    // 编辑按钮
    editBtn.addEventListener('click', () => {
        const contentDiv = noteElement.querySelector('.note-content');
        const timeDiv = noteElement.querySelector('.note-time');
        const newContent = prompt('编辑笔记', contentDiv.textContent);
        if (newContent !== null && newContent.trim() !== '') {
            contentDiv.textContent = newContent.trim();
            timeDiv.textContent = new Date().toLocaleString() + ' (已编辑)';
        }
    });
    
    // 复制按钮
    copyBtn.addEventListener('click', () => {
        const contentDiv = noteElement.querySelector('.note-content');
        navigator.clipboard.writeText(contentDiv.textContent).then(() => {
            alert('已复制到剪贴板');
        });
    });
    
    // 删除按钮
    deleteBtn.addEventListener('click', () => {
        if (confirm('确定要删除这条笔记吗？')) {
            noteElement.remove();
        }
    });
    
    // 将新笔记添加到列表开头
    notesList.insertBefore(noteElement, notesList.firstChild);
    
    // 清空输入框
    noteInput.value = '';
    remainingChars.textContent = MAX_CHARS;
});

// AI分析功能
analyzeButton.addEventListener('click', async () => {
    const notes = Array.from(notesList.querySelectorAll('.note-content'))
        .map(div => div.textContent);
    
    if (notes.length === 0) {
        alert('没有可分析的笔记');
        return;
    }

    try {
        const allContent = notes.join('\n');
        analysisResult.textContent = '正在分析中...';
        
        const API_KEY = 'AIzaSyAjki8i-hiPjKG8DD35FRUFC83IzttRmXo';
        const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `请分析以下笔记内容，总结主要主题、关键词和情感倾向，并给出建议：\n\n${allContent}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('API请求失败');
        }

        const result = await response.json();
        const analysis = result.candidates[0].content.parts[0].text;
        
        // 格式化分析结果
        analysisResult.innerHTML = analysis
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .map(line => `<p>${line}</p>`)
            .join('');

    } catch (error) {
        console.error('分析失败:', error);
        analysisResult.textContent = '分析失败，请稍后重试';
    }
}); 