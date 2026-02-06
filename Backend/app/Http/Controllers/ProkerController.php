<?php

namespace App\Http\Controllers;

use App\Models\Proker; // <--- PENTING: Kita pakai Model biar canggih
use Illuminate\Http\Request;

class ProkerController extends Controller
{
    // 1. AMBIL SEMUA DATA
    public function index() {
        // Mengambil semua data dan otomatis urutkan dari yang terbaru
        return response()->json(Proker::orderBy('startDate', 'asc')->get());
    }

    // 2. SIMPAN BARU
    public function store(Request $request) {
        // Validasi dulu biar data ga aneh-aneh
        $validated = $request->validate([
            'name' => 'required',
            'division' => 'required',
            'startDate' => 'required',
            'endDate' => 'required',
            'time' => 'nullable',
            'description' => 'nullable',
            'link' => 'nullable',
        ]);

        // Simpan pakai Model (Otomatis isi created_at & updated_at)
        $proker = Proker::create($validated);

        // Kembalikan data proker yang baru dibuat (biar Frontend senang)
        return response()->json([
            'message' => 'Sukses disimpan',
            'data' => $proker
        ], 201);
    }

    // 3. UPDATE / EDIT (Ini yang tadi kurang!)
    public function update(Request $request, $id) {
        $proker = Proker::find($id);

        if (!$proker) {
            return response()->json(['message' => 'Proker tidak ditemukan'], 404);
        }

        $proker->update($request->all());

        return response()->json([
            'message' => 'Sukses diupdate',
            'data' => $proker
        ]);
    }

    // 4. HAPUS
    public function destroy($id) {
        $proker = Proker::find($id);
        
        if (!$proker) {
            return response()->json(['message' => 'Proker tidak ditemukan'], 404);
        }

        $proker->delete();
        return response()->json(['message' => 'Berhasil dihapus']);
    }
}
