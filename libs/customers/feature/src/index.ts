import { fromCustomers } from "./lib/+state/customers.selectors";

export const selectSelectedCustomer = fromCustomers.selectSelectedCustomer;
export { customersRoutes } from "./lib/customers.routes";
export { CustomersInterceptor } from "./lib/interceptors/customers.interceptor";
