// GitLab Animated Avatar Workaround
// 1. First, upload your GIF in GitLab's avatar upload box
// 2. Open Network tab in DevTools, filter by "avatar" or "upload"
// 3. Find the request that contains your GIF as base64 (before it gets converted to PNG)
// 4. Copy that base64 string (should start with "data:image/gif;base64,...")

// Replace YOUR_GIF_BASE64_HERE with your captured GIF base64 string
const gifBase64Raw = "YOUR_GIF_BASE64_HERE"
// Strip prefix if present
const gifBase64 = gifBase64Raw.replace(/^data:image\/\w+;base64,/, '');

async function uploadAvatar() {
    const token = document.querySelector('meta[name="csrf-token"]')?.content;
    
    const byteString = atob(gifBase64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/png' });
    const file = new File([blob], 'avatar.png', { type: 'image/png' });
    
    const form = new FormData();
    form.append('avatar', file);  // Field name is "avatar"
    
    const resp = await fetch('/api/v4/user/avatar', {
        method: 'PUT',
        headers: { 'X-CSRF-Token': token },
        body: form
    });
    
    console.log('Status:', resp.status);
    console.log('Response:', await resp.text());
}

uploadAvatar();

