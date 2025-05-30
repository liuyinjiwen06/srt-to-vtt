const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const message = document.getElementById('message');
const downloadBtn = document.getElementById('download-btn');
let vttBlob = null;

function showMessage(msg, color = '#e53935') {
  message.textContent = msg;
  message.style.color = color;
}

function resetUI() {
  showMessage('');
  downloadBtn.classList.add('hidden');
  vttBlob = null;
}

function srtToVtt(srt) {
  // 转换 SRT 为 VTT 格式
  // 1. 去除 BOM
  srt = srt.replace(/^\uFEFF/, '');
  // 2. 替换逗号为点
  let vtt = 'WEBVTT\n\n' + srt
    .replace(/\r\n|\r|\n/g, '\n')
    .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
  return vtt;
}

function handleFile(file) {
  resetUI();
  if (!file.name.endsWith('.srt')) {
    showMessage('只支持 .srt 文件');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    showMessage('文件过大，最大支持10MB');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const srtText = e.target.result;
      if (!/\d{2}:\d{2}:\d{2},\d{3}/.test(srtText)) {
        showMessage('文件内容格式异常或非标准SRT');
        return;
      }
      const vttText = srtToVtt(srtText);
      vttBlob = new Blob([vttText], { type: 'text/vtt' });
      showMessage('转换成功！', '#43a047');
      downloadBtn.classList.remove('hidden');
      downloadBtn.onclick = () => {
        const url = URL.createObjectURL(vttBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name.replace(/\.srt$/i, '.vtt');
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);
      };
    } catch (err) {
      showMessage('转换失败，请重试');
    }
  };
  reader.onerror = function() {
    showMessage('文件读取失败');
  };
  reader.readAsText(file);
}

fileInput.addEventListener('change', e => {
  if (e.target.files && e.target.files[0]) {
    handleFile(e.target.files[0]);
  }
});

// 拖拽上传支持
uploadArea.addEventListener('dragover', e => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', e => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
});
uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handleFile(e.dataTransfer.files[0]);
  }
});

// 点击上传区也能触发文件选择
uploadArea.addEventListener('click', () => {
  fileInput.click();
});
