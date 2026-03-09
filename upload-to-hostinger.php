<?php
// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

error_log('[upload.php] Upload request received');

// المجلد حيث سيتم حفظ الملفات
$uploadsDir = __DIR__ . '/uploads/';

// تأكد من وجود المجلد وإنشاؤه بأذونات صحيحة
if (!is_dir($uploadsDir)) {
    if (!mkdir($uploadsDir, 0755, true)) {
        error_log('[upload.php] Failed to create uploads directory: ' . $uploadsDir);
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create uploads directory']);
        exit;
    }
    error_log('[upload.php] Created uploads directory');
}

// تأكد من أن المجلد قابل للكتابة
if (!is_writable($uploadsDir)) {
    error_log('[upload.php] Uploads directory is not writable: ' . $uploadsDir);
    http_response_code(500);
    echo json_encode(['error' => 'Uploads directory is not writable']);
    exit;
}

// التحقق من وجود ملف
if (!isset($_FILES['file'])) {
    error_log('[upload.php] No file provided in request');
    http_response_code(400);
    echo json_encode(['error' => 'No file provided']);
    exit;
}

$file = $_FILES['file'];
error_log('[upload.php] File received: ' . $file['name'] . ', Type: ' . $file['type'] . ', Size: ' . $file['size']);

// التحقق من أخطاء الرفع
if ($file['error'] !== UPLOAD_ERR_OK) {
    error_log('[upload.php] Upload error: ' . $file['error']);
    http_response_code(400);
    echo json_encode(['error' => 'Upload error code: ' . $file['error']]);
    exit;
}

// أنواع الملفات المسموحة
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
if (!in_array($file['type'], $allowedTypes)) {
    error_log('[upload.php] Invalid file type: ' . $file['type']);
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file type: ' . $file['type']]);
    exit;
}

// حد أقصى للحجم (50 MB)
$maxSize = 50 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    error_log('[upload.php] File too large: ' . $file['size']);
    http_response_code(400);
    echo json_encode(['error' => 'File too large']);
    exit;
}

// تنظيف اسم الملف
$originalName = $file['name'];
$sanitized = preg_replace('/[^a-zA-Z0-9.-]/', '-', $originalName);
$sanitized = preg_replace('/--+/', '-', $sanitized);
$sanitized = strtolower($sanitized);

// إنشاء اسم فريد
$timestamp = time();
$newFilename = $timestamp . '-' . $sanitized;
$uploadPath = $uploadsDir . $newFilename;

// رفع الملف
error_log('[upload.php] Attempting to move file to: ' . $uploadPath);
if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
    error_log('[upload.php] File uploaded successfully');
    
    // الحصول على رابط الملف
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $fileUrl = $protocol . '://' . $host . '/uploads/' . $newFilename;
    
    http_response_code(200);
    echo json_encode([
        'url' => $fileUrl,
        'filename' => $originalName,
        'size' => $file['size'],
        'type' => $file['type']
    ]);
} else {
    error_log('[upload.php] Failed to move uploaded file');
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file']);
}
?>
