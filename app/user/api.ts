import type {components, paths} from "~/api/user";

type UserDetail = components["schemas"]["UserDetail"];
type ProblemDetail = components["schemas"]["ProblemDetail"];
type SignUpDto = components["schemas"]["SignUpDto"];
type Token = components["schemas"]["Token"];
type SignInDto = components["schemas"]["SignInDto"];

const API_BASE_URL = "http://localhost:8080";

async function apiRequest<T extends keyof paths>(
    endpoint: T,
    options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  return await fetch(url, {
    ...options,
    headers: headers,
  });
}