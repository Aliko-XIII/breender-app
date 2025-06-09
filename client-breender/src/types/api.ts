export interface ApiResponse {
    status: number;
    data: { [key: string]: any };
    message?: string;
}