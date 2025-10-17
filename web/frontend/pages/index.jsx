import {
    Page,
    Layout, Button,
    Banner, Card, SkeletonBodyText
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useAppStatus } from "../components/hooks/useExtensionStatus.js";
import  ProductsCard  from "../components/ProductsCard.jsx";
import { useAppBridge, SaveBar } from '@shopify/app-bridge-react';
import React, {useState} from "react";

export default function HomePage() {
    const { t } = useTranslation();
    const { extensionActivated, isLoading } = useAppStatus();
    const shopify = useAppBridge();

    const shopifyAppId = shopify.config.shop.replace('.myshopify.com', '')
    return (
    <Page narrowWidth>
      <TitleBar title={t("HomePage.title")} />
      <Layout>
        <Layout.Section>

            { isLoading &&
                <Layout.Section>
                    <Card sectioned>
                        <SkeletonBodyText   lines={2} />
                    </Card>
                </Layout.Section>
            }
              {extensionActivated === false && !isLoading && (
                  <Banner
                      title="Extension is disabled"
                      status="critical"
                      action={{
                          content: "Enable it ",
                          // url:  `/admin/themes/current/editor?context=apps&activateAppId=0199c882-9729-7a9b-8dcc-2e75e75cd35a`,
                          url: 'shopify://admin/themes/current/editor?context=apps&activateAppId=c728c2b1c5372a7aa9b738a61ad8ecc1/star_rating',
                          // url: `https://admin.shopify.com/store/${shopifyAppId}/themes/0199c882-9729-7a9b-8dcc-2e75e75cd35a/editor?context=apps`,
                          external: true,
                      }}
                  />
               )}
        </Layout.Section>
        <Layout.Section>
          <ProductsCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
