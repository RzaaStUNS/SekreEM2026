<?php
// Nyalakan semua error reporting PHP
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>🕵️‍♂️ Detektif Server Vercel</h1>";

// 1. Cek Folder Vendor (Otak Laravel)
echo "<h3>1. Cek Folder Vendor</h3>";
$vendorPath = __DIR__ . '/../vendor/autoload.php';
if (file_exists($vendorPath)) {
    echo "✅ Vendor ditemukan di: " . realpath($vendorPath) . "<br>";
    echo "   (Artinya 'composer install' berhasil)";
} else {
    echo "❌ CRITICAL: File autoload.php TIDAK ADA! <br>";
    echo "   (Artinya folder 'vendor' hilang/kosong. Build gagal install dependency.)";
}

// 2. Cek File Bootstrap Laravel
echo "<h3>2. Cek File Public & Bootstrap</h3>";
$publicPath = __DIR__ . '/../public/index.php';
if (file_exists($publicPath)) {
    echo "✅ Public index ditemukan.<br>";
} else {
    echo "❌ Public index hilang.<br>";
}

// 3. Intip Isi Folder Utama
echo "<h3>3. Daftar File di Folder Backend</h3>";
echo "<pre>";
// Menampilkan semua file di folder Backend (satu tingkat di atas folder api)
print_r(scandir(__DIR__ . '/../'));
echo "</pre>";

echo "<h3>4. Cek Versi PHP</h3>";
echo "PHP Version: " . phpversion();
?>
