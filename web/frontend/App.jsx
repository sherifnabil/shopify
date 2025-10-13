import { BrowserRouter, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { QueryProvider, PolarisProvider, AppBridgeProvider } from "./components";

export default function App() {
    const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", { eager: true });
    const { t } = useTranslation();

    return (
        <PolarisProvider>
            <BrowserRouter>
                <AppBridgeProvider>
                    <QueryProvider>
                        <NavMenu>
                            <Link to="/" rel="home"/>
                            <Link to="/pagename">{t("NavigationMenu.pageName")}</Link>
                        </NavMenu>
                        <Routes pages={pages}/>
                    </QueryProvider>
                </AppBridgeProvider>
            </BrowserRouter>
        </PolarisProvider>
    );
}
