import { Grid, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ActivityFilters from "./ActivityFilters";
import { PagingParams } from "../../../app/models/pagination";
import InfiniteScroll from "react-infinite-scroller";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const { loadingActivities, activityRegistry, pagination, setPagingParams } =
        activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    const handleGetNext = () => {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadingActivities().then(() => setLoadingNext(false));
    };

    useEffect(() => {
        if (activityRegistry.size <= 1) loadingActivities();
    }, [loadingActivities, activityRegistry.size]);

    return (
        <Grid>
            <Grid.Column width="10">
                {activityStore.loadingInitial &&
                activityRegistry.size === 0 &&
                !loadingNext ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={
                            !loadingNext &&
                            !!pagination &&
                            pagination.currentPage < pagination.totalPages
                        }
                        initialLoad={false}
                    >
                        <ActivityList />
                    </InfiniteScroll>
                )}
            </Grid.Column>
            <Grid.Column width="6">
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    );
});
