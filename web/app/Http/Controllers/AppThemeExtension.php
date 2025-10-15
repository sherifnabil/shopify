<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Shopify\Clients\Graphql;

class AppThemeExtension extends Controller
{
    public function checkAppStatus(Request $request)
    {
        // Get the active Shopify session
        $shopifySession = $request->get('shopifySession');
        $shop = $shopifySession->getShop();
        $accessToken = $shopifySession->getAccessToken();

        // The GraphQL query
        $query = <<<'GRAPHQL'
            {
              themes(first: 1, roles: [MAIN]) {
                nodes {
                  id
                  name
                  role
                  files(filenames: ["config/settings_data.json"]) {
                    nodes {
                      filename
                      body {
                        ... on OnlineStoreThemeFileBodyText {
                          content
                        }
                      }
                    }
                  }
                }
              }
            }
        GRAPHQL;

        $version = env('SHOPIFY_VERSION');
        // Send the request to Shopify Admin API
        $response = Http::withHeaders([
            'X-Shopify-Access-Token' => $accessToken,
            'Content-Type' => 'application/json',
        ])
            ->post("https://{$shop}/admin/api/{$version}/graphql.json", [
            'query' => $query,
        ]);

        // Decode the response
        $data = $response->json();
        // Optional: extract settings_data.json content directly
        $content = data_get($data, 'data.themes.nodes.0.files.nodes.0.body.content');
        $extensions = json_decode(preg_replace('#/\*.*?\*/#s', '', $content), true)['current']['blocks'] ?? [];
//        dd($extensions);
        $extension = array_values($extensions)[0] ?? null;
        return response()->json([
            'success' => $response->successful(),
            'active' => !$extension['disabled'],
        ]);
    }
}
