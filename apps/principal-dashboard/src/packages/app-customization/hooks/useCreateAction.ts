// Cores
import { useEffect, useRef } from "react";

// Hooks & Utils
import { useSnackbar } from "notistack";
import { useAppCustomization } from "../context/AppCustomizationContext";
import { useApplicationFetcher, useApplicationUpdateFetcher } from "@woi/service/principal";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import useRouteRedirection from "@src/shared/hooks/useRouteRedirection";

// Types & Consts
import { AppCustomizationContentProps } from "../containers/AppCustomizationContent";
import { TextGetter } from "@woi/core";
import { useMutation } from "@tanstack/react-query";
import { ApplicationCreateRequest } from "@woi/service/principal/admin/application/applicationCreate";
import { ApplicationUpdateRequest } from "@woi/service/principal/admin/application/applicationUpdate";

function useCreateAction(props: AppCustomizationContentProps) {
  const { coId, applicationId } = props;
  const { onNavigate } = useRouteRedirection();
  const { enqueueSnackbar } = useSnackbar();
  const [appCustomizationSpec] = useAppCustomization();
  const contextRef = useRef(appCustomizationSpec);
  const { baseUrl } = useBaseUrl();

  useEffect(() => {
    contextRef.current = appCustomizationSpec;
  }, [appCustomizationSpec])

  const { mutate: mutateApplicationCreate, status: mutateApplicationCreateStatus } = useMutation(
    async (form: ApplicationCreateRequest) => await useApplicationFetcher(baseUrl, form),
    {
      onSuccess: (response) => {
        const { error, errorData, displayMessage } = response;

        // TODO: replae this validation with only !error
        // adding displayMessage === '' is only for bypass unhint error code 500 from API
        if (!error || displayMessage === '') {
          enqueueSnackbar("App Customization successfully added!", {
            variant: "success",
          });
          onNavigate('/app-customization');
        } else {
          enqueueSnackbar(errorData?.details?.[0] || "App Customization failed!", { variant: "error" });
        }
      },
      onError: () => {
        enqueueSnackbar("App Customization failed!", { variant: "error" });
      }
    }
  );

  const { mutate: mutateApplicationUpdate, status: mutateApplicationUpdateStatus } = useMutation(
    async (form: ApplicationUpdateRequest) => await useApplicationUpdateFetcher(baseUrl, applicationId!, form),
    {
      onSuccess: (response) => {
        const { error, errorData, displayMessage } = response;

        // TODO: replae this validation with only !error
        // adding displayMessage === '' is only for bypass unhint error code 500 from API
        if (!error || displayMessage === '') {
          enqueueSnackbar("App Customization successfully updated!", {
            variant: "success",
          });
          onNavigate('/app-customization');
        } else {
          enqueueSnackbar(errorData?.details?.[0] || "App Customization failed!", { variant: "error" });
        }
      },
      onError: () => {
        enqueueSnackbar("App Customization failed!", { variant: "error" });
      }
    }
  );

  const onSubmit = async () => {
    const { themeColor, splashScreen, appIcon, onBoardingScreens } = contextRef.current;
    if (applicationId) {
      mutateApplicationUpdate({
        applicationId,
        color: themeColor.replace('#', ''),
        splashScreenUrl: TextGetter.getterString(splashScreen.selectedFile?.docPath || splashScreen.selectedImage),
        iconUrl: TextGetter.getterString(appIcon.selectedFile?.docPath || appIcon.selectedImage),
        onboardingScreenDTOList: onBoardingScreens.map(onBoardingScreen => ({
          imageUrl: TextGetter.getterString(onBoardingScreen.selectedFile?.docPath || onBoardingScreen.selectedImage),
          headline: onBoardingScreen.title,
          description: onBoardingScreen.description,
        })),
      })
    } else {
      mutateApplicationCreate({
        communityOwnerId: coId ?? '',
        name: appIcon.appName,
        color: themeColor.replace('#', ''),
        splashScreenUrl: TextGetter.getterString(splashScreen.selectedFile?.docPath || splashScreen.selectedImage),
        iconUrl: TextGetter.getterString(appIcon.selectedFile?.docPath || appIcon.selectedImage),
        onboardingScreenDTOList: onBoardingScreens.map(onBoardingScreen => ({
          imageUrl: TextGetter.getterString(onBoardingScreen.selectedFile?.docPath || onBoardingScreen.selectedImage),
          headline: onBoardingScreen.title,
          description: onBoardingScreen.description,
        }))
      })
    }
  };

  return {
    loadingSubmission: mutateApplicationCreateStatus === 'loading' || mutateApplicationUpdateStatus === 'loading',
    onSubmit,
  }
}

export default useCreateAction;