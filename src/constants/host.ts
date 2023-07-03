export const HOST_API: string | undefined = process.env.API_VERSION
  ? process.env.API_CORE_ENDPOINT?.concat(process.env.API_VERSION)
  : process.env.API_CORE_ENDPOINT?.concat("/api/v1");

export const LOYALCHAIN_API: string | undefined = process.env.REACT_APP_LOYALCHAIN_API