import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Header, Icon } from "semantic-ui-react";

interface Props {
    setFiles: (files: File[]) => void;
}

export default function PhotoWidgetDropzone({ setFiles }: Props) {
    const dzStyles = {
        border: "dashed 3px #eee",
        borderColor: "#eee",
        borderRadius: "5px",
        paddingTop: "30px",
        height: 200,
    };

    const dzActive = {
        borderColor: "green",
    };

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setFiles(
                acceptedFiles.map((file: File) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
        },
        [setFiles]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <div
            {...getRootProps()}
            style={
                isDragActive
                    ? { ...dzStyles, ...dzActive, textAlign: "center" }
                    : { ...dzStyles, textAlign: "center" }
            }
        >
            <input {...getInputProps()} />
            <Icon name="upload" size="huge" />
            <Header content="Drop image here" />
        </div>
    );
}
