import { Button, Header, Segment } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ActivityFormValues } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from "uuid";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "./MyTextArea";
import MySelectInput from "./MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";

export default observer(function ActivityForm() {
    const { activityStore } = useStore();
    const { createActivity, updateActivity, loadActivity, loadingInitial } =
        activityStore;
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<ActivityFormValues>(
        new ActivityFormValues()
    );

    const validationSchema = Yup.object({
        title: Yup.string().required(),
        description: Yup.string().required(),
        category: Yup.string().required(),
        date: Yup.string().required().nullable(),
        city: Yup.string().required(),
        venue: Yup.string().required(),
    });

    useEffect(() => {
        if (id)
            loadActivity(id).then((activity) =>
                setActivity(new ActivityFormValues(activity))
            );
    }, [id, loadActivity]);

    const handleFormSubmit = (activity: ActivityFormValues) => {
        if (!activity.id) {
            activity.id = uuid();
            createActivity(activity).then(() =>
                navigate(`/activities/${activity.id}`)
            );
        } else {
            updateActivity(activity).then(() =>
                navigate(`/activities/${activity.id}`)
            );
        }
    };

    if (loadingInitial)
        return <LoadingComponent content="Loading activity..." />;

    return (
        <Segment clearing>
            <Header content="Activity Details" sub color="teal" />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={activity}
                onSubmit={(values) => handleFormSubmit(values)}
            >
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form
                        className="ui form"
                        onSubmit={handleSubmit}
                        autoComplete="off"
                    >
                        <MyTextInput placeholder="Title" name="title" />
                        <MyTextArea
                            placeholder="Description"
                            name="description"
                            rows={3}
                        />
                        <MySelectInput
                            placeholder="Category"
                            name="category"
                            options={categoryOptions}
                        />
                        <MyDateInput
                            placeholderText="Date"
                            name="date"
                            showTimeSelect
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                        />
                        <Header content="Location Details" sub color="teal" />
                        <MyTextInput placeholder="City" name="city" />
                        <MyTextInput placeholder="Venue" name="venue" />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting}
                            floated="right"
                            positive
                            type="submit"
                            content="Submit"
                        />
                        <Button
                            as={Link}
                            to="/activities"
                            floated="right"
                            type="button"
                            content="Cancel"
                        />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
});
