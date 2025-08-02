export const Toast = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const useToast = () => ({ toast: () => {} });