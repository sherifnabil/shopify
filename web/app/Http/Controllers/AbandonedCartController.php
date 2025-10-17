<?php

namespace App\Http\Controllers;

use GuzzleHttp\Promise\PromiseInterface;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AbandonedCartController extends Controller
{
    public function list(Request $request)
    {
        $response = $this->getRequest($request);

        if ($response->failed()) {
            return response()->json([
                'error' => 'Failed to fetch abandoned checkouts',
                'details' => $response->json(),
            ], $response->status());
        }
        $checkouts = $this->getCheckouts($response);

        return response()->json($checkouts);
    }

    /**
     * @return string
     */
    private function getGql(): string
    {
          return <<<'GRAPHQL'
            {
              abandonedCheckouts(first: 5) {
                edges {
                  node {
                    id
                    name
                    createdAt
                    customer {
                        email
                    }
                    abandonedCheckoutUrl
                    totalPriceSet {
                      shopMoney {
                        amount
                      }
                    }
                    lineItems(first: 3) {
                      edges {
                        node {
                          title
                          quantity
                        }
                      }
                    }
                  }
                }
              }
            }
        GRAPHQL;
    }

    /**
     * @param Request $request
     * @return PromiseInterface|Response
     */
    private function getRequest(Request $request): Response|PromiseInterface
    {
        $shopifySession = $request->get('shopifySession');
        $shop = $shopifySession->getShop();
        $accessToken = $shopifySession->getAccessToken();

        $query = $this->getGql();
        $response = Http::withHeaders([
            'X-Shopify-Access-Token' => $accessToken,
            'Content-Type' => 'application/json',
        ])->post("https://{$shop}/admin/api/2025-01/graphql.json", [
            'query' => $query,
        ]);
        return $response;
    }

    /**
     * @param PromiseInterface|Response $response
     * @return array
     */
    private function getCheckouts(PromiseInterface|Response $response): array
    {

        $data = $response->json()['data']['abandonedCheckouts']['edges'];

        $checkouts = [];
        foreach ($data as $key => $checkout) {
            $checkouts[$key]['email'] = $checkout['node']['customer']['email'];
            $checkouts[$key]['checkout_url'] = $checkout['node']['abandonedCheckoutUrl'];
            $checkouts[$key]['created_at'] = $checkout['node']['createdAt'];
            $checkouts[$key]['items_count'] = array_sum(array_column(array_column($checkout['node']['lineItems']['edges'], 'node'), 'quantity'));
            $checkouts[$key]['items_total'] = $checkout['node']['totalPriceSet']['shopMoney']['amount'];
        }
        return $checkouts;
    }
}
