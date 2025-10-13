<?php

namespace App\Http\Controllers;

use App\Models\CustomText;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Shopify\Auth\Session;
use Shopify\Clients\Graphql;

class CustomTextController extends Controller
{
    public function addText(Request $request, Session $session): JsonResponse
    {
//        /**+
//         *
//         */
//        $shopifySession = $request->get('shopifySession');
//        $dbSession = \App\Models\Session::where('shopify_session_id', $shopifySession->getId())->first();
//        print_r();
//        exit;
        dd($request->all());
        $resource = CustomText::create(['text' => $request->custom_text]);
        $shop = $session->shop;
        $client = new Graphql($shop, $session->accessToken);

        $input = [
            'namespace' => 'custom',
            'key' => 'custom_note',
            'type' => 'single_line_text_field',
            'ownerType' => 'CUSTOMER',
            'name' => $request->custom_text,
        ];

        $query = <<<'GRAPHQL'
        mutation metafieldDefinitionCreate($input: MetafieldDefinitionInput!) {
            metafieldDefinitionCreate(metafieldDefinition: $input) {
                metafieldDefinition {
                    id
                    namespace
                    key
                    type
                }
                userErrors {
                    field
                    message
                }
            }
        }
        GRAPHQL;

        $response = $client->request($query, ['input' => $input]);

        if (isset($response['data']['metafieldDefinitionCreate']['userErrors'][0])) {
            return response()->json(['error' => $response['data']['metafieldDefinitionCreate']['userErrors']], 400);
        }

        return response()->json($response['data']['metafieldDefinitionCreate']['metafieldDefinition']);
    }
}
