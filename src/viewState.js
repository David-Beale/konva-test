import { proxy } from "valtio";

export const viewState = proxy({ views: {}, cellLookup: {}, rowLookup: {} });
