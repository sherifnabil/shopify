<?php

use App\Http\Controllers\AppThemeExtension;
use App\Http\Controllers\CustomTextController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/', function () {
    return "Hello API";
});

Route::get('app/status', [AppThemeExtension::class, 'checkAppStatus'])->middleware('shopify.auth');

Route::post('custom/save', [CustomTextController::class, 'saveNote'])->middleware('shopify.auth');
Route::post('custom/get', [CustomTextController::class, 'get'])->middleware('shopify.auth');

// Record heartbeat from theme app embed (unauthenticated, storefront)
Route::post('/extension-heartbeat', function (Request $request) {
    $shop = $request->query('shop');
    if (!$shop) {
        return response()->noContent();
    }
    Cache::put("ext:heartbeat:$shop", now()->timestamp, now()->addMinutes(10));
    return response()->noContent();
});

// Report status to embedded admin (authenticated)
Route::middleware(['shopify.auth'])->get('/extension-status', function (Request $request) {
    $sessionUser = $request->user();
    $shop = method_exists($sessionUser, 'getAttribute') ? $sessionUser->getAttribute('name') : ($sessionUser->name ?? null);
    if (!$shop) {
        $shop = $request->query('shop');
    }
    $last = $shop ? Cache::get("ext:heartbeat:$shop") : null;
    $alive = $last && (now()->timestamp - (int)$last) < 600;
    return response()->json(['enabled' => (bool)$alive]);
});
