<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Shopify\Clients\Graphql;

class CustomTextController extends Controller
{
    public function saveNote(Request $request): JsonResponse
    {
        $shopifySession = $request->get('shopifySession');
        $client = new Graphql($shopifySession->getShop(), $shopifySession->getAccessToken());

        if (!$shopGid = $this->getShopGid($client)) {
            return response()->json(['success' => false, 'message' => 'Could not retrieve shop ID'], 400);
        }

        $saved = $this->gqlSaveNote($shopGid, $request, $client);

        return response()->json([
            'success' => true,
            'message' => 'Shop metafield saved successfully!',
            'metafield' => $saved,
        ]);
    }

    /**
     * @param Graphql $client
     * @return mixed|null
     * @throws \JsonException
     * @throws \Shopify\Exception\HttpRequestException
     * @throws \Shopify\Exception\MissingArgumentException
     */
    private function getShopGid(Graphql $client): mixed
    {
        $shopQuery = <<<GQL
            {
                shop {
                    id
                    name
                }
            }
            GQL;

        $shopResponse = $client->query(["query" => $shopQuery]);
        $shopData = $shopResponse->getDecodedBody();

        $shopGid = $shopData['data']['shop']['id'] ?? null;
        return $shopGid;
    }

    /**
     * @param mixed $shopGid
     * @param Request $request
     * @param Graphql $client
     * @return mixed|null
     * @throws \JsonException
     * @throws \Shopify\Exception\HttpRequestException
     * @throws \Shopify\Exception\MissingArgumentException
     */
    private function gqlSaveNote(mixed $shopGid, Request $request, Graphql $client): mixed
    {
        $mutation = <<<GQL
                mutation metafieldsSet(\$metafields: [MetafieldsSetInput!]!) {
                  metafieldsSet(metafields: \$metafields) {
                    metafields {
                      id
                      namespace
                      key
                      value
                      type
                    }
                    userErrors {
                      field
                      message
                    }
                  }
                }
            GQL;
        $variables = [
            "metafields" => [[
                "ownerId" => $shopGid,
                "namespace" => "app_settings",
                "key" => "custom_text",
                "type" => "multi_line_text_field",
                "value" => $request->custom_text,
            ]]
        ];

        $response = $client->query([
            "query" => $mutation,
            "variables" => $variables,
        ]);


        $data = $response->getDecodedBody();
        return $data['data']['metafieldsSet']['metafields'][0] ?? null;
    }

    public function get(Request $request)
    {
        /** @var Session $session */
        $session = $request->get('shopifySession'); // From auth.shopify middleware
        $client = new Graphql($session->getShop(), $session->getAccessToken());

        $query = <<<'GQL'
    {
        shop {
            id
            name
            metafield(namespace: "app_settings", key: "custom_text") {
                id
                namespace
                key
                type
                value
                createdAt
                updatedAt
            }
        }
    }
    GQL;

        $response = $client->query(['query' => $query]);
        $data = $response->getDecodedBody();

        $metafield = $data['data']['shop']['metafield'] ?? null;

        if (!$metafield) {
            return response()->json([
                'success' => false,
                'message' => 'No metafield found in namespace app_settings with key custom_text'
            ]);
        }

        return response()->json([
            'success' => true,
            'metafield' => $metafield,
        ]);
    }

}
