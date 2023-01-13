import { useSnackbar, VariantType, WithSnackbarProps } from "notistack";

let useSnackbarRef: WithSnackbarProps;

export function SnackbarUtilProvider(): JSX.Element {
    useSnackbarRef = useSnackbar();
    return <></>;
}

export class SnackbarUtil {
    public static enqueueSnackbar(
        message: string,
        variant: VariantType = "default"
    ) {
        useSnackbarRef.enqueueSnackbar(message, { variant });
    }

    public static success(message: string) {
        this.enqueueSnackbar(message, "success");
    }

    public static warning(message: string) {
        this.enqueueSnackbar(message, "warning");
    }

    public static info(message: string) {
        this.enqueueSnackbar(message, "info");
    }

    public static error(message: string) {
        this.enqueueSnackbar(message, "error");
    }
}
