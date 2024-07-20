import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import { useEffect, useState } from "react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props {
    uploadPhoto: (file: Blob) => void;
    loading: boolean;
}

export default function PhotoUploadWidget({ uploadPhoto, loading }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const [cropper, setCropper] = useState<Cropper>();

    const onCrop = () => {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob((blob) => uploadPhoto(blob!));
        }
    };

    useEffect(() => {
        return () => {
            files.forEach((file: object & { preview?: string }) =>
                URL.revokeObjectURL(file.preview!)
            );
        };
    }, [files]);

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color="teal" content="Step 1 - Add Photo" />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color="teal" content="Step 2 - Resize image" />
                {files && files.length > 0 && (
                    <PhotoWidgetCropper
                        setCropper={setCropper}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        imagePreview={(files[0] as any).preview}
                    />
                )}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color="teal" content="Step 3 - Preview & Upload" />
                {files && files.length > 0 && (
                    <>
                        <div
                            className="img-preview"
                            style={{ minHeight: 200, overflow: "hidden" }}
                        />
                        <Button.Group widths={4}>
                            <Button
                                loading={loading}
                                onClick={onCrop}
                                positive
                                icon="check"
                            />
                            <Button
                                disabled={loading}
                                onClick={() => setFiles([])}
                                icon="close"
                            />
                        </Button.Group>
                    </>
                )}
            </Grid.Column>
        </Grid>
    );
}
