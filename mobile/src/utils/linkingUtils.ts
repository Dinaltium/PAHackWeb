import { Platform } from "react-native";

// App scheme for deep linking
export const APP_SCHEME = "pacampusmap";

// Define linking configuration for React Navigation
export const linking = {
  prefixes: [
    /* Prefix for all deep links */
    `${APP_SCHEME}://`,
    // Add web URL if deploying to the web
    "https://pacampus.edu/map",
    "http://pacampus.edu/map",
  ],
  config: {
    /* Configuration for linking paths to screens */
    screens: {
      Main: "main",
      BuildingDetail: {
        path: "building/:buildingId/:buildingName?",
        parse: {
          buildingId: (buildingId: string) => parseInt(buildingId, 10),
          buildingName: (buildingName: string) =>
            decodeURIComponent(buildingName),
        },
        stringify: {
          buildingId: (id: number) => id.toString(),
          buildingName: (name: string) => encodeURIComponent(name),
        },
      },
      DistanceCalculator: "distance",
    },
  },
  // Custom handler function to handle specific deep links
  async getInitialURL() {
    console.log("getInitialURL invoked");
    // Handle app-specific logic here if needed
    console.log("Returning null as initial URL");
    return null;
  },
};

// Function to create deep link URLs
export function createDeepLink(
  screen: string,
  params?: Record<string, any>
): string {
  let path = "";
  const queryParams: string[] = [];

  switch (screen) {
    case "BuildingDetail":
      if (params?.buildingId) {
        const buildingName = params.buildingName
          ? `/${encodeURIComponent(params.buildingName)}`
          : "";
        path = `building/${params.buildingId}${buildingName}`;
      }
      break;
    case "DistanceCalculator":
      path = "distance";
      if (params?.from) {
        queryParams.push(`from=${encodeURIComponent(params.from)}`);
      }
      if (params?.to) {
        queryParams.push(`to=${encodeURIComponent(params.to)}`);
      }
      break;
    case "Schedule":
      path = "schedule";
      if (params?.date) {
        queryParams.push(`date=${encodeURIComponent(params.date)}`);
      }
      break;
    default:
      path = "";
  }

  let url = `${APP_SCHEME}://${path}`;
  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }

  return url;
}

// Function to open deep links in web version
export function getWebEquivalentURL(deepLink: string): string {
  const webBase = "https://pacampus.edu/map";
  const path = deepLink.replace(`${APP_SCHEME}://`, "");
  return `${webBase}/${path}`;
}

// Function to share building info
export function getShareableLink(
  screen: string,
  params?: Record<string, any>
): string {
  const deepLink = createDeepLink(screen, params);
  return Platform.OS === "web" ? getWebEquivalentURL(deepLink) : deepLink;
}
