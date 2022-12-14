import { Button } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import { useHash } from "../../../hooks/useHash";
import { useInterval } from "../../../hooks/useInterval";
import { useQuery } from "../../../hooks/useQuery";
import { setLocale, t } from "../../../i18n/util";
import { authStore } from "../../../stores/AuthStore";
import { generalStore } from "../../../stores/GeneralStore";
import { sleep } from "../../../util/helpers";
import { BaseRoutes } from "../../app/router/BaseRoutes";
import { usePushRoute } from "../../app/router/history";

const Uptime = () => {
    const [uptime, setUptime] = React.useState(0);
    useInterval(() => {
        setUptime(uptime + 1);
    }, 1000);

    return <p>{t("common.uptime", { uptime })}</p>;
};

const QueryAndHash = () => {
    const query = useQuery<any>();
    const hash = useHash<any>();

    return (
        <>
            {query && <p>Query: {JSON.stringify(query)}</p>}
            {hash && <p>Hash: {JSON.stringify(hash)}</p>}
        </>
    );
};

export const DashboardSite = observer(() => {
    const pushRoute = usePushRoute();

    const languages = (
        <div>
            <Button
                variant="outlined"
                onClick={() => {
                    setLocale("de");
                }}
                style={{ marginRight: 8 }}
                disabled={generalStore.locale === "de"}
            >
                {t("language.german")}
            </Button>
            <Button
                variant="outlined"
                onClick={() => {
                    setLocale("en");
                }}
                disabled={generalStore.locale === "en"}
            >
                {t("language.english")}
            </Button>
        </div>
    );

    const loading = (
        <>
            <Button
                variant="outlined"
                onClick={async () => {
                    generalStore.isLoading = true;
                    await sleep(100);
                    generalStore.isLoading = false;
                }}
            >
                {t("button.loadingShort")}
            </Button>
            <Button
                variant="outlined"
                onClick={async () => {
                    generalStore.isLoading = true;
                    await sleep(1000);
                    generalStore.isLoading = false;
                }}
            >
                {t("button.loadingLong")}
            </Button>
        </>
    );

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginTop: 16,
                maxWidth: 400,
                margin: "0 auto",
                alignItems: "center",
            }}
        >
            <h1 style={{ margin: 24, textAlign: "center" }}>{t("screen.dashboard.hello")}</h1>
            <Uptime />
            {languages}
            {loading}
            <QueryAndHash />
            <Button
                onClick={() => {
                    authStore.logout();
                    pushRoute(BaseRoutes.ROOT);
                }}
            >
                {t("common.logout")}
            </Button>
        </div>
    );
});
