<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProkerController extends Controller
{
    // Ambil semua proker dari database
    public function index() {
        return response()->json(DB::table('prokers')->get());
    }

    // Simpan proker baru
    public function store(Request $request) {
        DB::table('prokers')->insert($request->all());
        return response()->json(['message' => 'Sukses!']);
    }

    // Hapus proker
    public function destroy($id) {
        DB::table('prokers')->where('id', $id)->delete();
        return response()->json(['message' => 'Dihapus!']);
    }
}