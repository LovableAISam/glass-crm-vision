
import { useAppCustomization } from "@src/packages/app-customization/context/AppCustomizationContext";
import { UploadDocumentData } from "@woi/uploadDocument";
import { AppCustomizationContentProps } from "../../../AppCustomizationContent";

function useAppIcon(_: AppCustomizationContentProps) {
  const [{ themeColor, appIcon }, dispatch] = useAppCustomization();

  const onUpload = (file: UploadDocumentData | null) => {
    dispatch({
      type: 'SET_APP_ICON',
      payload: {
        selectedFile: file,
      }
    })
  }

  const onChangeImage = (file: string | null) => {
    dispatch({
      type: 'SET_APP_ICON',
      payload: {
        selectedImage: file,
      }
    })
  }

  const onChangeAppName = (appName: string) => {
    dispatch({
      type: 'SET_APP_ICON',
      payload: {
        appName,
      }
    })
  }

  return {
    themeColor,
    appIcon,
    onUpload,
    onChangeImage,
    onChangeAppName,
  }
}

export default useAppIcon;