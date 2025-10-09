<?php

namespace App\Http\Controllers;

use App\Models\CustomText;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Artisan;

class CustomTextController extends Controller
{
    public function addText(Request $request): JsonResponse
    {


        // Artisan::call('migrate');

        $resource = CustomText::all();

        print_r(
            $request->toArray()
        );
        exit;
        return new JsonResponse($resource);
    }
}
