import { fromCustomers } from './lib/+state/customers.selectors';
import { customersRoutes } from './lib/customers.routes';

export default customersRoutes;

export const selectSelectedCustomer = fromCustomers.selectSelectedCustomer;
export { CustomersInterceptor } from './lib/interceptors/customers.interceptor';
