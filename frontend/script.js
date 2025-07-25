// 🌐 API Endpoint (Local or Deployed)
const API_BASE = location.hostname.includes("localhost")
    ? "http://127.0.0.1:5000"
    : "https://bb7non92hk.execute-api.ap-south-1.amazonaws.com";

// ✨ DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadZone = document.getElementById('uploadZone');
const uploadStats = document.getElementById('uploadStats');
const filesPreview = document.getElementById('filesPreview');
const uploadButton = document.getElementById('uploadButton');
const clearButton = document.getElementById('clearButton');
const fileCount = document.getElementById('fileCount');
const totalSize = document.getElementById('totalSize');
const uploadStatus = document.getElementById('uploadStatus');
const resultsSection = document.getElementById('resultsSection');
const resultsMessage = document.getElementById('resultsMessage');
const downloadButton = document.getElementById('downloadButton');
const uploadActions = document.getElementById('uploadActions');
const cliSuggestion = document.getElementById('cliSuggestion');
const notifications = document.getElementById('notifications');

// 📏 Format bytes to human-readable
function formatSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

// 🔔 Show toast notifications
function showNotification(type, title, message) {
    const notif = document.createElement('div');
    notif.className = `notification ${type} show`;
    notif.innerHTML = `
        <div class="notification-icon">💡</div>
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>`;
    notifications.appendChild(notif);
    setTimeout(() => notif.remove(), 4000);
}

// 🔄 Scroll helpers
function scrollToUpload() {
    document.getElementById("upload").scrollIntoView({ behavior: 'smooth' });
}
function scrollToFeatures() {
    document.getElementById("features").scrollIntoView({ behavior: 'smooth' });
}
function scrollToResults() {
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// 📁 Handle file selection
fileInput.addEventListener('change', () => {
    const files = Array.from(fileInput.files);
    if (files.length === 0) return;

    const totalBytes = files.reduce((acc, file) => acc + file.size, 0);
    const totalGB = totalBytes / (1024 * 1024 * 1024);

    if (totalGB > 1) {
        cliSuggestion.style.display = 'block';
        clearSelection();
        return;
    }

    cliSuggestion.style.display = 'none';
    uploadStats.style.display = 'flex';
    uploadActions.style.display = 'flex';
    filesPreview.innerHTML = '';

    files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon-small">📄</div>
                <div class="file-details">
                    <h4>${file.webkitRelativePath || file.name}</h4>
                    <p>${file.type || 'Unknown type'}</p>
                </div>
            </div>
            <div class="file-size">${formatSize(file.size)}</div>
        `;
        filesPreview.appendChild(fileItem);
    });

    fileCount.textContent = files.length;
    totalSize.textContent = formatSize(totalBytes);
    uploadStatus.textContent = 'Ready';
});

// 🖱 Drag-and-drop
uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
});
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    fileInput.files = e.dataTransfer.files;
    fileInput.dispatchEvent(new Event('change'));
});

// 📂 Click-to-select
uploadZone.addEventListener('click', () => fileInput.click());

// 🚀 Upload logic
uploadButton.addEventListener('click', async () => {
    const files = Array.from(fileInput.files);
    if (files.length === 0) {
        showNotification('error', 'No Files', 'Please select your course folder.');
        return;
    }

    uploadButton.disabled = true;
    uploadStatus.textContent = 'Uploading...';
    uploadButton.querySelector('.button-text').style.display = 'none';
    uploadButton.querySelector('.button-loader').style.display = 'inline-block';

    try {
        // 1️⃣ Get pre-signed URLs
        const presignRes = await fetch(`${API_BASE}/get-presigned-urls`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                files: files.map(f => f.webkitRelativePath || f.name)
            })
        });

        if (!presignRes.ok) throw new Error('Failed to get pre-signed URLs');
        const data = await presignRes.json();
        const urls = data.urls;
        const uploadedKeys = [];

        // 2️⃣ Upload each file
        for (const file of files) {
            const key = file.webkitRelativePath || file.name;
            const presigned = urls[key];
            if (!presigned) {
                throw new Error(`Missing pre-signed URL for file: ${key}`);
            }

            const res = await fetch(presigned.upload_url, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type || 'application/octet-stream'
                },
                body: file
            });

            if (!res.ok) {
                throw new Error(`Upload failed for: ${key}`);
            }

            uploadedKeys.push(presigned.file_key);
        }

        showNotification('success', 'Upload Complete', 'All files uploaded to S3 successfully.');
        uploadStatus.textContent = 'Uploaded';
        resultsSection.style.display = 'block';
        scrollToResults();

    } catch (err) {
        showNotification('error', 'Upload Failed', err.message);
        uploadStatus.textContent = 'Failed';
    } finally {
        uploadButton.disabled = false;
        uploadButton.querySelector('.button-text').style.display = 'inline-block';
        uploadButton.querySelector('.button-loader').style.display = 'none';
    }
});

// 🧹 Clear selection
function clearSelection() {
    fileInput.value = '';
    fileCount.textContent = '0';
    totalSize.textContent = '0 MB';
    uploadStatus.textContent = 'Ready';
    uploadStats.style.display = 'none';
    uploadActions.style.display = 'none';
    filesPreview.innerHTML = '';
    resultsSection.style.display = 'none';
}

// 🧼 Clear button
clearButton.addEventListener('click', () => {
    clearSelection();
    cliSuggestion.style.display = 'none';
});

// ♻️ Reset from other components
function resetUpload() {
    clearSelection();
    scrollToUpload();
}
