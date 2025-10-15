import {
    SkeletonPage,
    Layout,
    LegacyCard,
    SkeletonBodyText,
} from '@shopify/polaris';
import React from 'react';

export function Skeleton() {
    return (
        <SkeletonPage title="" primaryAction>
            <Layout>
                <Layout.Section>
                    <LegacyCard sectioned>
                        <SkeletonBodyText />
                    </LegacyCard>
                    <LegacyCard sectioned title="">
                        <SkeletonBodyText />
                    </LegacyCard>
                    <LegacyCard sectioned title="">
                        <SkeletonBodyText />
                    </LegacyCard>
                </Layout.Section>
                <Layout.Section variant="oneThird">
                    <LegacyCard title="">
                        <LegacyCard.Section>
                            <SkeletonBodyText lines={2} />
                        </LegacyCard.Section>
                        <LegacyCard.Section>
                            <SkeletonBodyText lines={1} />
                        </LegacyCard.Section>
                    </LegacyCard>
                    <LegacyCard title="" >
                        <LegacyCard.Section>
                            <SkeletonBodyText lines={2} />
                        </LegacyCard.Section>
                        <LegacyCard.Section>
                            <SkeletonBodyText lines={2} />
                        </LegacyCard.Section>
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );
}
